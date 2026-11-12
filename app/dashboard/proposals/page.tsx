"use client";
import { PageLoading, PageEmpty } from "@/components/ui/states";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, ArrowRight, Lock } from "lucide-react";
import ProposalBuilder from "@/components/features/proposals/ProposalBuilder";
import { saveProposalAction } from "@/app/actions/proposals";
import { toast } from "sonner";
import Link from "next/link";

export default function ProposalsPage() {
  const supabase = createClient();
  const [proposals, setProposals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingProposal, setEditingProposal] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Check Plan
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .single();

    const plan = sub?.status === "active" ? sub?.plan_id : "free";
    if (plan === "free" || plan === "productivity") {
      setIsLocked(true);
      setLoading(false);
      return;
    }

    const { data: propData } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });
    setProposals(propData || []);

    const { data: clientData } = await supabase
      .from("clients")
      .select("id, name")
      .order("name");
    setClients(clientData || []);

    const { data: projData } = await supabase
      .from("projects")
      .select("id, name")
      .order("name");
    setProjects(projData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    const payload = editingProposal ? { ...data, id: editingProposal.id } : data;
    const res = await saveProposalAction(payload);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(editingProposal ? "Proposal updated." : "Proposal saved.");
      setIsBuilding(false);
      setEditingProposal(null);
      fetchData();
    }
  };

  const handleEdit = (proposal: any) => {
    setEditingProposal(proposal);
    setIsBuilding(true);
  };

  const handleNew = () => {
    setEditingProposal(null);
    setIsBuilding(true);
  };

  const handleCancel = () => {
    setIsBuilding(false);
    setEditingProposal(null);
  };

  if (loading) {
    return <PageLoading />;
  }

  if (isLocked) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20">
        <Lock className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Proposal Studio is Locked</h1>
        <p className="text-[#C7D0E0] mb-8">
          Upgrade to the Professional plan to generate beautiful, professional proposals for
          your clients.
        </p>
        <Link href="/dashboard/settings/billing">
          <Button className="bg-klyvor-gradient text-white">View Upgrades</Button>
        </Link>
      </div>
    );
  }

  if (isBuilding) {
    return (
      <div className="h-[calc(100vh-8rem)]">
        <ProposalBuilder
          proposal={editingProposal}
          clients={clients}
          projects={projects}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">
            Professional
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Proposal Studio</h1>
          <p className="text-[#C7D0E0]">Create, manage, and export proposals to win clients.</p>
        </div>
        <Button onClick={handleNew} className="bg-klyvor-gradient text-white h-11">
          <Plus size={18} className="mr-2" /> New Proposal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proposals.length === 0 ? (
          <div className="col-span-full border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
            <FileText className="w-10 h-10 text-[#64748B] mx-auto mb-4" />
            <h3 className="text-white font-medium">No proposals yet.</h3>
            <p className="text-sm text-[#64748B]">Create your first proposal to get started.</p>
          </div>
        ) : (
          proposals.map((p) => (
            <button
              key={p.id}
              onClick={() => handleEdit(p)}
              className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all group flex flex-col h-full text-left"
            >
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {p.title || "Untitled Proposal"}
              </h3>
              <p className="text-sm text-[#64748B]">Client: {clients.find((c) => c.id === p.client_id)?.name || "No client"}</p>
              <p className="mb-4 text-sm font-semibold text-white">{p.currency || "USD"} {Number(p.total_amount || 0).toLocaleString()}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#27344B]">
                <span className="text-xs font-semibold text-[#F59E0B] uppercase">
                  {p.status || "draft"}
                </span>
                <span className="text-primary text-xs flex items-center gap-1">
                  Edit <ArrowRight size={14} />
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
