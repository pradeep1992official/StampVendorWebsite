'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  Clock, 
  Sparkles,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ProgressIndicator } from './ProgressIndicator';
import { OwnerStep } from './OwnerStep';
import { TenantStep } from './TenantStep';
import { PropertyStep } from './PropertyStep';
import { PersonDetails, PropertyDetails, Order } from '@/lib/types';
import { saveDraft, getDraft, deleteDraft } from '@/lib/order-service';

export function OrderIntakeWizard() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);

  // Form State
  const [ownerData, setOwnerData] = useState<Partial<PersonDetails>>({
    fullName: '',
    relativeName: '',
    age: '',
    phone: '',
    email: '',
    aadhaarLast4: '',
    pan: '',
    address: '',
  });

  const [tenantData, setTenantData] = useState<Partial<PersonDetails>>({
    fullName: '',
    relativeName: '',
    age: '',
    phone: '',
    email: '',
    aadhaarLast4: '',
    pan: '',
    address: '',
  });

  const [propertyData, setPropertyData] = useState<Partial<PropertyDetails>>({
    fullAddress: '',
    city: '',
    pincode: '',
    propertyType: 'Flat',
    furnishing: 'Semi-Furnished',
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autosave Status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [draftRestoredBanner, setDraftRestoredBanner] = useState<boolean>(false);
  const [hasCompletedStep3, setHasCompletedStep3] = useState<boolean>(false);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Prefill email from authenticated Google user
  useEffect(() => {
    if (user?.email && !ownerData.email) {
      setOwnerData((prev) => ({ ...prev, email: user.email || '' }));
    }
  }, [user, ownerData.email]);

  // Load existing draft from /drafts/{uid} on auth ready
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    async function loadUserDraft() {
      if (!user) return;
      try {
        const draft = await getDraft(user.uid);
        if (draft && draft.formData && isMounted) {
          const fd = draft.formData;
          if (fd.ownerDetails) setOwnerData(fd.ownerDetails);
          if (fd.tenantDetails) setTenantData(fd.tenantDetails);
          if (fd.propertyDetails) setPropertyData(fd.propertyDetails);
          if (draft.currentStep && draft.currentStep <= 3) {
            setCurrentStep(draft.currentStep);
            setMaxAccessibleStep(draft.currentStep);
          }
          if (draft.updatedAt) {
            setLastSavedTime(new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDraftRestoredBanner(true);
          }
        }
      } catch (err) {
        console.error('Failed to load draft:', err);
      }
    }

    loadUserDraft();
    return () => { isMounted = false; };
  }, [user]);

  // Trigger autosave to /drafts/{uid}
  const triggerAutosave = useCallback(async (stepToSave: number) => {
    if (!user) return;
    setSaveStatus('saving');
    try {
      const draftPayload: Partial<Order> = {
        ownerDetails: ownerData as PersonDetails,
        tenantDetails: tenantData as PersonDetails,
        propertyDetails: propertyData as PropertyDetails,
      };
      await saveDraft(user.uid, stepToSave, draftPayload);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setSaveStatus('error');
    }
  }, [user, ownerData, tenantData, propertyData]);

  // Debounced autosave when form changes
  const scheduleAutosave = useCallback(() => {
    if (!user) return;
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      triggerAutosave(currentStep);
    }, 1000);
  }, [user, currentStep, triggerAutosave]);

  // Step 1 Validation (Owner)
  const validateOwner = (): boolean => {
    const errs: Record<string, string> = {};
    if (!ownerData.fullName?.trim()) errs.fullName = 'Owner full name is required';
    if (!ownerData.relativeName?.trim()) errs.relativeName = "Father's or spouse's name is required";
    if (!ownerData.age || Number(ownerData.age) < 18 || Number(ownerData.age) > 120) {
      errs.age = 'Owner must be at least 18 years of age';
    }
    if (!ownerData.phone || !/^[6-9]\d{9}$/.test(ownerData.phone)) {
      errs.phone = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
    }
    if (!ownerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email)) {
      errs.email = 'Valid email address required';
    }
    if (!ownerData.aadhaarLast4 || !/^\d{4}$/.test(ownerData.aadhaarLast4)) {
      errs.aadhaarLast4 = 'Strictly 4 numeric digits required';
    }
    if (ownerData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(ownerData.pan)) {
      errs.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    }
    if (!ownerData.address?.trim() || ownerData.address.trim().length < 10) {
      errs.address = 'Complete permanent address required (at least 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation (Tenant)
  const validateTenant = (): boolean => {
    const errs: Record<string, string> = {};
    if (!tenantData.fullName?.trim()) errs.fullName = 'Tenant full name is required';
    if (!tenantData.relativeName?.trim()) errs.relativeName = "Father's or spouse's name is required";
    if (!tenantData.age || Number(tenantData.age) < 18 || Number(tenantData.age) > 120) {
      errs.age = 'Tenant must be at least 18 years of age';
    }
    if (!tenantData.phone || !/^[6-9]\d{9}$/.test(tenantData.phone)) {
      errs.phone = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
    }
    if (!tenantData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.email)) {
      errs.email = 'Valid email address required';
    }
    if (!tenantData.aadhaarLast4 || !/^\d{4}$/.test(tenantData.aadhaarLast4)) {
      errs.aadhaarLast4 = 'Strictly 4 numeric digits required';
    }
    if (tenantData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(tenantData.pan)) {
      errs.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    }
    if (!tenantData.address?.trim() || tenantData.address.trim().length < 10) {
      errs.address = 'Complete permanent address required (at least 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation (Property)
  const validateProperty = (): boolean => {
    const errs: Record<string, string> = {};
    if (!propertyData.propertyType) errs.propertyType = 'Select property type';
    if (!propertyData.furnishing) errs.furnishing = 'Select furnishing status';
    if (!propertyData.fullAddress?.trim() || propertyData.fullAddress.trim().length < 12) {
      errs.fullAddress = 'Complete property address required (at least 12 characters)';
    }
    if (!propertyData.city?.trim()) errs.city = 'City or Taluk in Tamil Nadu is required';
    if (!propertyData.pincode || !/^\d{6}$/.test(propertyData.pincode)) {
      errs.pincode = 'Valid 6-digit Indian pincode required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateOwner()) return;
      setCurrentStep(2);
      setMaxAccessibleStep((prev) => Math.max(prev, 2));
      triggerAutosave(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateTenant()) return;
      setCurrentStep(3);
      setMaxAccessibleStep((prev) => Math.max(prev, 3));
      triggerAutosave(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      if (!validateProperty()) return;
      triggerAutosave(3);
      setHasCompletedStep3(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (hasCompletedStep3) {
      setHasCompletedStep3(false);
      return;
    }
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setErrors({});
      triggerAutosave(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearDraft = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to discard your saved draft and start fresh?')) {
      await deleteDraft(user.uid);
      setOwnerData({
        fullName: '',
        relativeName: '',
        age: '',
        phone: '',
        email: user.email || '',
        aadhaarLast4: '',
        pan: '',
        address: '',
      });
      setTenantData({
        fullName: '',
        relativeName: '',
        age: '',
        phone: '',
        email: '',
        aadhaarLast4: '',
        pan: '',
        address: '',
      });
      setPropertyData({
        fullAddress: '',
        city: '',
        pincode: '',
        propertyType: 'Flat',
        furnishing: 'Semi-Furnished',
      });
      setCurrentStep(1);
      setMaxAccessibleStep(1);
      setDraftRestoredBanner(false);
      setLastSavedTime(null);
      setHasCompletedStep3(false);
    }
  };

  // If auth is still loading
  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-stone-500 font-medium">Checking authentication status...</p>
      </div>
    );
  }

  // Google Sign-In Gate
  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <LogIn className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Authentication Required
            </span>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Sign In to Start Your Agreement
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Sign in with your Google account. This enables <strong>automatic draft autosave</strong> to your secure account in Firestore (<code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[11px]">/drafts/{'{uid}'}</code>) so you never lose your progress.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-stone-500">
            <span>By signing in, you agree to our </span>
            <Link href="/terms" className="text-amber-800 underline">Terms</Link>
            <span> and </span>
            <Link href="/privacy-policy" className="text-amber-800 underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Bar: Title & Autosave Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Order Intake
          </span>
          <h1 className="text-2xl font-black text-stone-900 mt-1">
            Rental Agreement Application
          </h1>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600">
            {saveStatus === 'saving' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                <span className="font-medium text-[11px]">Saving draft...</span>
              </>
            ) : saveStatus === 'saved' || lastSavedTime ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-[11px]">Draft autosaved {lastSavedTime && `at ${lastSavedTime}`}</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium text-[11px]">Autosave active</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleClearDraft}
            title="Discard draft and start fresh"
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Draft Restored Banner */}
      {draftRestoredBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Resumed your saved draft from Firestore (<code className="font-mono text-[11px]">/drafts/{user.uid}</code>).</span>
          </div>
          <button
            onClick={() => setDraftRestoredBanner(false)}
            className="text-amber-800 font-bold hover:underline shrink-0 text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={hasCompletedStep3 ? 4 : currentStep}
        onStepClick={(s) => {
          if (s <= 3) {
            setHasCompletedStep3(false);
            setCurrentStep(s);
          }
        }}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* Main Form Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Step 1: Owner */}
        {currentStep === 1 && !hasCompletedStep3 && (
          <OwnerStep
            data={ownerData}
            onChange={(fields) => {
              setOwnerData((prev) => ({ ...prev, ...fields }));
              setErrors({});
              scheduleAutosave();
            }}
            errors={errors}
          />
        )}

        {/* Step 2: Tenant */}
        {currentStep === 2 && !hasCompletedStep3 && (
          <TenantStep
            data={tenantData}
            onChange={(fields) => {
              setTenantData((prev) => ({ ...prev, ...fields }));
              setErrors({});
              scheduleAutosave();
            }}
            errors={errors}
          />
        )}

        {/* Step 3: Property */}
        {currentStep === 3 && !hasCompletedStep3 && (
          <PropertyStep
            data={propertyData}
            onChange={(fields) => {
              setPropertyData((prev) => ({ ...prev, ...fields }));
              setErrors({});
              scheduleAutosave();
            }}
            errors={errors}
          />
        )}

        {/* Completed Steps 1-3 Summary Review Screen (Waiting for User Confirmation) */}
        {hasCompletedStep3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Steps 1 to 3 Complete</h2>
                  <p className="text-xs text-stone-500">Your details have been validated and saved to <code className="font-mono text-emerald-800">/drafts/{user.uid}</code>.</p>
                </div>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Owner Summary */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">1. Property Owner (Landlord)</h3>
                  <button
                    onClick={() => {
                      setHasCompletedStep3(false);
                      setCurrentStep(1);
                    }}
                    className="text-amber-800 font-bold hover:underline text-xs cursor-pointer"
                  >
                    Edit Step 1
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div><strong>Name:</strong> {ownerData.fullName}</div>
                  <div><strong>Father/Spouse:</strong> {ownerData.relativeName}</div>
                  <div><strong>Age:</strong> {ownerData.age} yrs</div>
                  <div><strong>Phone:</strong> {ownerData.phone}</div>
                  <div><strong>Email:</strong> {ownerData.email}</div>
                  <div><strong>Aadhaar:</strong> XXXX-XXXX-{ownerData.aadhaarLast4}</div>
                  {ownerData.pan && <div><strong>PAN:</strong> {ownerData.pan}</div>}
                  <div className="col-span-2"><strong>Permanent Address:</strong> {ownerData.address}</div>
                </div>
              </div>

              {/* Tenant Summary */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">2. Tenant (Occupant)</h3>
                  <button
                    onClick={() => {
                      setHasCompletedStep3(false);
                      setCurrentStep(2);
                    }}
                    className="text-amber-800 font-bold hover:underline text-xs cursor-pointer"
                  >
                    Edit Step 2
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div><strong>Name:</strong> {tenantData.fullName}</div>
                  <div><strong>Father/Spouse:</strong> {tenantData.relativeName}</div>
                  <div><strong>Age:</strong> {tenantData.age} yrs</div>
                  <div><strong>Phone:</strong> {tenantData.phone}</div>
                  <div><strong>Email:</strong> {tenantData.email}</div>
                  <div><strong>Aadhaar:</strong> XXXX-XXXX-{tenantData.aadhaarLast4}</div>
                  {tenantData.pan && <div><strong>PAN:</strong> {tenantData.pan}</div>}
                  <div className="col-span-2"><strong>Permanent Address:</strong> {tenantData.address}</div>
                </div>
              </div>

              {/* Property Summary */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">3. Rental Property</h3>
                  <button
                    onClick={() => {
                      setHasCompletedStep3(false);
                      setCurrentStep(3);
                    }}
                    className="text-amber-800 font-bold hover:underline text-xs cursor-pointer"
                  >
                    Edit Step 3
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div><strong>Type:</strong> {propertyData.propertyType}</div>
                  <div><strong>Furnishing:</strong> {propertyData.furnishing}</div>
                  <div><strong>City:</strong> {propertyData.city}</div>
                  <div><strong>Pincode:</strong> {propertyData.pincode}</div>
                  <div className="col-span-2"><strong>Premises Address:</strong> {propertyData.fullAddress}</div>
                </div>
              </div>
            </div>

            {/* Waiting for Next Step Notice */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Ready for Review</span>
              </div>
              <p className="leading-relaxed">
                Steps 1 to 3 have been completed with Google Authentication, client-side input validation, and live Firestore autosave to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">/drafts/{user.uid}</code>.
              </p>
              <p className="leading-relaxed">
                Per the workflow guidelines, I am stopping here for your review and confirmation before building the subsequent steps (Step 4: Agreement Terms, Step 5: Document Uploads, Step 6: Review & Razorpay payment).
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            {(currentStep > 1 || hasCompletedStep3) && (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div>
            {!hasCompletedStep3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:translate-y-0.5"
              >
                <span>
                  {currentStep === 1 && 'Next: Tenant Details'}
                  {currentStep === 2 && 'Next: Property Details'}
                  {currentStep === 3 && 'Complete Steps 1-3 & Review'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
