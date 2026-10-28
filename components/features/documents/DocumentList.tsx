"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, FileText, MoreHorizontal, Trash2, StickyNote, FolderKanban, ChevronDown, FileEdit } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || (d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || d.document_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full md:w-80 flex-col bg-[#111A2E] border border-[#27344B] rounded-xl overflow-hidden shrink-0 flex">
      <div className="p-4 border-b border-[#27344B]">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-10 mb-4 flex items-center justify-between px-4 rounded-md outline-none transition-opacity">
            <span className="flex items-center gap-2"><Plus size={16} /> Create New</span><ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px] bg-[#111A2E] border-[#27344B] text-white">
            <DropdownMenuItem onClick={() => handleCreate("quick_note")} className="cursor-pointer p-3 hover:bg-[#0B1020] flex flex-col items-start gap-1"><div className="flex items-center gap-2 font-semibold text-sm"><StickyNote size={16} className="text-[#F59E0B]"/> Quick Note</div><span className="text-xs text-[#64748B] pl-6">Capture an idea quickly.</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate("rich_document")} className="cursor-pointer p-3 hover:bg-[#0B1020] flex flex-col items-start gap-1"><div className="flex items-center gap-2 font-semibold text-sm"><FileEdit size={16} className="text-[#00D4FF]"/> Rich Document</div><span className="text-xs text-[#64748B] pl-6">Structured writing.</span></DropdownMenuItem>
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
  );
}
