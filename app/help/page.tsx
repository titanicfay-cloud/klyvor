import LegalLayout from "@/components/legal/LegalLayout";

export default function HelpPage() {
  return (
    <LegalLayout title="Help & Support" lastUpdated="October 24, 2026">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">We're here to help.</h2>
        <p className="mb-8">If you have a question or need assistance, please use the floating support widget located in the bottom right corner of the screen.</p>
        <p className="text-[#64748B] text-sm">Technical issues? Log in to your dashboard to submit a support ticket directly.</p>
      </div>
    </LegalLayout>
  );
}
