"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle, Type } from "lucide-react";
import TiptapEditor from "@/components/dashboard/TiptapEditor";
import DocumentAttachments from "@/components/dashboard/DocumentAttachments";

interface DocumentEditorProps {
  activeDoc: any;
  setActiveDoc: (doc: any) => void;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  projects: any[];
  handleLinkProject: (id: string) => void;
  handleRichDocChange: (html: string, text: string) => void;
  handleQuickNoteChange: (text: string) => void;
  wordCount: number;
  charCount: number;
  isMobileEditorOpen: boolean;
  setIsMobileEditorOpen: (v: boolean) => void;
  triggerAutosave: (doc: any) => void;
}

export default function DocumentEditor({
  activeDoc, setActiveDoc, saveStatus, projects, handleLinkProject, handleRichDocChange, handleQuickNoteChange, wordCount, charCount, isMobileEditorOpen, setIsMobileEditorOpen, triggerAutosave
}: DocumentEditorProps) {
  if (!activeDoc) {
    return (
      <div className="flex-1 flex-col bg-[#0B1020] border border-[#27344B] rounded-xl overflow-hidden relative flex items-center justify-center p-8 text-center">
        <Type className="w-16 h-16 text-[#27344B] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your workspace is ready.</h2>
        <p className="text-[#64748B] mb-8 max-w-sm">Select a document or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex-col bg-[#0B1020] border border-[#27344B] rounded-xl overflow-hidden relative ${!isMobileEditorOpen ? 'hidden md:flex' : 'flex'}`}>
      <div className="h-16 border-b border-[#27344B] flex items-center justify-between px-4 sm:px-6 bg-[#111A2E]/50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileEditorOpen(false)} className="md:hidden text-[#C7D0E0]"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {saveStatus === "saved" && <><CheckCircle2 size={14} className="text-success" /><span className="text-[#64748B]">Saved</span></>}
            {saveStatus === "saving" && <><Loader2 size={14} className="text-primary animate-spin" /><span className="text-primary">Saving...</span></>}
            {saveStatus === "unsaved" && <><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><span className="text-[#F59E0B]">Unsaved</span></>}
            {saveStatus === "error" && <><AlertCircle size={14} className="text-[#EF4444]" /><span className="text-[#EF4444]">Error</span></>}
          </div>
        </div>
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
    </div>
  );
}
