"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, FileText, MoreHorizontal, Trash2, Copy, ArrowLeft, CheckCircle2, Loader2, AlertCircle, FolderKanban } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  content: string;
  project_id: string | null;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export default function DocumentsPage() {
  const supabase = createClient();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  const activeDocRef = useRef<Document | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeDocRef.current = activeDoc;
  }, [activeDoc]);

  const fetchDocumentsAndPrefs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) {
      setTimezone(prefs.timezone || "UTC");
      setDateFormat(prefs.date_format || "DD/MM/YYYY");
    }

    const { data: projData } = await supabase.from("projects").select("id, name").order("name");
    setProjects(projData || []);

    const { data, error } = await supabase.from("documents").select("*").order("updated_at", { ascending: false });
    if (error) toast.error("LOAD ERROR: " + error.message);
    else {
      setDocuments(data || []);
      if (data && data.length > 0 && !activeDoc) setActiveDoc(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocumentsAndPrefs();
  }, []);

  const triggerAutosave = (updatedDoc: Document) => {
    setSaveStatus("unsaved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const latestDoc = activeDocRef.current;
      if (!latestDoc) return;

      const { error } = await supabase
        .from("documents")
        .update({ title: latestDoc.title, content: latestDoc.content, project_id: latestDoc.project_id, updated_at: new Date().toISOString() })
        .eq("id", latestDoc.id);

      if (error) {
        setSaveStatus("error");
        toast.error("Couldn't save your changes.");
      } else {
        setSaveStatus("saved");
        setDocuments(prev => prev.map(d => d.id === latestDoc.id ? latestDoc : d));
      }
    }, 1000);
  };

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("documents")
      .insert([{ user_id: user.id, title: "Untitled Document", content: "" }])
      .select()
      .single();

    if (error) toast.error("Could not create document.");
    else {
      setDocuments([data, ...documents]);
      setActiveDoc(data);
      setIsMobileEditorOpen(true);
      toast.success("Document created.");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) toast.error("Could not delete document.");
    else {
      toast.success("Document deleted.");
      setDocuments(documents.filter(d => d.id !== id));
      if (activeDoc?.id === id) { setActiveDoc(null); setIsMobileEditorOpen(false); }
    }
  };

  const handleDuplicate = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("documents")
      .insert([{ user_id: user.id, title: `${doc.title} (Copy)`, content: doc.content, project_id: doc.project_id }])
      .select()
      .single();

    if (error) toast.error("Could not duplicate document.");
    else {
      setDocuments([data, ...documents]);
      toast.success("Document duplicated.");
    }
  };

  const handleLinkProject = (projectId: string) => {
    if (!activeDoc) return;
    const updatedDoc = { ...activeDoc, project_id: projectId === "none" ? null : projectId };
    setActiveDoc(updatedDoc);
    triggerAutosave(updatedDoc);
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      <div className={`w-full md:w-80 flex-col bg-[#111A2E] border border-[#27344B] rounded-xl overflow-hidden shrink-0 ${isMobileEditorOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[#27344B]">
          <Button onClick={handleCreate} className="w-full bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-10 mb-4"><Plus size={16} className="mr-2" /> New Document</Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={14} />
            <Input placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white text-sm focus-visible:ring-1 focus-visible:ring-primary h-9" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-[#64748B] text-sm">Loading...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] text-sm">{documents.length === 0 ? "No documents yet." : "No search results."}</div>
          ) : (
            <div className="flex flex-col">
              {filteredDocs.map(doc => (
                <div key={doc.id} onClick={() => { setActiveDoc(doc); setIsMobileEditorOpen(true); }} className={`p-4 border-b border-[#27344B] cursor-pointer transition-colors group ${activeDoc?.id === doc.id ? 'bg-[#0B1020] border-l-2 border-l-primary' : 'hover:bg-[#0B1020]/50 border-l-2 border-l-transparent'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-semibold truncate pr-2 ${activeDoc?.id === doc.id ? 'text-primary' : 'text-white'}`}>{doc.title || "Untitled Document"}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-[#64748B] hover:text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity outline-none"><MoreHorizontal size={16} /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111A2E] border-[#27344B] text-white">
                        <DropdownMenuItem onClick={(e) => handleDuplicate(doc, e)} className="cursor-pointer hover:bg-[#0B1020]"><Copy size={14} className="mr-2" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDelete(doc.id, e)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-[#64748B] truncate mb-2">{doc.content || "Empty document..."}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#64748B]">Edited {formatDate(doc.updated_at, timezone, dateFormat)}</p>
                    {doc.project_id && <span className="text-[10px] text-[#7C5CFC] flex items-center gap-1"><FolderKanban size={10} /> Project</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 flex-col bg-[#0B1020] border border-[#27344B] rounded-xl overflow-hidden relative ${!isMobileEditorOpen ? 'hidden md:flex' : 'flex'}`}>
        {activeDoc ? (
          <>
            <div className="h-16 border-b border-[#27344B] flex items-center justify-between px-4 sm:px-6 bg-[#111A2E]/50">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileEditorOpen(false)} className="md:hidden text-[#C7D0E0] hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {saveStatus === "saved" && <><CheckCircle2 size={14} className="text-success" /><span className="text-[#64748B]">Saved</span></>}
                  {saveStatus === "saving" && <><Loader2 size={14} className="text-primary animate-spin" /><span className="text-primary">Saving...</span></>}
                  {saveStatus === "unsaved" && <><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><span className="text-[#F59E0B]">Unsaved changes</span></>}
                  {saveStatus === "error" && <><AlertCircle size={14} className="text-[#EF4444]" /><span className="text-[#EF4444]">Couldn't save</span></>}
                </div>
              </div>
              
              {/* Project Linker Dropdown */}
              <div className="flex items-center gap-2">
                <Select value={activeDoc.project_id || "none"} onValueChange={(val) => handleLinkProject(val as string)}>
                  <SelectTrigger className="w-[180px] h-8 bg-[#0B1020] border-[#27344B] text-[#C7D0E0] text-xs">
                    <SelectValue placeholder="Link to Project">
                      {activeDoc.project_id === "none" || !activeDoc.project_id
                        ? "No Project"
                        : projects.find(p => p.id === activeDoc.project_id)?.name || "Select a project"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="none">No Project</SelectItem>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-6 sm:p-12">
              <div className="max-w-3xl w-full mx-auto flex flex-col h-full">
                <input type="text" value={activeDoc.title} onChange={(e) => { const newDoc = { ...activeDoc, title: e.target.value }; setActiveDoc(newDoc); triggerAutosave(newDoc); }} placeholder="Untitled Document" className="text-3xl sm:text-4xl font-bold text-white bg-transparent border-none outline-none mb-6 placeholder:text-[#27344B]" />
                <textarea value={activeDoc.content} onChange={(e) => { const newDoc = { ...activeDoc, content: e.target.value }; setActiveDoc(newDoc); triggerAutosave(newDoc); }} placeholder="Start writing your thoughts..." className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[#C7D0E0] text-lg leading-relaxed placeholder:text-[#27344B]" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-16 h-16 text-[#27344B] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Make space for your ideas.</h2>
            <p className="text-[#64748B] mb-8 max-w-sm">Create your first document to capture thoughts, organise information, or develop your next big idea.</p>
            <Button onClick={handleCreate} className="bg-klyvor-gradient text-white hover:opacity-90 h-11 px-8">Create Your First Document</Button>
          </div>
        )}
      </div>
    </div>
  );
}
