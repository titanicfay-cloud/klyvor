"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Plus, Search, FileText, MoreHorizontal, Trash2, Copy, ArrowLeft, CheckCircle2, Loader2, AlertCircle, FileEdit, StickyNote, FolderKanban, ChevronDown, Type } from "lucide-react";
import { formatDate } from "@/lib/utils";
import TiptapEditor from "@/components/dashboard/TiptapEditor";
import DocumentAttachments from "@/components/dashboard/DocumentAttachments";

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

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || (d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || d.document_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* FIXED: Added Page Header */}
      <div className="mb-6 shrink-0">
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Work</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Documents & Notes</h1>
        <p className="text-[#C7D0E0]">Create, organise, and save notes and rich documents.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* SIDEBAR */}
        <div className={`w-full md:w-80 flex-col bg-[#111A2E] border border-[#27344B] rounded-xl overflow-hidden shrink-0 ${isMobileEditorOpen ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#27344B]">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-10 mb-4 flex items-center justify-between px-4 rounded-md outline-none transition-opacity">
                <span className="flex items-center gap-2"><Plus size={16} /> Create New</span><ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[280px] bg-[#111A2E] border-[#27344B] text-white">
                <DropdownMenuItem onClick={() => handleCreate("quick_note")} className="cursor-pointer p-3 hover:bg-[#0B1020] flex flex-col items-start gap-1"><div className="flex items-center gap-2 font-semibold text-sm"><StickyNote size={16} className="text-[#F59E0B]"/> Quick Note</div><span className="text-xs text-[#64748B] pl-6">Capture an idea quickly.</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreate("rich_document")} className="cursor-pointer p-3 hover:bg-[#0B1020] flex flex-col items-start gap-1"><div className="flex items-center gap-2 font-semibold text-sm"><FileEdit size={16} className="text-[#00D4FF]"/> Rich Document</div><span className="text-xs text-[#64748B] pl-6">Structured writing with formatting.</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={14} /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white text-sm h-9" /></div>
          </div>
          <div className="flex border-b border-[#27344B]">
            {["all", "quick_note", "rich_document"].map((type) => (
              <button key={type} onClick={() => setFilterType(type)} className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-semibold border-b-2 transition-colors ${filterType === type ? "border-primary text-primary bg-[#0B1020]/50" : "border-transparent text-[#64748B] hover:text-white"}`}>{type === "all" ? "All" : type === "quick_note" ? "Notes" : "Docs"}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? <div className="p-8 text-center text-[#64748B] text-sm">Loading...</div> : filteredDocs.length === 0 ? <div className="p-8 text-center text-[#64748B] text-sm">Your ideas start here.</div> : (
              <div className="flex flex-col">
                {filteredDocs.map(doc => (
                  <div key={doc.id} onClick={() => { setActiveDoc(doc); setIsMobileEditorOpen(true); }} className={`p-4 border-b border-[#27344B] cursor-pointer transition-colors group ${activeDoc?.id === doc.id ? 'bg-[#0B1020] border-l-2 border-l-primary' : 'hover:bg-[#0B1020]/50 border-l-2 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2 pr-2 overflow-hidden">{doc.document_type === "quick_note" ? <StickyNote size={14} className="text-[#F59E0B] shrink-0" /> : <FileText size={14} className="text-[#00D4FF] shrink-0" />}<h3 className={`text-sm font-semibold truncate ${activeDoc?.id === doc.id ? 'text-primary' : 'text-white'}`}>{doc.title || "Untitled"}</h3></div>
                      <DropdownMenu><DropdownMenuTrigger className="text-[#64748B] hover:text-white outline-none"><MoreHorizontal size={16} /></DropdownMenuTrigger><DropdownMenuContent align="end" className="bg-[#111A2E] border-[#27344B] text-white"><DropdownMenuItem onClick={(e) => handleDelete(doc.id, e)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                    </div>
                    <p className="text-xs text-[#64748B] truncate mb-2">{doc.content || "Empty..."}</p>
                    <div className="flex items-center justify-between"><p className="text-[10px] text-[#64748B]">Edited {formatDate(doc.updated_at, timezone, dateFormat)}</p>{doc.project_id && <span className="text-[10px] text-[#7C5CFC] flex items-center gap-1"><FolderKanban size={10} /> Project</span>}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* EDITOR */}
        <div className={`flex-1 flex-col bg-[#0B1020] border border-[#27344B] rounded-xl overflow-hidden relative ${!isMobileEditorOpen ? 'hidden md:flex' : 'flex'}`}>
          {activeDoc ? (
            <>
              <div className="h-16 border-b border-[#27344B] flex items-center justify-between px-4 sm:px-6 bg-[#111A2E]/50 shrink-0">
                <div className="flex items-center gap-3"><button onClick={() => setIsMobileEditorOpen(false)} className="md:hidden text-[#C7D0E0]"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-1.5 text-xs font-medium">{saveStatus === "saved" && <><CheckCircle2 size={14} className="text-success" /><span className="text-[#64748B]">Saved</span></>}{saveStatus === "saving" && <><Loader2 size={14} className="text-primary animate-spin" /><span className="text-primary">Saving...</span></>}{saveStatus === "unsaved" && <><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><span className="text-[#F59E0B]">Unsaved</span></>}{saveStatus === "error" && <><AlertCircle size={14} className="text-[#EF4444]" /><span className="text-[#EF4444]">Error</span></>}</div></div>
                <div className="flex items-center gap-2">
                  <Select value={activeDoc.project_id || "none"} onValueChange={(val) => handleLinkProject(val as string)}>
                    <SelectTrigger className="w-[160px] h-8 bg-[#0B1020] border-[#27344B] text-[#C7D0E0] text-xs"><SelectValue placeholder="Link to Project">{activeDoc.project_id === "none" || !activeDoc.project_id ? "No Project" : projects.find(p => p.id === activeDoc.project_id)?.name || "Select"}</SelectValue></SelectTrigger>
                    <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Project</SelectItem>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="max-w-4xl w-full mx-auto flex flex-col h-full overflow-y-auto p-4 sm:p-8">
                  <input type="text" value={activeDoc.title} onChange={(e) => { const newDoc = { ...activeDoc, title: e.target.value }; setActiveDoc(newDoc); triggerAutosave(newDoc); }} placeholder={activeDoc.document_type === "quick_note" ? "Note Title" : "Document Title"} className="text-3xl sm:text-4xl font-bold text-white bg-transparent border-none outline-none mb-6 placeholder:text-[#27344B] shrink-0" />
                  {activeDoc.document_type === "quick_note" ? <textarea value={activeDoc.content || ""} onChange={(e) => handleQuickNoteChange(e.target.value)} placeholder="Start writing..." className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[#C7D0E0] text-lg leading-relaxed" /> : <div className="flex-1 rounded-xl"><TiptapEditor content={activeDoc.content_json || ""} onChange={handleRichDocChange} /><DocumentAttachments documentId={activeDoc.id} /></div>}
                </div>
              </div>
              <div className="h-10 border-t border-[#27344B] bg-[#111A2E] flex items-center justify-end px-6 text-xs text-[#64748B] shrink-0"><span>{wordCount} words · {charCount} characters</span></div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center"><Type className="w-16 h-16 text-[#27344B] mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Your workspace is ready.</h2><p className="text-[#64748B] mb-8 max-w-sm">Select a document or create a new one to get started.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
