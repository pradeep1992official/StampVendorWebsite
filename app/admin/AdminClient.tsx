'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  FileText, 
  Eye, 
  Send, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  X,
  ExternalLink,
  ChevronRight,
  Printer,
  IndianRupee,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc
} from 'firebase/firestore';
import { Order, OrderStatus } from '@/lib/types';
import { checkIsAdmin } from '@/lib/order-service';
import { VENDOR_CONFIG } from '@/src/config/vendor';
import { ADMIN_EMAIL, isUserAdmin } from '@/src/config/admin';
import { RentalAgreementDocument } from '@/components/agreement/RentalAgreementDocument';
import { DEFAULT_PRICING, PricingConfig } from '@/src/config/pricing';
import { getPricingConfig, savePricingConfig } from '@/lib/pricing-service';

export function AdminClient() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingRole, setCheckingRole] = useState<boolean>(true);

  // Active Tab: Orders Fulfillment or Pricing Settings
  const [activeTab, setActiveTab] = useState<'orders' | 'pricing'>('orders');

  // Pricing State
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [savingPricing, setSavingPricing] = useState<boolean>(false);
  const [pricingSavedToast, setPricingSavedToast] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<OrderStatus>('Under verification');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Correction Request State
  const [correctionMsg, setCorrectionMsg] = useState<string>('');
  const [showCorrectionForm, setShowCorrectionForm] = useState<boolean>(false);

  // Courier Dispatch State
  const [courierName, setCourierName] = useState<'India Post Speed Post' | 'Blue Dart Express'>('India Post Speed Post');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [showCourierForm, setShowCourierForm] = useState<boolean>(false);

  // Stamping Agreement View State
  const [showAgreementPrint, setShowAgreementPrint] = useState<boolean>(false);

  const fetchOrderList = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      snap.forEach((d) => list.push(d.data() as Order));
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Verify Admin Role on Auth Ready and fetch orders asynchronously
  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;
    async function verifyAndInit() {
      try {
        const hasClaim = await checkIsAdmin();
        if (!isMounted) return;
        setIsAdmin(hasClaim);
        setCheckingRole(false);

        if (hasClaim) {
          await fetchOrderList();
          try {
            const cfg = await getPricingConfig();
            if (isMounted) setPricingConfig(cfg);
          } catch (e) {
            console.warn('Could not load pricing settings:', e);
          }
        }
      } catch (err) {
        console.error('Role verification error:', err);
        if (isMounted) {
          setIsAdmin(false);
          setCheckingRole(false);
        }
      }
    }

    verifyAndInit();

    return () => {
      isMounted = false;
    };
  }, [user, fetchOrderList]);

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !user) return;
    setUpdatingStatus(true);
    try {
      const orderRef = doc(db, 'orders', selectedOrder.orderId);
      const nowIso = new Date().toISOString();

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: nowIso,
        notes: statusNotes ? `${selectedOrder.notes || ''}\n[${nowIso}] ${statusNotes}`.trim() : selectedOrder.notes,
      });

      // Write administrative audit log
      const logId = `LOG_${Date.now()}`;
      await setDoc(doc(db, 'adminLogs', logId), {
        logId,
        orderId: selectedOrder.orderId,
        adminUid: user.uid,
        adminEmail: user.email || 'admin',
        action: 'STATUS_CHANGE',
        previousStatus: selectedOrder.status,
        newStatus,
        notes: statusNotes || 'Status updated from admin console',
        timestamp: nowIso,
      });

      // Update local state
      const updated = { ...selectedOrder, status: newStatus, updatedAt: nowIso };
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setStatusNotes('');
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Request Correction
  const handleSendCorrectionRequest = async () => {
    if (!selectedOrder || !user || !correctionMsg.trim()) return;
    setUpdatingStatus(true);
    try {
      const orderRef = doc(db, 'orders', selectedOrder.orderId);
      const nowIso = new Date().toISOString();

      await updateDoc(orderRef, {
        status: 'Documents needed' as OrderStatus,
        correctionMessage: correctionMsg.trim(),
        updatedAt: nowIso,
      });

      // Admin log
      const logId = `LOG_${Date.now()}`;
      await setDoc(doc(db, 'adminLogs', logId), {
        logId,
        orderId: selectedOrder.orderId,
        adminUid: user.uid,
        adminEmail: user.email || 'admin',
        action: 'CORRECTION_REQUESTED',
        previousStatus: selectedOrder.status,
        newStatus: 'Documents needed',
        notes: `Correction request: ${correctionMsg.trim()}`,
        timestamp: nowIso,
      });

      const updated = {
        ...selectedOrder,
        status: 'Documents needed' as OrderStatus,
        correctionMessage: correctionMsg.trim(),
        updatedAt: nowIso,
      };
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setShowCorrectionForm(false);
      setCorrectionMsg('');
      alert('Correction message successfully sent to customer.');
    } catch (err) {
      console.error('Error sending correction request:', err);
      alert('Failed to send correction request.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Courier Dispatch
  const handleDispatchCourier = async () => {
    if (!selectedOrder || !user || !trackingNumber.trim()) return;
    setUpdatingStatus(true);
    try {
      const orderRef = doc(db, 'orders', selectedOrder.orderId);
      const nowIso = new Date().toISOString();

      const courierData = {
        courierName,
        trackingNumber: trackingNumber.trim(),
        dispatchedAt: nowIso,
      };

      await updateDoc(orderRef, {
        status: 'Dispatched' as OrderStatus,
        courier: courierData,
        updatedAt: nowIso,
      });

      // Admin log
      const logId = `LOG_${Date.now()}`;
      await setDoc(doc(db, 'adminLogs', logId), {
        logId,
        orderId: selectedOrder.orderId,
        adminUid: user.uid,
        adminEmail: user.email || 'admin',
        action: 'COURIER_DISPATCHED',
        previousStatus: selectedOrder.status,
        newStatus: 'Dispatched',
        notes: `Dispatched with ${courierName}, Tracking: ${trackingNumber.trim()}`,
        timestamp: nowIso,
      });

      const updated = {
        ...selectedOrder,
        status: 'Dispatched' as OrderStatus,
        courier: courierData,
        updatedAt: nowIso,
      };
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setShowCourierForm(false);
      setTrackingNumber('');
      alert('Order marked as Dispatched with tracking code.');
    } catch (err) {
      console.error('Courier dispatch error:', err);
      alert('Failed to update courier tracking.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Save Pricing Rates
  const handleSavePricing = async () => {
    if (!user) return;
    setSavingPricing(true);
    setPricingSavedToast(false);
    try {
      await savePricingConfig(pricingConfig, user.email || ADMIN_EMAIL);
      // Administrative Audit Log
      const logId = `LOG_${Date.now()}`;
      await setDoc(doc(db, 'adminLogs', logId), {
        logId,
        orderId: 'PRICING_CONFIG',
        adminUid: user.uid,
        adminEmail: user.email || 'admin',
        action: 'PRICING_UPDATED',
        notes: `Updated prices: 100 Chennai: ₹${pricingConfig.stamp100Chennai}, 100 TN: ₹${pricingConfig.stamp100TamilNadu}, 200 Chennai: ₹${pricingConfig.stamp200Chennai}, 200 TN: ₹${pricingConfig.stamp200TamilNadu}, Notary: ₹${pricingConfig.notaryExtraFee}`,
        timestamp: new Date().toISOString(),
      });
      setPricingSavedToast(true);
      setTimeout(() => setPricingSavedToast(false), 4000);
    } catch (err) {
      console.error('Failed to save pricing config:', err);
      alert('Failed to save pricing changes. Please check permissions.');
    } finally {
      setSavingPricing(false);
    }
  };

  // Handle Reset to Default Rates
  const handleResetPricing = () => {
    if (window.confirm('Reset all pricing rates to default values (Rs.350 / 400 / 450 / 500 / 200)?')) {
      setPricingConfig(DEFAULT_PRICING);
    }
  };

  // Filters
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderId.toLowerCase().includes(q) ||
      o.ownerDetails.fullName.toLowerCase().includes(q) ||
      o.ownerDetails.phone.includes(q) ||
      o.tenantDetails.fullName.toLowerCase().includes(q) ||
      o.propertyDetails.city.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Daily Summary Calculations
  const submittedCount = orders.filter((o) => o.status === 'Submitted').length;
  const pendingVerificationCount = orders.filter(
    (o) => o.status === 'Under verification' || o.status === 'Documents needed'
  ).length;
  const draftingCount = orders.filter((o) => o.status === 'Drafting').length;
  const dispatchedCount = orders.filter((o) => o.status === 'Dispatched').length;

  if (authLoading || (user && checkingRole)) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-stone-500">Checking vendor authorization...</p>
      </div>
    );
  }

  // Unauthorized Screen
  if (!user || !isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
              Admin Role Required
            </span>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight pt-2">
              Vendor Management Desk
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              This area is restricted to the certified stamp vendor desk (<code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[11px] text-stone-800 font-semibold">{ADMIN_EMAIL}</code>). Access requires signing in with the designated administrator account.
            </p>
          </div>

          {!user ? (
            <button
              onClick={() => signInWithGoogle()}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign In with Authorized Google Account
            </button>
          ) : (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 text-left space-y-2">
              <p>
                Currently signed in as: <strong>{user.email}</strong>
              </p>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Your account ({user.email}) is not authorized to access the fulfillment desk. Please sign in with the authorized vendor email (<code className="font-mono bg-stone-200/70 px-1 py-0.5 rounded text-[11px] text-stone-800">{ADMIN_EMAIL}</code>).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Vendor Fulfillment Desk
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Licence #{VENDOR_CONFIG.licenceNumber} • Admin: {user.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fulfillment Queue ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
            <span>Pricing & Rates Settings</span>
          </button>

          {activeTab === 'orders' && (
            <button
              type="button"
              onClick={fetchOrderList}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
              title="Refresh order queue"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {activeTab === 'pricing' ? (
        /* PRICING & RATES SETTINGS VIEW */
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Rate Master
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                Official Stamping, Courier & Notary Rates
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure rates for the 3 customer dropboxes. Updates apply immediately across customer checkout.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPricing}
                className="px-3.5 py-2 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                disabled={savingPricing}
                onClick={handleSavePricing}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {savingPricing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save All Rates</span>
              </button>
            </div>
          </div>

          {pricingSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pricing rates successfully saved and updated in Firestore!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Rs. 100 Stamp Paper Package */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">1. In Rs.100 Stamp Paper Package</h3>
                  <p className="text-xs text-stone-500">Standard 11-month tenancy stamp paper with courier charges</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">₹100</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Within Chennai (₹) — Courier Included
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="100"
                      value={pricingConfig.stamp100Chennai}
                      onChange={(e) =>
                        setPricingConfig({ ...pricingConfig, stamp100Chennai: Number(e.target.value) })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500">Default: Rs. 350/-</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Within Tamilnadu (Other Districts) (₹) — Courier Included
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="100"
                      value={pricingConfig.stamp100TamilNadu}
                      onChange={(e) =>
                        setPricingConfig({ ...pricingConfig, stamp100TamilNadu: Number(e.target.value) })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500">Default: Rs. 400/-</span>
                </div>
              </div>
            </div>

            {/* Box 2: Rs. 200 Stamp Paper Package */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">2. In Rs.200 Stamp Paper Package</h3>
                  <p className="text-xs text-stone-500">Higher denomination stamp paper with courier charges</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">₹200</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Within Chennai (₹) — Courier Included
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="200"
                      value={pricingConfig.stamp200Chennai}
                      onChange={(e) =>
                        setPricingConfig({ ...pricingConfig, stamp200Chennai: Number(e.target.value) })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500">Default: Rs. 450/-</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Within Tamilnadu (Other Districts) (₹) — Courier Included
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="200"
                      value={pricingConfig.stamp200TamilNadu}
                      onChange={(e) =>
                        setPricingConfig({ ...pricingConfig, stamp200TamilNadu: Number(e.target.value) })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500">Default: Rs. 500/-</span>
                </div>
              </div>
            </div>

            {/* Box 3: Notary Public Attestation Add-on */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">3. With Notary Signature (Extra Charge)</h3>
                  <p className="text-xs text-stone-500">Advocate Notary Public attestation and official seal endorsement fee</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">Notary Add-on</span>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Notary Attestation Additional Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={pricingConfig.notaryExtraFee}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, notaryExtraFee: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <span className="text-[10px] text-stone-500">Default: Rs. 200/- extra</span>
              </div>
            </div>
          </div>

          {/* Pricing Matrix Preview */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-amber-900">
              Customer Package Matrix (Live Rate Calculator)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
                <span className="text-stone-500 block">₹100 Paper • Chennai</span>
                <p className="text-base font-black text-stone-900">₹{pricingConfig.stamp100Chennai}/-</p>
                <span className="text-[11px] text-amber-800 block">With Notary: ₹{pricingConfig.stamp100Chennai + pricingConfig.notaryExtraFee}/-</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
                <span className="text-stone-500 block">₹100 Paper • Tamil Nadu</span>
                <p className="text-base font-black text-stone-900">₹{pricingConfig.stamp100TamilNadu}/-</p>
                <span className="text-[11px] text-amber-800 block">With Notary: ₹{pricingConfig.stamp100TamilNadu + pricingConfig.notaryExtraFee}/-</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
                <span className="text-stone-500 block">₹200 Paper • Chennai</span>
                <p className="text-base font-black text-stone-900">₹{pricingConfig.stamp200Chennai}/-</p>
                <span className="text-[11px] text-amber-800 block">With Notary: ₹{pricingConfig.stamp200Chennai + pricingConfig.notaryExtraFee}/-</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
                <span className="text-stone-500 block">₹200 Paper • Tamil Nadu</span>
                <p className="text-base font-black text-stone-900">₹{pricingConfig.stamp200TamilNadu}/-</p>
                <span className="text-[11px] text-amber-800 block">With Notary: ₹{pricingConfig.stamp200TamilNadu + pricingConfig.notaryExtraFee}/-</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ORDERS FULFILLMENT QUEUE VIEW */
        <>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">New Submitted</span>
          <p className="text-2xl font-black text-amber-600">{submittedCount}</p>
          <span className="text-[11px] text-stone-500">Awaiting initial review</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Under Verification</span>
          <p className="text-2xl font-black text-sky-600">{pendingVerificationCount}</p>
          <span className="text-[11px] text-stone-500">Checking ID / EB proofs</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Drafting on Stamp</span>
          <p className="text-2xl font-black text-purple-600">{draftingCount}</p>
          <span className="text-[11px] text-stone-500">Printing on stamp paper</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Dispatched Courier</span>
          <p className="text-2xl font-black text-emerald-600">{dispatchedCount}</p>
          <span className="text-[11px] text-stone-500">In postal transit</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Landlord name, Tenant name, phone, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under verification">Under Verification</option>
          <option value="Documents needed">Documents Needed</option>
          <option value="Drafting">Drafting on Stamp</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order List Table */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
        {loadingOrders ? (
          <div className="py-16 text-center text-xs text-stone-500 space-y-2">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading application queue...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-500">
            No orders match the selected search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Landlord & Tenant</th>
                  <th className="py-3 px-4">Premises City</th>
                  <th className="py-3 px-4">Monthly Rent</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="font-mono text-stone-900">{ord.orderId}</strong>
                      <span className="block text-[11px] text-stone-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900">{ord.ownerDetails.fullName}</span>
                      <span className="block text-stone-500">T: {ord.tenantDetails.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{ord.propertyDetails.city}</span>
                      <span className="block text-stone-400 text-[10px]">{ord.propertyDetails.propertyType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                      ₹{ord.agreementTerms.monthlyRent?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.payment?.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.payment?.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          {showAgreementPrint ? (
            <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-xl max-h-[95vh] overflow-y-auto space-y-4">
              <RentalAgreementDocument
                data={{
                  ownerDetails: selectedOrder.ownerDetails,
                  tenantDetails: selectedOrder.tenantDetails,
                  propertyDetails: selectedOrder.propertyDetails,
                  agreementTerms: selectedOrder.agreementTerms,
                  orderId: selectedOrder.orderId,
                  createdAt: selectedOrder.createdAt,
                }}
                onBack={() => setShowAgreementPrint(false)}
                title={`Rental Agreement for Stamping (Order #${selectedOrder.orderId})`}
              />
              <div className="flex justify-center pt-4 border-t border-stone-200 no-print">
                <button
                  type="button"
                  onClick={() => setShowAgreementPrint(false)}
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Return to Order Management Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Order Management
                  </span>
                  <h2 className="text-xl font-black font-mono text-stone-900">{selectedOrder.orderId}</h2>
                  <p className="text-xs text-stone-500">
                    Customer Email: {selectedOrder.customerEmail} • Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAgreementPrint(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Open agreement formatted for non-judicial stamp paper"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Agreement</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setShowCorrectionForm(false);
                      setShowCourierForm(false);
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {/* Application Data Tabs/Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Landlord */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                <strong className="block font-bold text-stone-900">Landlord (Owner)</strong>
                <p>Name: {selectedOrder.ownerDetails.fullName}</p>
                <p>Father/Spouse: {selectedOrder.ownerDetails.relativeName}</p>
                <p>Age: {selectedOrder.ownerDetails.age} yrs • Phone: {selectedOrder.ownerDetails.phone}</p>
                <p className="font-mono text-emerald-800">Aadhaar Last 4: XXXX-XXXX-{selectedOrder.ownerDetails.aadhaarLast4}</p>
                {selectedOrder.ownerDetails.pan && <p className="font-mono">PAN: {selectedOrder.ownerDetails.pan}</p>}
                <p className="text-stone-500">Address: {selectedOrder.ownerDetails.address}</p>
              </div>

              {/* Tenant */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                <strong className="block font-bold text-stone-900">Tenant</strong>
                <p>Name: {selectedOrder.tenantDetails.fullName}</p>
                <p>Father/Spouse: {selectedOrder.tenantDetails.relativeName}</p>
                <p>Age: {selectedOrder.tenantDetails.age} yrs • Phone: {selectedOrder.tenantDetails.phone}</p>
                <p className="font-mono text-emerald-800">Aadhaar Last 4: XXXX-XXXX-{selectedOrder.tenantDetails.aadhaarLast4}</p>
                {selectedOrder.tenantDetails.pan && <p className="font-mono">PAN: {selectedOrder.tenantDetails.pan}</p>}
                <p className="text-stone-500">Address: {selectedOrder.tenantDetails.address}</p>
              </div>

              {/* Property */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1 sm:col-span-2">
                <strong className="block font-bold text-stone-900">Rental Premises</strong>
                <p>Address: {selectedOrder.propertyDetails.fullAddress}</p>
                <p>City: {selectedOrder.propertyDetails.city} - {selectedOrder.propertyDetails.pincode} • Type: {selectedOrder.propertyDetails.propertyType} ({selectedOrder.propertyDetails.furnishing})</p>
              </div>

              {/* Terms */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 sm:col-span-2">
                <div className="flex justify-between items-center border-b border-stone-200/80 pb-1.5">
                  <strong className="block font-bold text-stone-900">Agreement Terms & Selected Stamping Package</strong>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Order Total: ₹{selectedOrder.payment?.amount?.toLocaleString('en-IN') || (selectedOrder.agreementTerms.stampPaperDenomination === 200 ? (selectedOrder.agreementTerms.deliveryLocation === 'Within Tamil Nadu' ? 500 : 450) : (selectedOrder.agreementTerms.deliveryLocation === 'Within Tamil Nadu' ? 400 : 350)) + (selectedOrder.agreementTerms.includeNotary ? 200 : 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>Rent: <strong>₹{selectedOrder.agreementTerms.monthlyRent?.toLocaleString('en-IN')}</strong></div>
                  <div>Advance: <strong>₹{selectedOrder.agreementTerms.securityDeposit?.toLocaleString('en-IN')}</strong></div>
                  <div>Tenure: <strong>{selectedOrder.agreementTerms.tenureMonths} Months</strong></div>
                  <div>Notice: <strong>{selectedOrder.agreementTerms.noticePeriodDays} Days</strong></div>
                  <div>Stamp Paper: <strong>In Rs.{selectedOrder.agreementTerms.stampPaperDenomination || 100} Stamp Paper</strong></div>
                  <div>Courier Delivery: <strong>{selectedOrder.agreementTerms.deliveryLocation || 'Within Chennai'}</strong></div>
                  <div className="sm:col-span-2">
                    Notary Attestation:{' '}
                    <strong className={selectedOrder.agreementTerms.includeNotary ? 'text-amber-700' : 'text-stone-700'}>
                      {selectedOrder.agreementTerms.includeNotary ? 'With Notary Signature & Seal' : 'Without Notary'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents Review */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <h3 className="font-bold text-stone-900 text-xs">Customer Uploaded Proofs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-stone-800">Owner ID</span>
                    <span className="text-[11px] text-stone-500 truncate block max-w-[120px]">
                      {selectedOrder.proofUploads?.ownerIdProofFileName || 'File'}
                    </span>
                  </div>
                  {selectedOrder.proofUploads?.ownerIdProofUrl ? (
                    <a
                      href={selectedOrder.proofUploads.ownerIdProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-700 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-stone-800">Tenant ID</span>
                    <span className="text-[11px] text-stone-500 truncate block max-w-[120px]">
                      {selectedOrder.proofUploads?.tenantIdProofFileName || 'File'}
                    </span>
                  </div>
                  {selectedOrder.proofUploads?.tenantIdProofUrl ? (
                    <a
                      href={selectedOrder.proofUploads.tenantIdProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-700 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-stone-800">Property Proof</span>
                    <span className="text-[11px] text-stone-500 truncate block max-w-[120px]">
                      {selectedOrder.proofUploads?.propertyProofFileName || 'File'}
                    </span>
                  </div>
                  {selectedOrder.proofUploads?.propertyProofUrl ? (
                    <a
                      href={selectedOrder.proofUploads.propertyProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-700 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Status Change & Workflow Action Box */}
            <div className="border-t border-stone-200 pt-4 space-y-4">
              <h3 className="font-bold text-stone-900 text-xs">Fulfillment Workflow Actions</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Transition Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  >
                    <option value="Under verification">Under verification</option>
                    <option value="Drafting">Drafting on Stamp Paper</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Administrative Note (Logged into audit trail)
                  </label>
                  <input
                    type="text"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    placeholder="e.g. EB bill verified, printing on stamp paper"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleUpdateStatus}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  {updatingStatus ? 'Updating...' : 'Apply Status Change'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCorrectionForm(!showCorrectionForm);
                    setShowCourierForm(false);
                  }}
                  className="border border-rose-300 hover:bg-rose-50 text-rose-800 font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Request Correction from Customer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCourierForm(!showCourierForm);
                    setShowCorrectionForm(false);
                  }}
                  className="border border-sky-300 hover:bg-sky-50 text-sky-800 font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Dispatch & Assign Courier Tracking
                </button>
              </div>

              {/* Correction Form */}
              {showCorrectionForm && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-rose-900 text-xs">Customer Correction Message</h4>
                  <textarea
                    rows={2}
                    value={correctionMsg}
                    onChange={(e) => setCorrectionMsg(e.target.value)}
                    placeholder="Specify what needs correction (e.g. Please re-upload clearer copy of the electricity bill or correct landlord name)..."
                    className="w-full p-2.5 rounded-xl border border-rose-300 bg-white text-xs text-stone-900"
                  />
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={handleSendCorrectionRequest}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Send Correction Request
                  </button>
                </div>
              )}

              {/* Courier Form */}
              {showCourierForm && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-sky-900 text-xs">Consignment Courier Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-sky-900 mb-1">Courier Partner</label>
                      <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-sky-300 bg-white text-xs text-stone-900"
                      >
                        <option value="India Post Speed Post">India Post Speed Post</option>
                        <option value="Blue Dart Express">Blue Dart Express</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sky-900 mb-1">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. EM123456789IN"
                        className="w-full p-2 rounded-xl border border-sky-300 bg-white text-xs text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={handleDispatchCourier}
                    className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
