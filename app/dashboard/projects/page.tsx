import ComingSoon from "@/components/dashboard/ComingSoon";
import { Calendar } from "lucide-react";

export default function ProjectsPage() {
  return (
    <ComingSoon 
      title="Project Planner"
      subtitle="Structure your work, manage milestones, and keep complex projects moving forward without the chaos."
      icon={<Calendar size={32} className="text-secondary" />}
      accentColor="#7C5CFC"
      features={[
        "Visual Kanban Boards",
        "Milestone Tracking",
        "Project Timelines",
      ]}
    />
  );
}
