'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Lock,
  RefreshCw,
  PhoneCall,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { PersonDetails, PropertyDetails, AgreementTerms, ProofUploads } from '@/lib/types';
import { VENDOR_CONFIG } from '@/src/config/vendor';
import { RentalAgreementDocument } from '@/components/agreement/RentalAgreementDocument';

interface ReviewStepProps {
  ownerData: Partial<PersonDetails>;
  tenantData: Partial<PersonDetails>;
  propertyData: Partial<PropertyDetails>;
  termsData: Partial<AgreementTerms>;
  proofData?: Partial<ProofUploads>;
  onEditStep: (stepNumber: number) => void;
  onSubmitOrder: () => Promise<void>;
  submitting: boolean;
  submissionError: string | null;
}

interface FeeState {
  loading: boolean;
  feesConfigured: boolean;
  stampDuty: number | null;
  serviceFee: number | null;
  courierFee: number | null;
  stampPaperDenomination?: 100 | 200;
  deliveryLocation?: 'Within Chennai' | 'Within Tamil Nadu';
  includeNotary?: boolean;
  basePackagePrice?: number;
  notaryFee?: number;
  totalPayable: number | null;
  statusMessage: string;
  paymentAllowed: boolean;
  description?: string;
  error?: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  ownerData,
  tenantData,
  propertyData,
  termsData,
  proofData,
  onEditStep,
  onSubmitOrder,
  submitting,
  submissionError,
}) => {
  const [showAgreementPreview, setShowAgreementPreview] = useState<boolean>(false);
  const [feeState, setFeeState] = useState<FeeState>({
    loading: true,
    feesConfigured: false,
    stampDuty: null,
    serviceFee: null,
    courierFee: null,
    basePackagePrice: 350,
    notaryFee: 0,
    totalPayable: null,
    statusMessage: '',
    paymentAllowed: false,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchFeeBreakdown() {
      try {
        const res = await fetch('/api/orders/calculate-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyRent: termsData.monthlyRent || 0,
            securityDeposit: termsData.securityDeposit || 0,
            tenureMonths: termsData.tenureMonths || 11,
            stampPaperDenomination: termsData.stampPaperDenomination || 100,
            deliveryLocation: termsData.deliveryLocation || 'Within Chennai',
            includeNotary: Boolean(termsData.includeNotary),
          }),
        });

        if (!res.ok) throw new Error('Could not calculate fee');
        const data = await res.json();
        if (isMounted) {
          setFeeState({
            loading: false,
            feesConfigured: data.feesConfigured,
            stampDuty: data.stampDuty,
            serviceFee: data.serviceFee,
            courierFee: data.courierFee,
            stampPaperDenomination: data.stampPaperDenomination,
            deliveryLocation: data.deliveryLocation,
            includeNotary: data.includeNotary,
            basePackagePrice: data.basePackagePrice,
            notaryFee: data.notaryFee,
            totalPayable: data.totalPayable,
            statusMessage: data.statusMessage,
            paymentAllowed: data.paymentAllowed,
            description: data.description,
          });
        }
      } catch (err) {
        if (isMounted) {
          setFeeState((prev) => ({
            ...prev,
            loading: false,
            error: 'Failed to retrieve server fee schedule.',
          }));
        }
      }
    }

    fetchFeeBreakdown();
    return () => {
      isMounted = false;
    };
  }, [
    termsData.monthlyRent, 
    termsData.securityDeposit, 
    termsData.tenureMonths,
    termsData.stampPaperDenomination,
    termsData.deliveryLocation,
    termsData.includeNotary
  ]);

  if (showAgreementPreview) {
    return (
      <div className="animate-in fade-in duration-200">
        <RentalAgreementDocument
          data={{
            ownerDetails: ownerData,
            tenantDetails: tenantData,
            propertyDetails: propertyData,
            agreementTerms: termsData,
          }}
          onBack={() => setShowAgreementPreview(false)}
          title="Rental Agreement Draft (Official 3-Page Format)"
        />
        <div className="mt-6 flex justify-center no-print">
          <button
            type="button"
            onClick={() => setShowAgreementPreview(false)}
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Order Review & Submission</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="border-b border-stone-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Step 5: Review & Application Submission</h2>
              <p className="text-xs text-stone-500">
                Carefully review all submitted tenancy details before placing your order.
              </p>
            </div>
          </div>

          {/* Direct Agreement Preview Button */}
          <button
            type="button"
            onClick={() => setShowAgreementPreview(true)}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>Preview Agreement Document</span>
          </button>
        </div>
      </div>

      {/* Featured Preview Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 via-stone-50 to-emerald-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-xs border border-amber-200 text-amber-800 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Official Non-Judicial Stamping Format</h4>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Your inputs will be drafted into the exact 3-page Tamil Nadu stamping template (with stamp margin, rent in words, tenure, and witness clauses).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAgreementPreview(true)}
          className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-amber-700" />
          <span>View Draft Preview</span>
        </button>
      </div>

      {submissionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold">Submission Failed:</strong>
            <span>{submissionError}</span>
          </div>
        </div>
      )}

      {/* Accordion / Summary Cards */}
      <div className="space-y-4">
        {/* 1. Owner Details */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-stone-900 text-sm">1. Property Owner (Landlord)</h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Step 1</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            <div><span className="text-stone-400">Full Name:</span> <strong className="text-stone-900">{ownerData.fullName}</strong></div>
            <div><span className="text-stone-400">Father/Spouse:</span> {ownerData.relativeName}</div>
            <div><span className="text-stone-400">Age:</span> {ownerData.age} Years</div>
            <div><span className="text-stone-400">Phone:</span> {ownerData.phone}</div>
            {ownerData.email && <div><span className="text-stone-400">Email:</span> {ownerData.email}</div>}
            {ownerData.aadhaarLast4 && (
              <div><span className="text-stone-400">Aadhaar:</span> <strong className="font-mono text-stone-900">{ownerData.aadhaarLast4}</strong></div>
            )}
            {ownerData.pan && <div><span className="text-stone-400">PAN:</span> <span className="font-mono">{ownerData.pan}</span></div>}
            <div className="sm:col-span-2"><span className="text-stone-400">Permanent Address:</span> {ownerData.address}</div>
          </div>
        </div>

        {/* 2. Tenant Details */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-stone-900 text-sm">2. Tenant (Occupant)</h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Step 2</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            <div><span className="text-stone-400">Full Name:</span> <strong className="text-stone-900">{tenantData.fullName}</strong></div>
            <div><span className="text-stone-400">Father/Spouse:</span> {tenantData.relativeName}</div>
            <div><span className="text-stone-400">Age:</span> {tenantData.age} Years</div>
            <div><span className="text-stone-400">Phone:</span> {tenantData.phone}</div>
            {tenantData.email && <div><span className="text-stone-400">Email:</span> {tenantData.email}</div>}
            {tenantData.aadhaarLast4 && (
              <div><span className="text-stone-400">Aadhaar:</span> <strong className="font-mono text-stone-900">{tenantData.aadhaarLast4}</strong></div>
            )}
            {tenantData.pan && <div><span className="text-stone-400">PAN:</span> <span className="font-mono">{tenantData.pan}</span></div>}
            <div className="sm:col-span-2"><span className="text-stone-400">Permanent Address:</span> {tenantData.address}</div>
          </div>
        </div>

        {/* 3. Property Details */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-stone-900 text-sm">3. Rental Premises</h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Step 3</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            <div><span className="text-stone-400">Type:</span> {propertyData.propertyType}</div>
            <div><span className="text-stone-400">Furnishing:</span> {propertyData.furnishing}</div>
            {propertyData.businessName && (
              <div className="sm:col-span-2">
                <span className="text-stone-400">Business / Commercial Name:</span>{' '}
                <strong className="text-stone-900">{propertyData.businessName}</strong>
              </div>
            )}
            <div><span className="text-stone-400">City / Taluk:</span> {propertyData.city}</div>
            <div><span className="text-stone-400">Pincode:</span> {propertyData.pincode}</div>
            <div className="sm:col-span-2"><span className="text-stone-400">Premises Address:</span> {propertyData.fullAddress}</div>
          </div>
        </div>

        {/* 4. Agreement Terms */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-bold text-stone-900 text-sm">4. Tenancy Agreement Terms</h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Step 4</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            <div><span className="text-stone-400">Monthly Rent:</span> <strong className="text-stone-900">₹{termsData.monthlyRent?.toLocaleString('en-IN')}</strong></div>
            <div><span className="text-stone-400">Security Advance:</span> <strong className="text-stone-900">₹{termsData.securityDeposit?.toLocaleString('en-IN')}</strong></div>
            <div><span className="text-stone-400">Maintenance Charges:</span> ₹{(termsData.maintenanceCharges || 0).toLocaleString('en-IN')} / mo</div>
            <div><span className="text-stone-400">Commencement Date:</span> {termsData.startDate}</div>
            <div><span className="text-stone-400">Tenure:</span> {termsData.tenureMonths} Months</div>
            <div><span className="text-stone-400">Notice Period:</span> {termsData.noticePeriodDays} Days</div>
            <div><span className="text-stone-400">Rent Increase %:</span> {termsData.rentIncreasePct}% per annum</div>
            <div><span className="text-stone-400">Stamp Paper:</span> <strong>In Rs.{termsData.stampPaperDenomination || 100} Stamp Paper</strong></div>
            <div><span className="text-stone-400">Courier Region:</span> <strong>{termsData.deliveryLocation || 'Within Chennai'}</strong></div>
            <div className="sm:col-span-2">
              <span className="text-stone-400">Notary Public Attestation:</span>{' '}
              <strong className={termsData.includeNotary ? 'text-amber-700' : 'text-stone-700'}>
                {termsData.includeNotary ? 'With Notary Signature & Seal (+₹200)' : 'Without Notary Signature'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Fee Breakdown & Gateway Notice */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Itemized Fee Summary</h3>
            <p className="text-xs text-stone-400">
              Government stamp duty, drafting fee, and courier dispatch charges are calculated separately.
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>

        {feeState.loading ? (
          <div className="flex items-center justify-center py-6 text-xs text-stone-400 gap-2">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Calculating server fee breakdown...</span>
          </div>
        ) : feeState.feesConfigured && feeState.totalPayable !== null ? (
          <div className="space-y-3 border-t border-stone-800 pt-3 text-xs">
            <div className="flex justify-between text-stone-300">
              <span>
                Stamping & Delivery Base Package (In Rs.{feeState.stampPaperDenomination || 100} paper, {feeState.deliveryLocation || 'Within Chennai'} with courier):
              </span>
              <span className="font-mono font-semibold text-white">₹{feeState.basePackagePrice?.toLocaleString('en-IN') ?? 350}</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Notary Public Verification & Signature:</span>
              <span className={`font-mono font-semibold ${feeState.includeNotary ? 'text-amber-400' : 'text-stone-400'}`}>
                {feeState.includeNotary ? `+₹${(feeState.notaryFee ?? 200).toLocaleString('en-IN')}` : 'Not selected (₹0)'}
              </span>
            </div>
            <div className="border-t border-stone-800 pt-3 flex justify-between text-sm font-bold text-amber-400">
              <span>Total Payable Amount:</span>
              <span className="font-mono text-base">₹{feeState.totalPayable?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-xl p-4 border border-stone-700 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Order Review & Submission</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Your rental agreement details will be submitted for verification and printing on authentic non-judicial stamp paper.
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={onSubmitOrder}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-600 text-stone-950 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Submit Rental Agreement Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
