import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="October 24, 2026">
      <div className="bg-[#111A2E] border border-[#27344B] p-4 rounded-lg mb-8 text-sm">
        <strong>Important Note:</strong> These Terms of Service are an initial V1 document prepared for KLYVOR's current stage of development. They explain the basic rules for using the platform but have not been represented as a substitute for advice from a qualified legal professional.
      </div>

      <h2>1. About KLYVOR</h2>
      <p>KLYVOR is an independently developed professional workspace providing tools for Task Management, Documents & Notes, and Pricing Calculations.</p>

      <h2>2. Acceptance of Terms</h2>
      <p>By accessing or using KLYVOR, you agree to be bound by these Terms. If you do not agree, you must not use the platform.</p>

      <h2>3. Accounts</h2>
      <p>You agree to provide accurate information during registration, to protect your account credentials, and to not impersonate others or attempt unauthorized access.</p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use KLYVOR for unlawful purposes, to attempt to bypass security measures, or to access other users' private data.</p>

      <h2>5. User Content</h2>
      <p>You retain all ownership rights to the content you create (tasks, documents, calculations). KLYVOR claims no ownership over your professional data and only processes it as necessary to provide the service.</p>

      <h2>6. Tools and Calculations</h2>
      <p>The Pricing Calculator provides estimates based on the figures you input. It does not guarantee earnings, profitability, or market rates. You are solely responsible for your financial decisions.</p>

      <h2>7. Availability and Changes</h2>
      <p>KLYVOR is under active development. Features may be added, modified, or temporarily unavailable as we improve the platform.</p>

      <h2>8. Security</h2>
      <p>We implement industry-standard measures, including Row Level Security (RLS), to protect your data. However, no system is perfectly secure, and we cannot guarantee absolute security.</p>

      <h2>9. Third-Party Services</h2>
      <p>KLYVOR uses Supabase for authentication and database hosting, and Vercel for application hosting. Your data is stored on their infrastructure.</p>

      <h2>10. Suspension and Termination</h2>
      <p>We reserve the right to restrict or terminate access to KLYVOR if you violate these Terms or pose a security risk to the platform or other users.</p>

      <h2>11. Account Deletion</h2>
      <p>For V1, account deletion is handled manually. Please submit a request via the Help & Support widget.</p>

      <h2>12. Disclaimers</h2>
      <p>KLYVOR is provided "as is" without warranties of any kind, subject to rights that cannot be legally excluded.</p>

      <h2>13. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, KLYVOR shall not be liable for any indirect or consequential damages resulting from your use of the platform.</p>
      <p className="text-yellow-500 text-sm">[Founder Note: This section should be reviewed by a legal professional prior to significant commercial expansion.]</p>

      <h2>14. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. Significant changes will be noted by the updated date at the top of this page.</p>

      <h2>15. Governing Law</h2>
      <p className="text-yellow-500 text-sm">[Founder Note: The governing jurisdiction must be specified here. Please consult a legal professional to insert the appropriate jurisdiction.]</p>

      <h2>16. Contact</h2>
      <p>For any questions regarding these Terms, please use the Help & Support widget.</p>
    </LegalLayout>
  );
}
