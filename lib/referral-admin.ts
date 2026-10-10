import { randomBytes } from 'crypto';
import { type DocumentData, type Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { DEFAULT_REFERRAL_REWARD_AMOUNT } from '@/lib/referral-utils';

export interface ReferralAccount {
  uid: string;
  code: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export function getReferralRewardAmount(data: DocumentData | undefined) {
  const amount = data?.rewardAmount;
  return typeof amount === 'number' && Number.isSafeInteger(amount) && amount >= 0 && amount <= 100_000
    ? amount
    : DEFAULT_REFERRAL_REWARD_AMOUNT;
}

export async function getOrCreateReferralAccount(
  uid: string,
  db: Firestore = getAdminDb(),
): Promise<ReferralAccount> {
  const accountRef = db.collection('referralAccounts').doc(uid);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomBytes(6).toString('hex').toUpperCase();
    const codeRef = db.collection('referralCodes').doc(code);
    const now = new Date().toISOString();

    const account = await db.runTransaction(async (transaction) => {
      const existingAccount = await transaction.get(accountRef);
      if (existingAccount.exists) return existingAccount.data() as ReferralAccount;

      const existingCode = await transaction.get(codeRef);
      if (existingCode.exists) return null;

      const newAccount: ReferralAccount = {
        uid,
        code,
        balance: 0,
        createdAt: now,
        updatedAt: now,
      };
      transaction.create(accountRef, newAccount);
      transaction.create(codeRef, { uid, createdAt: now });
      return newAccount;
    });

    if (account) return account;
  }

  throw new Error('Could not generate a unique referral code after several attempts.');
}

export async function confirmPaidOrderAndGrantReferral(
  orderId: string,
  paymentDetails: {
    transactionId?: string;
    merchantOrderId?: string;
    paymentUpdates?: Record<string, unknown>;
  } = {},
) {
  const db = getAdminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const now = new Date().toISOString();
  const preflightOrder = await orderRef.get();
  if (!preflightOrder.exists) throw new Error(`Order ${orderId} was not found.`);
  const preflightUid = preflightOrder.data()?.ownerUid;
  if (typeof preflightUid !== 'string' || !preflightUid) {
    throw new Error(`Order ${orderId} is missing its customer account reference.`);
  }
  const firstPaidOrderRef = db.collection('referralFirstPaidOrders').doc(preflightUid);
  const preflightFirstPaid = await firstPaidOrderRef.get();
  const historicalPaidOrders = preflightFirstPaid.exists
    ? null
    : await db.collection('orders').where('ownerUid', '==', preflightUid).get();
  const hasHistoricalPaidOrder = historicalPaidOrders?.docs.some(
    (snapshot) => snapshot.id !== orderId && snapshot.data().payment?.status === 'Paid',
  ) ?? false;

  return db.runTransaction(async (transaction) => {
    const orderSnapshot = await transaction.get(orderRef);
    if (!orderSnapshot.exists) throw new Error(`Order ${orderId} was not found.`);

    const order = orderSnapshot.data()!;
    if (order.payment?.status === 'Paid') return { alreadyPaid: true, rewardAmount: 0 };

    const firstPaidSnapshot = await transaction.get(firstPaidOrderRef);
    const referralCode = typeof order.referralCode === 'string' ? order.referralCode : '';
    const referralCodeRef = referralCode
      ? db.collection('referralCodes').doc(referralCode)
      : null;
    const referralCodeSnapshot = referralCodeRef
      ? await transaction.get(referralCodeRef)
      : null;
    const referralSettingsRef = db.collection('settings').doc('referrals');
    const referralSettingsSnapshot = referralCodeSnapshot?.exists
      ? await transaction.get(referralSettingsRef)
      : null;
    const referrerUid = referralCodeSnapshot?.data()?.uid;
    const referrerAccountRef =
      typeof referrerUid === 'string' && referrerUid !== order.ownerUid
        ? db.collection('referralAccounts').doc(referrerUid)
        : null;
    const referrerAccountSnapshot = referrerAccountRef
      ? await transaction.get(referrerAccountRef)
      : null;
    const rewardRef = db.collection('referralRewards').doc(order.ownerUid);
    const rewardSnapshot = referrerAccountSnapshot?.exists
      ? await transaction.get(rewardRef)
      : null;
    const reservationRef = db.collection('referralReservations').doc(orderId);
    const reservationSnapshot = await transaction.get(reservationRef);

    const paidOrderUpdate: Record<string, unknown> = {
      'payment.status': 'Paid',
      'payment.paidAt': order.payment?.paidAt || now,
      status: 'Under verification',
      updatedAt: now,
      ...paymentDetails.paymentUpdates,
    };
    if (paymentDetails.transactionId) {
      paidOrderUpdate['payment.phonepeTransactionId'] = paymentDetails.transactionId;
    }
    if (paymentDetails.merchantOrderId) {
      paidOrderUpdate['payment.phonepeMerchantOrderId'] = paymentDetails.merchantOrderId;
    }
    transaction.update(orderRef, paidOrderUpdate);

    let rewardAmount = 0;
    if (!firstPaidSnapshot.exists) {
      transaction.create(firstPaidOrderRef, {
        uid: order.ownerUid,
        orderId,
        createdAt: now,
      });

      if (
        !hasHistoricalPaidOrder &&
        referralCodeSnapshot?.exists &&
        typeof referrerUid === 'string' &&
        referrerUid !== order.ownerUid &&
        !referrerAccountSnapshot?.exists
      ) {
        throw new Error('Referral account is missing for an active referral code.');
      }

      if (
        !hasHistoricalPaidOrder &&
        !rewardSnapshot?.exists &&
        referrerAccountRef &&
        referrerAccountSnapshot?.exists &&
        typeof referrerUid === 'string' &&
        referrerUid !== order.ownerUid
      ) {
        rewardAmount = getReferralRewardAmount(referralSettingsSnapshot?.data());
        if (rewardAmount > 0) {
          const currentBalance = Number(referrerAccountSnapshot.data()?.balance || 0);
          const updatedBalance = currentBalance + rewardAmount;
          if (!Number.isSafeInteger(currentBalance) || currentBalance < 0 || !Number.isSafeInteger(updatedBalance)) {
            throw new Error('Referrer credit balance is invalid and cannot be updated safely.');
          }
          transaction.update(referrerAccountRef, { balance: updatedBalance, updatedAt: now });
          transaction.create(rewardRef, {
            referredUid: order.ownerUid,
            referrerUid,
            orderId,
            amount: rewardAmount,
            createdAt: now,
          });
          transaction.create(db.collection('referralLedger').doc(`reward_${order.ownerUid}`), {
            ownerUid: referrerUid,
            type: 'reward',
            amount: rewardAmount,
            referredUid: order.ownerUid,
            orderId,
            createdAt: now,
          });
        }
      }
    }

    if (reservationSnapshot.exists && reservationSnapshot.data()?.status === 'reserved') {
      transaction.update(reservationRef, { status: 'consumed', updatedAt: now });
      transaction.create(db.collection('referralLedger').doc(`redeem_${orderId}`), {
        ownerUid: order.ownerUid,
        type: 'redeem',
        amount: reservationSnapshot.data()?.amount || 0,
        orderId,
        createdAt: now,
      });
    }

    return { alreadyPaid: false, rewardAmount };
  });
}

export async function reserveReferralCreditForOrder(
  orderId: string,
  uid: string,
  amount: number,
) {
  const db = getAdminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const accountRef = db.collection('referralAccounts').doc(uid);
  const reservationRef = db.collection('referralReservations').doc(orderId);
  const now = new Date().toISOString();

  return db.runTransaction(async (transaction) => {
    const [orderSnapshot, accountSnapshot, reservationSnapshot] = await Promise.all([
      transaction.get(orderRef),
      transaction.get(accountRef),
      transaction.get(reservationRef),
    ]);
    if (!orderSnapshot.exists) throw new Error('Order not found.');
    if (orderSnapshot.data()?.ownerUid !== uid) throw new Error('Order access denied.');
    if (orderSnapshot.data()?.payment?.status === 'Paid') throw new Error('This order is already paid.');

    if (reservationSnapshot.exists && reservationSnapshot.data()?.status === 'reserved') {
      const existingAmount = Number(reservationSnapshot.data()?.amount);
      if (existingAmount !== amount) {
        throw new Error('A different referral credit amount is already reserved for this order.');
      }
      return { balance: Number(accountSnapshot.data()?.balance || 0), reserved: existingAmount };
    }
    if (amount === 0) return { balance: Number(accountSnapshot.data()?.balance || 0), reserved: 0 };
    if (!accountSnapshot.exists) throw new Error('No referral credit balance was found for this account.');
    if (reservationSnapshot.exists && reservationSnapshot.data()?.status === 'consumed') {
      throw new Error('Referral credit has already been used for this order.');
    }

    const currentBalance = Number(accountSnapshot.data()?.balance || 0);
    if (!Number.isSafeInteger(currentBalance) || amount > currentBalance) {
      throw new Error('Your available referral credit changed. Refresh the balance and try again.');
    }

    transaction.update(accountRef, { balance: currentBalance - amount, updatedAt: now });
    const attempt = Number(reservationSnapshot.data()?.attempt || 0) + 1;
    transaction.set(reservationRef, {
      ownerUid: uid,
      orderId,
      amount,
      attempt,
      status: 'reserved',
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(db.collection('referralLedger').doc(`reserve_${orderId}_${attempt}`), {
      ownerUid: uid,
      type: 'reserve',
      amount,
      orderId,
      createdAt: now,
    });
    return { balance: currentBalance - amount, reserved: amount };
  });
}

export async function releaseReferralReservation(orderId: string) {
  const db = getAdminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const reservationRef = db.collection('referralReservations').doc(orderId);
  const now = new Date().toISOString();

  return db.runTransaction(async (transaction) => {
    const orderSnapshot = await transaction.get(orderRef);
    const reservationSnapshot = await transaction.get(reservationRef);
    if (
      !orderSnapshot.exists ||
      !reservationSnapshot.exists ||
      reservationSnapshot.data()?.status !== 'reserved'
    ) {
      return false;
    }

    const order = orderSnapshot.data()!;
    if (order.payment?.status === 'Paid') return false;
    const accountRef = db.collection('referralAccounts').doc(order.ownerUid);
    const accountSnapshot = await transaction.get(accountRef);
    if (!accountSnapshot.exists) throw new Error('Referral account is missing for a reserved credit.');

    const amount = Number(reservationSnapshot.data()?.amount);
    transaction.update(accountRef, {
      balance: Number(accountSnapshot.data()?.balance || 0) + amount,
      updatedAt: now,
    });
    transaction.update(reservationRef, { status: 'released', updatedAt: now });
    transaction.create(db.collection('referralLedger').doc(`release_${orderId}`), {
      ownerUid: order.ownerUid,
      type: 'release',
      amount,
      orderId,
      createdAt: now,
    });
    return true;
  });
}
