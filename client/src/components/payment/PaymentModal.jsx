import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
  LoaderCircle,
  Zap,
} from "lucide-react";

const PaymentModal = ({ planName = "GOLD", isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState("card"); // "card" | "upi" | "razorpay"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI State
  const [upiId, setUpiId] = useState("");

  if (!isOpen) return null;

  const validPlan = planName.toUpperCase() === "PLATINUM" ? "PLATINUM" : "GOLD";
  const amount = validPlan === "PLATINUM" ? 999 : 499;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // 1. Create Payment Order in Backend
      const orderRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: validPlan }),
        }
      );

      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.success) {
        throw new Error(orderJson.message || "Failed to create payment order.");
      }

      const { orderId } = orderJson.data;

      // 2. Verify & Process Payment
      const verifyRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            plan: validPlan,
            amount,
          }),
        }
      );

      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok || !verifyJson.success) {
        throw new Error(verifyJson.message || "Payment verification failed.");
      }

      setSuccessMsg(`🎉 Payment Successful! Upgraded to ${validPlan} Plan.`);

      setTimeout(() => {
        onSuccess?.(verifyJson.data.user);
        onClose();
        window.location.reload(); // Refresh session data & unlock model answers
      }, 1200);
    } catch (err) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-zinc-100 p-2 text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              UPGRADE SUBSCRIPTION
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <ShieldCheck size={14} className="text-emerald-500" /> 256-Bit SSL Encrypted
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">
            Checkout — {validPlan} Plan
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Unlock AI Model Answers, extra interview quota, and detailed performance analytics.
          </p>
        </div>

        {/* Price Tag Box */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/30">
          <div>
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              {validPlan} Membership (1 Year Access)
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {validPlan === "PLATINUM" ? "100 Interviews + Full Features" : "50 Interviews + Full Features"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              ₹{amount}
            </span>
            <span className="text-xs text-zinc-400"> /year</span>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-950">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
              method === "card"
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <CreditCard size={14} /> Card
          </button>

          <button
            type="button"
            onClick={() => setMethod("upi")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
              method === "upi"
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <QrCode size={14} /> UPI / QR
          </button>

          <button
            type="button"
            onClick={() => setMethod("razorpay")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
              method === "razorpay"
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Zap size={14} /> One-Click
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          {method === "card" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4532 •••• •••• 8921"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08/28"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          {method === "upi" && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                UPI ID / VPA
              </label>
              <input
                type="text"
                required
                placeholder="username@okaxis or username@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
              <p className="mt-1.5 text-[11px] text-zinc-500">
                Supports Google Pay, PhonePe, Paytm, BHIM, and all bank UPI apps.
              </p>
            </div>
          )}

          {method === "razorpay" && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <Zap className="mx-auto text-blue-500 mb-2" size={32} />
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Instant One-Click Express Checkout
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                Automatically connects to Razorpay / Stripe gateway for instant authorization.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock size={16} /> Pay ₹{amount} & Upgrade Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
