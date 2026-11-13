"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Paperclip, File, Image as ImageIcon, Download, Trash2, Loader2, Plus } from "lucide-react";
import { PLAN_CONFIG, PlanId } from "@/lib/plans";
import Link from "next/link";

interface Attachment {
  id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
}

export default function DocumentAttachments({ documentId }: { documentId: string }) {
  const supabase = createClient();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [canAttach, setCanAttach] = useState(true);
  const [maxStorage, setMaxStorage] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEntitlements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .single();

    const planId = ((sub?.status === "active" ? sub.plan_id : "free") || "free") as PlanId;
    const plan = PLAN_CONFIG[planId] || PLAN_CONFIG.free;
    setCanAttach(plan.can_use_attachments);
    setMaxStorage(plan.max_storage_bytes);

    const { data: rows } = await supabase
      .from("document_attachments")
      .select("size_bytes")
      .eq("user_id", user.id);
    const used = (rows || []).reduce((sum, row) => sum + Number(row.size_bytes || 0), 0);
    setUsedStorage(used);
  };

  const fetchAttachments = async () => {
    const { data, error } = await supabase
      .from("document_attachments")
      .select("*")
      .eq("document_id", documentId)
      .order("created_at", { ascending: false });
    if (!error) setAttachments(data || []);
  };

  useEffect(() => {
    loadEntitlements();
    fetchAttachments();
  }, [documentId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canAttach) {
      toast.error("Attachments require the Productivity plan or higher.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) return toast.error("File too large. Max 5MB.");
    if (maxStorage > 0 && usedStorage + file.size > maxStorage) {
      return toast.error("Storage limit reached for your plan. Please upgrade or remove files.");
    }
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) return toast.error("Invalid file type. Only PDF, JPG, PNG, WebP allowed.");

    setIsUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const uniqueId = crypto.randomUUID();
    const storagePath = `\( {user.id}/ \){documentId}/\( {uniqueId}. \){fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("document-attachments")
      .upload(storagePath, file);

    if (uploadError) {
      toast.error("Upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("document_attachments").insert([{
      document_id: documentId,
      user_id: user.id,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    }]);

    if (dbError) {
      await supabase.storage.from("document-attachments").remove([storagePath]);
      toast.error("Failed to save attachment.");
    } else {
      toast.success("File attached successfully.");
      setUsedStorage((prev) => prev + file.size);
      fetchAttachments();
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (attachment: Attachment) => {
    const { data, error } = await supabase.storage
      .from("document-attachments")
      .createSignedUrl(attachment.storage_path, 60);
    if (error || !data) toast.error("Could not generate download link.");
    else window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (attachment: Attachment) => {
    if (!confirm("Remove this attachment?")) return;
    await supabase.storage.from("document-attachments").remove([attachment.storage_path]);
    const { error } = await supabase.from("document_attachments").delete().eq("id", attachment.id);
    if (error) toast.error("Failed to delete attachment.");
    else {
      toast.success("Attachment removed.");
      setAttachments(attachments.filter((a) => a.id !== attachment.id));
      setUsedStorage((prev) => Math.max(0, prev - Number(attachment.size_bytes || 0)));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="mt-8 border-t border-[#27344B] pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Paperclip size={18} className="text-[#64748B]" /> Attachments
        </h3>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".pdf,image/jpeg,image/png,image/webp" />
        {canAttach ? (
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E] h-8 text-xs">
            {isUploading ? <><Loader2 size={14} className="mr-2 animate-spin" /> Uploading...</> : <><Plus size={14} className="mr-2" /> Add File</>}
          </Button>
        ) : (
          <Link href="/dashboard/settings/billing" className="text-xs font-semibold text-[#F59E0B] hover:text-white">
            Upgrade to attach files
          </Link>
        )}
      </div>

      {!canAttach && (
        <p className="text-sm text-[#64748B] mb-3">Attachments are available on Productivity and higher plans.</p>
      )}
      {canAttach && maxStorage > 0 && (
        <p className="text-[10px] text-[#64748B] mb-3">Storage used: {formatSize(usedStorage)} / {formatSize(maxStorage)}</p>
      )}

      {attachments.length === 0 ? (
        <p className="text-sm text-[#64748B]">No attachments yet. Upload PDFs or images here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attachments.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-[#111A2E] border border-[#27344B] p-3 rounded-lg group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-[#0B1020] border border-[#27344B] flex items-center justify-center shrink-0">
                  {file.mime_type.includes("image") ? <ImageIcon size={16} className="text-[#00D4FF]" /> : <File size={16} className="text-[#EF4444]" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{file.file_name}</p>
                  <p className="text-[10px] text-[#64748B]">{formatSize(file.size_bytes)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button onClick={() => handleDownload(file)} className="p-1.5 text-[#64748B] hover:text-[#00D4FF] transition-colors" title="Download">
                  <Download size={16} />
                </button>
                <button onClick={() => handleDelete(file)} className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
