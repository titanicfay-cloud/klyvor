"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import DocumentList from "@/components/features/documents/DocumentList";
import DocumentEditor from "@/components/features/documents/DocumentEditor";

export default function DocumentsPage() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);
  const activeDocRef = useRef<any | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { activeDocRef.current = activeDoc; if (activeDoc && activeDoc.document_type === "quick_note") { const text = activeDoc.content || ""; setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0); setCharCount(text.length); } }, [activeDoc]);

  const fetchDocumentsAndPrefs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) { setTimezone(prefs.timezone || "UTC"); setDateFormat(prefs.date_format || "DD/MM/YYYY"); }
    const { data: projData } = await supabase.from("projects").select("id, name").order("name");
    setProjects(projData || []);
    const { data, error } = await supabase.from("documents").select("*").order("updated_at", { ascending: false });
    if (error) toast.error("LOAD ERROR");
    else { setDocuments(data || []); if (data && data.length > 0 && !activeDoc) setActiveDoc(data[0]); }
    setLoading(false);
  };

  useEffect(() => { fetchDocumentsAndPrefs(); }, []);

  const triggerAutosave = (updatedDoc: any, textContent?: string) => {
    setSaveStatus("unsaved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const latestDoc = activeDocRef.current;
      if (!latestDoc) return;
      const payload: any = { title: latestDoc.title, project_id: latestDoc.project_id, updated_at: new Date().toISOString() };
      if (latestDoc.document_type === "quick_note") payload.content = latestDoc.content;
      else { payload.content_json = latestDoc.content_json; if (textContent !== undefined) payload.content = textContent; }
      const { error } = await supabase.from("documents").update(payload).eq("id", latestDoc.id);
      if (error) { setSaveStatus("error"); toast.error("Couldn't save."); }
      else { setSaveStatus("saved"); setDocuments(prev => prev.map(d => d.id === latestDoc.id ? latestDoc : d)); }
    }, 1000);
  };

  const handleCreate = async (type: "quick_note" | "rich_document") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("documents").insert([{ user_id: user.id, title: type === "quick_note" ? "New Note" : "New Document", document_type: type }]).select().single();
    if (error) toast.error("Could not create.");
    else { setDocuments([data, ...documents]); setActiveDoc(data); setIsMobileEditorOpen(true); toast.success("Created."); }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete permanently?")) return;
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) toast.error("Could not delete.");
    else { toast.success("Deleted."); setDocuments(documents.filter(d => d.id !== id)); if (activeDoc?.id === id) { setActiveDoc(null); setIsMobileEditorOpen(false); } }
  };

  const handleLinkProject = (projectId: string) => { if (!activeDoc) return; const updatedDoc = { ...activeDoc, project_id: projectId === "none" ? null : projectId }; setActiveDoc(updatedDoc); triggerAutosave(updatedDoc); };
  const handleQuickNoteChange = (text: string) => { if (!activeDoc) return; const updatedDoc = { ...activeDoc, content: text }; setActiveDoc(updatedDoc); setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0); setCharCount(text.length); triggerAutosave(updatedDoc); };
  const handleRichDocChange = (html: string, text: string) => { if (!activeDoc) return; const updatedDoc = { ...activeDoc, content_json: html }; setActiveDoc(updatedDoc); setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0); setCharCount(text.length); triggerAutosave(updatedDoc, text); };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 shrink-0">
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Work</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Documents & Notes</h1>
        <p className="text-[#C7D0E0]">Create, organise, and save notes and rich documents.</p>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <DocumentList documents={documents} projects={projects} loading={loading} activeDoc={activeDoc} setActiveDoc={setActiveDoc} setIsMobileEditorOpen={setIsMobileEditorOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterType={filterType} setFilterType={setFilterType} handleCreate={handleCreate} handleDelete={handleDelete} timezone={timezone} dateFormat={dateFormat} />
        <DocumentEditor activeDoc={activeDoc} setActiveDoc={setActiveDoc} saveStatus={saveStatus} projects={projects} handleLinkProject={handleLinkProject} handleRichDocChange={handleRichDocChange} handleQuickNoteChange={handleQuickNoteChange} wordCount={wordCount} charCount={charCount} isMobileEditorOpen={isMobileEditorOpen} setIsMobileEditorOpen={setIsMobileEditorOpen} triggerAutosave={triggerAutosave} />
      </div>
    </div>
  );
}
