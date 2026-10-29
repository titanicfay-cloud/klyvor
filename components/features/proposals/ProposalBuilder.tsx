"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Save, ArrowLeft } from "lucide-react";
import TiptapEditor from "@/components/dashboard/TiptapEditor";

export default function ProposalBuilder({ proposal, clients, projects, onSave, onCancel }: any) {
  const [title, setTitle] = useState(proposal?.title || "");
  const [clientId, setClientId] = useState(proposal?.client_id || "none");
  const [projectId, setProjectId] = useState(proposal?.project_id || "none");
  const [amount, setAmount] = useState(proposal?.total_amount || "");
  const [currency, setCurrency] = useState(proposal?.currency || "USD");
  const [content, setContent] = useState(proposal?.content_json || "");
  
  const handleSave = () => {
    onSave({ title, client_id: clientId === "none" ? null : clientId, project_id: projectId === "none" ? null : projectId, total_amount: parseFloat(amount) || 0, currency, content_json: content });
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="flex flex-col h-full bg-[#0B1020] rounded-xl border border-[#27344B] overflow-hidden">
      {/* Toolbar (Hidden on Print) */}
      <div className="h-16 border-b border-[#27344B] flex items-center justify-between px-4 sm:px-6 bg-[#111A2E]/50 shrink-0 no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel} className="text-[#C7D0E0] hover:text-white"><ArrowLeft size={20} /></Button>
          <h2 className="text-white font-bold">Edit Proposal</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="border-[#27344B] text-white"><Printer size={16} className="mr-2"/> Export PDF</Button>
          <Button onClick={handleSave} className="bg-klyvor-gradient text-white"><Save size={16} className="mr-2"/> Save</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 print-container">
        <div className="max-w-4xl mx-auto space-y-6 print-content">
          
          {/* Print Header */}
          <div className="print-header hidden print:block mb-8">
            <h1 className="text-3xl font-bold">KLYVOR Proposal</h1>
            <p className="text-sm text-gray-500">Prepared for your review</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#C7D0E0]">Proposal Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#C7D0E0]">Client</label>
              <Select value={clientId} onValueChange={(val) => setClientId(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{clientId === "none" ? "Select Client" : clients.find((c: any) => c.id === clientId)?.name}</SelectValue></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Client</SelectItem>{clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#C7D0E0]">Linked Project</label>
              <Select value={projectId} onValueChange={(val) => setProjectId(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{projectId === "none" ? "No Project" : projects.find((p: any) => p.id === projectId)?.name}</SelectValue></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Project</SelectItem>{projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#C7D0E0]">Total Amount</label>
              <div className="flex gap-2">
                <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
                  <SelectTrigger className="w-[100px] bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem><SelectItem value="NGN">NGN</SelectItem></SelectContent>
                </Select>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 bg-[#111A2E] border-[#27344B] text-white" />
              </div>
            </div>
          </div>

          {/* Print Details */}
          <div className="hidden print:flex justify-between border-b border-gray-200 pb-4 mb-6">
             <div><strong>Prepared By:</strong> KLYVOR User</div>
             <div><strong>Client:</strong> {clients.find((c: any) => c.id === clientId)?.name || "N/A"}</div>
             <div><strong>Amount:</strong> {currency} {amount}</div>
          </div>

          <div className="border border-[#27344B] rounded-xl overflow-hidden print:border-none">
            <TiptapEditor content={content} onChange={(html, text) => setContent(html)} />
          </div>

        </div>
      </div>
    </div>
  );
}
