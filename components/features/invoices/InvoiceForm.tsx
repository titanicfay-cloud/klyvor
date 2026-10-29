"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function InvoiceForm({ data, setData, clients, projects }: any) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  const addItem = () => {
    setData({ ...data, items: [...data.items, { description: "", quantity: 1, rate: 0 }] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_: any, i: number) => i !== index);
    setData({ ...data, items: newItems });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Basic Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Invoice Number</Label><Input value={data.invoice_number} disabled className="bg-[#0B1020] border-[#27344B] text-[#64748B]" placeholder="Auto-generated" /></div>
          <div className="space-y-2"><Label>Currency</Label>
            <Select value={data.currency} onValueChange={(val) => updateField("currency", val as string)}>
              <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                <SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem><SelectItem value="NGN">NGN (₦)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Client</Label>
            <Select value={data.client_id || "none"} onValueChange={(val) => updateField("client_id", val === "none" ? null : val)}>
              <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue>{data.client_id === "none" || !data.client_id ? "Select Client" : clients.find((c: any) => c.id === data.client_id)?.name}</SelectValue></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Client</SelectItem>{clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Project (Optional)</Label>
            <Select value={data.project_id || "none"} onValueChange={(val) => updateField("project_id", val === "none" ? null : val)}>
              <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue>{data.project_id === "none" || !data.project_id ? "No Project" : projects.find((p: any) => p.id === data.project_id)?.name}</SelectValue></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Project</SelectItem>{projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={data.issue_date} onChange={e => updateField("issue_date", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white [color-scheme:dark]" /></div>
          <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={data.due_date} onChange={e => updateField("due_date", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white [color-scheme:dark]" /></div>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#27344B] pb-2">
          <Label className="text-lg">Line Items</Label>
          <Button onClick={addItem} variant="ghost" className="text-primary h-8 text-xs"><Plus size={14} className="mr-1"/> Add Item</Button>
        </div>
        {data.items.map((item: any, index: number) => (
          <div key={index} className="flex gap-2 items-start bg-[#0B1020] p-3 rounded-lg border border-[#27344B]">
            <div className="flex-1 space-y-1">
              <Input placeholder="Description" value={item.description} onChange={e => updateItem(index, "description", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" />
            </div>
            <div className="w-16 space-y-1">
              <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => updateItem(index, "quantity", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white text-center" />
            </div>
            <div className="w-24 space-y-1">
              <Input type="number" min="0" placeholder="Rate" value={item.rate} onChange={e => updateItem(index, "rate", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white text-right" />
            </div>
            <Button onClick={() => removeItem(index)} variant="ghost" className="h-10 w-10 p-0 text-[#64748B] hover:text-[#EF4444]"><Trash2 size={16}/></Button>
          </div>
        ))}
      </div>

      {/* Taxes & Discounts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" min="0" value={data.tax_rate} onChange={e => updateField("tax_rate", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
        <div className="space-y-2"><Label>Discount Amount</Label><Input type="number" min="0" value={data.discount_amount} onChange={e => updateField("discount_amount", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Notes / Payment Terms</Label>
        <textarea value={data.notes} onChange={e => updateField("notes", e.target.value)} className="w-full bg-[#0B1020] border border-[#27344B] rounded-md p-3 text-white text-sm h-24 resize-none" placeholder="e.g. Please pay within 14 days." />
      </div>
    </div>
  );
}
