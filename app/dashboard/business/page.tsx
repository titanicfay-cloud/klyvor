import ComingSoon from "@/components/dashboard/ComingSoon";
import { Briefcase } from "lucide-react";

export default function BusinessPage() {
  return (
    <ComingSoon 
      title="Business Tools"
      subtitle="A powerful suite of operational tools designed to support the practical side of running your business."
      icon={<Briefcase size={32} className="text-primary" />}
      accentColor="#00D4FF"
      features={[
        "Client Management (CRM)",
        "Invoice Generation",
        "Income & Budget Planning",
      ]}
    />
  );
}
