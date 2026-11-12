"use client";
import { PageLoading } from "@/components/ui/states";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Plus, Printer, Save, ArrowLeft, Trash2, Loader2, Eye, Edit } from "lucide-react";
import ResumeForm from "@/components/features/resumes/ResumeForm";
import ResumePreview from "@/components/features/resumes/ResumePreview";
import { saveResumeAction, deleteResumeAction } from "@/app/actions/resumes";
import { ResumeData } from "@/lib/resume-types";
import { cn } from "@/lib/utils";

const emptyResume: ResumeData = {
  personal: { fullName: "", email: "", phone: "", location: "", website: "" },
  headline: "",
  summary: "",
  experience: [],
  education: [],
  skills: []
};

export default function ResumesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any>(null);
  
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("ats");
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: resData } = await supabase.from("resumes").select("*").order("created_at", { ascending: false });
    setResumes(resData || []);
    setLoading(false);
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleCreateNew = () => {
    setActiveResume({ isNew: true });
    setTitle("My Resume");
    setTemplate("ats");
    setData(emptyResume);
    setIsMobilePreviewOpen(false);
  };

  const handleOpen = (resume: any) => {
    setActiveResume(resume);
    setTitle(resume.title);
    setTemplate(resume.template);
    setData(resume.content_json || emptyResume);
    setIsMobilePreviewOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = { id: activeResume?.isNew ? null : activeResume?.id, title, template, content_json: data };
    const res = await saveResumeAction(payload);
    if (res.error) toast.error(res.error);
    else { 
      toast.success("Resume saved."); 
      setActiveResume({ ...activeResume, id: res.id, isNew: false }); 
      fetchResumes(); 
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this resume permanently?")) return;
    const res = await deleteResumeAction(id);
    if (res.error) toast.error(res.error);
    else { toast.success("Deleted."); fetchResumes(); }
  };

  const handlePrint = () => { window.print(); };

  if (loading) return <PageLoading />;

  if (!activeResume) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Professional</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">CV & Resume Builder</h1>
            <p className="text-[#C7D0E0]">Create ATS-friendly resumes to land your next role.</p>
          </div>
          <Button onClick={handleCreateNew} className="bg-klyvor-gradient text-white h-11"><Plus size={18} className="mr-2"/> New Resume</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.length === 0 ? (
            <div className="col-span-full border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
              <FileText className="w-10 h-10 text-[#64748B] mx-auto mb-4" />
              <h3 className="text-white font-medium">No resumes yet.</h3>
            </div>
          ) : resumes.map(r => (
            <div key={r.id} onClick={() => handleOpen(r)} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 cursor-pointer transition-all group flex flex-col h-full relative">
              <button onClick={(e) => handleDelete(r.id, e)} className="absolute top-4 right-4 text-[#64748B] hover:text-[#EF4444]"><Trash2 size={16}/></button>
              <div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center mb-4"><FileText size={20} className="text-primary"/></div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary">{r.title}</h3>
              <p className="text-xs text-[#64748B] uppercase tracking-wider mt-auto pt-4">{r.template} Template</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 relative">
      
      {/* DESKTOP TOOLBAR (Hidden on mobile) */}
      <div className="hidden lg:flex h-16 border-b border-[#27344B] items-center justify-between px-6 bg-[#111A2E]/50 shrink-0 no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setActiveResume(null)} className="text-[#C7D0E0] hover:text-white"><ArrowLeft size={20} /></Button>
          <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-none text-white font-bold text-lg w-[250px] focus-visible:ring-0 px-0" />
        </div>
        <div className="flex items-center gap-3">
          <Select value={template} onValueChange={(val) => setTemplate(val as string)}>
            <SelectTrigger className="w-[150px] bg-[#0B1020] border-[#27344B] text-white h-9">
              <SelectValue placeholder="Template">
                {template === 'ats' ? 'ATS Minimal' : template === 'modern' ? 'Modern Pro' : 'Classic Serif'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="ats">ATS Minimal</SelectItem>
              <SelectItem value="modern">Modern Pro</SelectItem>
              <SelectItem value="classic">Classic Serif</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePrint} variant="outline" className="border-[#27344B] text-white h-9"><Printer size={16} className="mr-2"/> Export PDF</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-klyvor-gradient text-white h-9">{isSaving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} className="mr-2"/> Save</>}</Button>
        </div>
      </div>

      {/* MOBILE TOP BAR (Hidden on desktop) */}
      <div className="lg:hidden flex flex-col bg-[#111A2E]/50 border-b border-[#27344B] shrink-0 no-print">
        {/* Row 1: Back & Title */}
        <div className="flex items-center gap-2 p-2">
          <Button variant="ghost" onClick={() => setActiveResume(null)} className="text-[#C7D0E0] hover:text-white shrink-0 h-8 w-8 p-0"><ArrowLeft size={20} /></Button>
          <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-none text-white font-bold text-base focus-visible:ring-0 px-0 h-8" />
        </div>
        {/* Row 2: Toggle & Template */}
        <div className="flex items-center gap-2 px-2 pb-2">
          <Button onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)} variant="outline" className="flex-1 border-[#27344B] text-white h-9 px-2 text-xs">
            {isMobilePreviewOpen ? <><Edit size={14} className="mr-1"/> Edit Form</> : <><Eye size={14} className="mr-1"/> Preview</>}
          </Button>
          <Select value={template} onValueChange={(val) => setTemplate(val as string)}>
            <SelectTrigger className="flex-1 bg-[#0B1020] border-[#27344B] text-white h-9 text-xs">
              <SelectValue placeholder="Template">
                {template === 'ats' ? 'ATS Minimal' : template === 'modern' ? 'Modern Pro' : 'Classic Serif'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="ats">ATS Minimal</SelectItem>
              <SelectItem value="modern">Modern Pro</SelectItem>
              <SelectItem value="classic">Classic Serif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MAIN CONTENT (Form & Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0B1020] pb-16 lg:pb-0">
        <div className={cn("w-full lg:w-1/3 overflow-y-auto p-4 sm:p-6 border-r border-[#27344B] no-print", isMobilePreviewOpen && "hidden lg:block")}>
          <ResumeForm data={data} setData={setData} />
        </div>

        <div className={cn("flex-1 overflow-y-auto p-2 sm:p-8 bg-[#1e293b] justify-center", isMobilePreviewOpen ? "flex" : "hidden lg:flex")}>
          <div className="resume-print-area w-full flex justify-center">
             <ResumePreview data={data} template={template} />
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM STICKY BAR (Export & Save) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#111A2E] border-t border-[#27344B] flex gap-2 z-50 no-print">
        <Button onClick={handlePrint} variant="outline" className="flex-1 border-[#27344B] text-white h-11">
          <Printer size={18} className="mr-2"/> Export PDF
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-klyvor-gradient text-white h-11">
          {isSaving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} className="mr-2"/> Save</>}
        </Button>
      </div>

    </div>
  );
}
