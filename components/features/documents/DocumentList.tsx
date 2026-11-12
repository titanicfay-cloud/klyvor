"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, FileText, MoreHorizontal, Trash2, StickyNote, FolderKanban, ChevronDown, FileEdit, Folder } from "lucide-react";
import { formatDate } from "@/lib/utils";

const FOLDER_KEY = "klyvor-doc-folders";

interface DocumentListProps {
  documents: any[];
  projects: any[];
  loading: boolean;
  activeDoc: any;
  setActiveDoc: (doc: any) => void;
  setIsMobileEditorOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  handleCreate: (type: "quick_note" | "rich_document") => void;
  handleDelete: (id: string, e: React.MouseEvent) => void;
  timezone: string;
  dateFormat: string;
}

export default function DocumentList({
  documents, projects, loading, activeDoc, setActiveDoc, setIsMobileEditorOpen,
  searchQuery, setSearchQuery, filterType, setFilterType, handleCreate, handleDelete, timezone, dateFormat
}: DocumentListProps) {
  const [folders, setFolders] = useState<Record<string, string>>({});
  const [folderFilter, setFolderFilter] = useState("all");

  useEffect(() => {
    try { setFolders(JSON.parse(localStorage.getItem(FOLDER_KEY) || "{}")); } catch { setFolders({}); }
  }, []);

  const saveFolders = (next: Record<string, string>) => {
    setFolders(next);
    localStorage.setItem(FOLDER_KEY, JSON.stringify(next));
  };

  const setFolder = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const name = window.prompt("Folder name. Leave empty to remove it.", folders[id] || "");
    if (name === null) return;
    const next = { ...folders };
    const clean = name.trim();
    if (!clean) delete next[id];
    else next[id] = clean;
    saveFolders(next);
  };

  const folderNames = Array.from(new Set(Object.values(folders))).sort();
  const filteredDocs = documents.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || (d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || d.document_type === filterType;
    const folder = folders[d.id];
    const matchesFolder = folderFilter === "all" || (folderFilter === "unfiled" ? !folder : folder === folderFilter);
    return matchesSearch && matchesType && matchesFolder;
  });

  return (
    <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-[#27344B] bg-[#111A2E] md:w-80">
      <div className="border-b border-[#27344B] p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="mb-4 flex h-10 w-full items-center justify-between rounded-md bg-klyvor-gradient px-4 font-semibold text-white outline-none transition-opacity hover:opacity-90">
            <span className="flex items-center gap-2"><Plus size={16} /> Create New</span><ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px] border-[#27344B] bg-[#111A2E] text-white">
            <DropdownMenuItem onClick={() => handleCreate("quick_note")} className="flex cursor-pointer flex-col items-start gap-1 p-3 hover:bg-[#0B1020]"><div className="flex items-center gap-2 text-sm font-semibold"><StickyNote size={16} className="text-[#F59E0B]" /> Quick Note</div><span className="pl-6 text-xs text-[#64748B]">Capture an idea quickly.</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate("rich_document")} className="flex cursor-pointer flex-col items-start gap-1 p-3 hover:bg-[#0B1020]"><div className="flex items-center gap-2 text-sm font-semibold"><FileEdit size={16} className="text-[#00D4FF]" /> Rich Document</div><span className="pl-6 text-xs text-[#64748B]">Structured writing.</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={14} /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 border-[#27344B] bg-[#0B1020] pl-9 text-sm text-white" /></div>
      </div>
      <div className="flex border-b border-[#27344B]">
        {["all", "quick_note", "rich_document"].map((type) => (
          <button key={type} onClick={() => setFilterType(type)} className={`flex-1 border-b-2 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${filterType === type ? "border-primary bg-[#0B1020]/50 text-primary" : "border-transparent text-[#64748B] hover:text-white"}`}>{type === "all" ? "All" : type === "quick_note" ? "Notes" : "Docs"}</button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto border-b border-[#27344B] px-3 py-2">
        {["all", "unfiled", ...folderNames].map((name) => (
          <button key={name} onClick={() => setFolderFilter(name)} className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${folderFilter === name ? "border-[#00D4FF] text-[#00D4FF]" : "border-[#27344B] text-[#64748B]"}`}>{name === "all" ? "All folders" : name === "unfiled" ? "Unfiled" : name}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? <div className="p-8 text-center text-sm text-[#64748B]">Loading...</div> : filteredDocs.length === 0 ? <div className="p-8 text-center text-sm text-[#64748B]">Your ideas start here.</div> : (
          <div className="flex flex-col">
            {filteredDocs.map((doc) => (
              <div key={doc.id} onClick={() => { setActiveDoc(doc); setIsMobileEditorOpen(true); }} className={`group cursor-pointer border-b border-[#27344B] p-4 transition-colors ${activeDoc?.id === doc.id ? "border-l-2 border-l-primary bg-[#0B1020]" : "border-l-2 border-l-transparent hover:bg-[#0B1020]/50"}`}>
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">{doc.document_type === "quick_note" ? <StickyNote size={14} className="shrink-0 text-[#F59E0B]" /> : <FileText size={14} className="shrink-0 text-[#00D4FF]" />}<h3 className={`truncate text-sm font-semibold ${activeDoc?.id === doc.id ? "text-primary" : "text-white"}`}>{doc.title || "Untitled"}</h3></div>
                  <DropdownMenu><DropdownMenuTrigger className="text-[#64748B] outline-none hover:text-white"><MoreHorizontal size={16} /></DropdownMenuTrigger><DropdownMenuContent align="end" className="border-[#27344B] bg-[#111A2E] text-white"><DropdownMenuItem onClick={(e) => setFolder(doc.id, e)} className="cursor-pointer"><Folder size={14} className="mr-2" /> Set folder</DropdownMenuItem><DropdownMenuItem onClick={(e) => handleDelete(doc.id, e)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                </div>
                <p className="mb-2 truncate text-xs text-[#64748B]">{doc.content || "Empty..."}</p>
                <div className="flex items-center justify-between"><p className="text-[10px] text-[#64748B]">Edited {formatDate(doc.updated_at, timezone, dateFormat)}</p><span className="flex items-center gap-1 text-[10px] text-[#7C5CFC]">{folders[doc.id] ? <><Folder size={10} /> {folders[doc.id]}</> : doc.project_id ? <><FolderKanban size={10} /> Project</> : null}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
