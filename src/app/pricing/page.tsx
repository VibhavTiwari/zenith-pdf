"use client";

import { useState } from "react";
import { Check, X, Crown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const CONSUMER_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic tools with limits",
    cta: "Get Started",
    ctaStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    highlighted: false,
    features: [
      { text: "3 jobs per day", included: true },
      { text: "50 MB max file size", included: true },
      { text: "200 pages per file", included: true },
      { text: "1–5 files per batch", included: true },
      { text: "2-hour file retention", included: true },
      { text: "Basic tools (merge, split, rotate, etc.)", included: true },
      { text: "Ads shown", included: true },
      { text: "Cloud import/export", included: false },
      { text: "OCR", included: false },
      { text: "AI features", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Plus",
    price: "$7",
    period: "/month",
    description: "More power, no ads",
    cta: "Start Free Trial",
    ctaStyle: "border border-blue-300 text-blue-700 hover:bg-blue-50",
    highlighted: false,
    features: [
      { text: "50 jobs per day", included: true },
      { text: "300 MB max file size", included: true },
      { text: "1,000 pages per file", included: true },
      { text: "Up to 30 files per batch", included: true },
      { text: "7-day file retention", included: true },
      { text: "All basic tools", included: true },
      { text: "No ads", included: true },
      { text: "Cloud import/export", included: true },
      { text: "Normal priority queue", included: true },
      { text: "Job history (7 days)", included: true },
      { text: "Basic support", included: true },
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Power features unlocked",
    cta: "Start Free Trial",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    highlighted: true,
    features: [
      { text: "300 jobs per day", included: true },
      { text: "1 GB max file size", included: true },
      { text: "3,000 pages per file", included: true },
      { text: "Up to 100 files per batch", included: true },
      { text: "30-day file retention", included: true },
      { text: "All tools + OCR", included: true },
      { text: "Strong compression", included: true },
      { text: "Edit text in place", included: true },
      { text: "PDF ↔ Office conversions", included: true },
      { text: "Redaction, Compare, Repair", included: true },
      { text: "3,000 OCR pages/month", included: true },
      { text: "High priority queue", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    name: "Pro + AI",
    price: "$16",
    period: "/month",
    description: "Everything including AI",
    cta: "Start Free Trial",
    ctaStyle: "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 shadow-lg",
    highlighted: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Chat with PDF", included: true },
      { text: "Summarize PDF", included: true },
      { text: "Translate PDF", included: true },
      { text: "2,000 AI credits/month", included: true },
      { text: "AI credit admin (teams)", included: true },
    ],
  },
];

const ADDONS = [
  {
    name: "E-Sign Add-on",
    price: "$8/month",
    description: "Digital signature workflows",
    features: [
      "Self-sign documents",
      "Send for signature",
      "Audit trail certificates",
      "Templates & bulk send",
      "Reminder workflows",
    ],
  },
];

const TEAM_PLANS = [
  {
    name: "Team",
    price: "$10",
    period: "/seat/month",
    min: "Min 3 seats",
    features: [
      "600 jobs/seat/day",
      "Shared workspace",
      "Pooled quotas",
      "Basic audit logs",
      "90-day retention",
    ],
  },
  {
    name: "Business",
    price: "$15",
    period: "/seat/month",
    min: "Min 5 seats",
    features: [
      "Everything in Team",
      "SSO / SCIM provisioning",
      "Full audit logs",
      "Regional data processing",
      "2 GB max file size",
      "180-day retention",
      "Priority SLA support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    min: "Custom terms",
    features: [
      "Everything in Business",
      "Dedicated infrastructure",
      "Custom data residency",
      "Contractual SLA",
      "Custom integrations",
      "Volume discounts",
    ],
  },
];

const API_PLANS = [
  { name: "Developer Free", price: "$0", credits: "2,500 credits/month", parallel: "1 job", support: "Community" },
  { name: "Starter", price: "$49/mo", credits: "50,000 credits/month", parallel: "5 jobs", support: "Email" },
  { name: "Growth", price: "$199/mo", credits: "250,000 credits/month", parallel: "15 jobs", support: "Priority" },
  { name: "Business", price: "$499/mo", credits: "750,000 credits/month", parallel: "50 jobs", support: "SLA" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start for free. Upgrade when you need more power. No hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              billing === "monthly"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              billing === "annual"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Consumer Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {CONSUMER_PLANS.map((plan) => {
          const displayPrice =
            billing === "annual" && plan.price !== "$0"
              ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
              : plan.price;

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-blue-500 ring-2 ring-blue-500 shadow-xl"
                  : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {displayPrice}
                </span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <button
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "text-gray-700" : "text-gray-400"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* E-Sign Add-on */}
      <div className="mb-16">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">
                E-Sign Add-on
              </h3>
              <span className="text-lg font-bold text-indigo-600">
                $8/month
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Attach to any Plus, Pro, or Pro+AI plan. Full signature workflows
              with audit trails.
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {ADDONS[0].features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shrink-0">
            Add to Plan
          </button>
        </div>
      </div>

      {/* Team Plans */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Team & Business Plans
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TEAM_PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {plan.name}
              </h3>
              <div className="mb-1">
                <span className="text-3xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{plan.min}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                {plan.name === "Enterprise" ? "Contact Sales" : "Start Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Plans */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          API Plans
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Integrate PDF processing into your apps with our REST API
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Parallel Jobs</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Support</th>
              </tr>
            </thead>
            <tbody>
              {API_PLANS.map((plan) => (
                <tr key={plan.name} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{plan.name}</td>
                  <td className="py-3 px-4 text-gray-700">{plan.price}</td>
                  <td className="py-3 px-4 text-gray-700">{plan.credits}</td>
                  <td className="py-3 px-4 text-gray-700">{plan.parallel}</td>
                  <td className="py-3 px-4 text-gray-700">{plan.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Schedule */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Credit Schedule
        </h2>
        <p className="text-center text-gray-500 mb-8">
          1 credit = processing 1 page in a light operation
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: "Light",
              color: "bg-blue-100 text-blue-700",
              items: [
                "Merge/Split/Reorder: 1 credit/page",
                "Rotate: 0.25 credit/page (min 2)",
              ],
            },
            {
              label: "Medium",
              color: "bg-amber-100 text-amber-700",
              items: [
                "Compress Basic: 2 credits/page",
                "Compress Strong: 3.5 credits/page",
                "Watermark/Headers: 1.5–2 credits/page",
                "PDF → Images: 2 credits/page",
              ],
            },
            {
              label: "Heavy",
              color: "bg-red-100 text-red-700",
              items: [
                "Office ↔ PDF: 4–6 credits/page",
                "OCR: 8 credits/page",
                "Redaction: 6 credits/page",
                "Compare: 10 credits/page",
                "Repair: 50 credits + per page",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.label}
              className="rounded-xl border border-gray-200 p-5"
            >
              <span
                className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${tier.color} mb-3`}
              >
                {tier.label}
              </span>
              <ul className="space-y-1.5">
                {tier.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I try before I buy?",
              a: "Yes! All plans include a 14-day free trial. Use the free tier with no sign-up required to test basic tools instantly.",
            },
            {
              q: "How long are my files stored?",
              a: "Free users: 2 hours. Plus: 7 days. Pro: 30 days. Business: 180 days. Enterprise: custom retention policies. You can always delete files immediately.",
            },
            {
              q: "What happens when I hit my daily job limit?",
              a: "You'll see a clear message with your usage. Limits reset at midnight UTC. Upgrade anytime for higher limits — changes take effect immediately.",
            },
            {
              q: "Is my data secure?",
              a: "All transfers use 256-bit TLS encryption. Files are processed in isolated environments and auto-deleted according to your plan's retention policy. We never access your file contents.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. All plans are month-to-month with no long-term commitment. Cancel anytime from your account settings — your access continues until the end of the billing period.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-gray-200 p-5"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl">
                  +
                </span>
              </summary>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link
          href="/tools/merge-pdf"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          Start for free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
