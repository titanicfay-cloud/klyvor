import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="October 24, 2026">
      <div className="bg-[#111A2E] border border-[#27344B] p-4 rounded-lg mb-8 text-sm">
        <strong>Important Note:</strong> This Privacy Policy is an initial V1 document for KLYVOR. It accurately reflects the platform's actual data practices and is not a substitute for professional legal advice.
      </div>

      <h2>1. Who Operates KLYVOR?</h2>
      <p>KLYVOR is an independently developed platform created by a solo founder.</p>

      <h2>2. Information Collected</h2>
      <p>We collect the information you provide directly to us: your name, email address, authentication ID, and the content you create (tasks, documents, saved pricing calculations).</p>

      <h2>3. How Information Is Used</h2>
      <p>Your data is used solely to provide the service: authenticating your account, storing your workspace data, and ensuring platform security. We do not sell your data.</p>

      <h2>4. Supabase and Security</h2>
      <p>KLYVOR uses Supabase for authentication and database infrastructure. We enforce Row Level Security (RLS) on our database. This means your tasks, documents, and calculations are technically isolated and cannot be accessed by other users.</p>

      <h2>5. Hosting and Third Parties</h2>
      <p>Our application is hosted on Vercel, and our database is hosted on Supabase. We do not share your private data with any other third parties.</p>
      <ul>
        <li><a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">Supabase Privacy Policy</a></li>
        <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel Privacy Policy</a></li>
      </ul>

      <h2>6. Cookies and Browser Storage</h2>
      <p>We use strictly necessary cookies for authentication (provided by Supabase) and local browser storage to maintain your session and preferences.</p>

      <h2>7. Sharing Information</h2>
      <p>We do not sell or rent your personal data. Information is only shared with the infrastructure providers necessary to run the platform (Supabase, Vercel).</p>

      <h2>8. Data Retention</h2>
      <p>We retain your data as long as your account is active. If you request account deletion, your data is removed from our primary database, though infrastructure backups may persist temporarily.</p>

      <h2>9. User Privacy Rights</h2>
      <p>You have the right to access, correct, or request the deletion of your data at any time. You can export your data directly from the Account Settings page.</p>

      <h2>10. Children's Privacy</h2>
      <p>KLYVOR is intended for professional use and is not directed at individuals under the age of 16. We do not knowingly collect data from children.</p>

      <h2>11. International Processing</h2>
      <p>Your data may be processed in data centers located outside your country (depending on the Supabase and Vercel region configurations).</p>

      <h2>12. Security Incidents</h2>
      <p>We implement reasonable safeguards to protect your data. However, no method of transmission over the internet is 100% secure.</p>

      <h2>13. Policy Changes</h2>
      <p>We may update this policy. Changes will be reflected by the "Last updated" date at the top of this page.</p>

      <h2>14. Contact</h2>
      <p>For privacy-related questions, please use the Help & Support widget.</p>
    </LegalLayout>
  );
}
