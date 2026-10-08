import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_PRICING, PricingConfig } from '@/src/config/pricing';

const PRICING_DOC_PATH = 'settings/pricing';

/**
 * Fetches the active pricing configuration from Firestore.
 * Falls back to DEFAULT_PRICING if document does not exist or network fails.
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        stamp100Chennai: typeof data.stamp100Chennai === 'number' ? data.stamp100Chennai : DEFAULT_PRICING.stamp100Chennai,
        stamp100TamilNadu: typeof data.stamp100TamilNadu === 'number' ? data.stamp100TamilNadu : DEFAULT_PRICING.stamp100TamilNadu,
        stamp200Chennai: typeof data.stamp200Chennai === 'number' ? data.stamp200Chennai : DEFAULT_PRICING.stamp200Chennai,
        stamp200TamilNadu: typeof data.stamp200TamilNadu === 'number' ? data.stamp200TamilNadu : DEFAULT_PRICING.stamp200TamilNadu,
        notaryExtraFee: typeof data.notaryExtraFee === 'number' ? data.notaryExtraFee : DEFAULT_PRICING.notaryExtraFee,
        updatedAt: data.updatedAt,
        updatedBy: data.updatedBy,
      };
    }
  } catch (err) {
    console.warn('Could not read pricing from Firestore, falling back to defaults:', err);
  }
  return DEFAULT_PRICING;
}

/**
 * Updates the pricing configuration in Firestore.
 * Requires administrator credentials according to firestore.rules.
 */
export async function savePricingConfig(
  config: Partial<PricingConfig>,
  adminEmail: string
): Promise<void> {
  const docRef = doc(db, 'settings', 'pricing');
  const now = new Date().toISOString();
  await setDoc(docRef, {
    stamp100Chennai: Number(config.stamp100Chennai ?? DEFAULT_PRICING.stamp100Chennai),
    stamp100TamilNadu: Number(config.stamp100TamilNadu ?? DEFAULT_PRICING.stamp100TamilNadu),
    stamp200Chennai: Number(config.stamp200Chennai ?? DEFAULT_PRICING.stamp200Chennai),
    stamp200TamilNadu: Number(config.stamp200TamilNadu ?? DEFAULT_PRICING.stamp200TamilNadu),
    notaryExtraFee: Number(config.notaryExtraFee ?? DEFAULT_PRICING.notaryExtraFee),
    updatedAt: now,
    updatedBy: adminEmail,
  });
}
