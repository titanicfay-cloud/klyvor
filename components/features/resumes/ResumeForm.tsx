"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ResumeData } from "@/lib/resume-types";

export default function ResumeForm({ data, setData }: { data: ResumeData, setData: (d: ResumeData) => void }) {
  const [openSection, setOpenSection] = useState("personal");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const updatePersonal = (field: string, value: string) => {
    setData({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const addExperience = () => {
    const newJob = { id: crypto.randomUUID(), company: "", role: "", dates: "", bullets: [""] };
    setData({ ...data, experience: [...(data.experience || []), newJob] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setData({
      ...data,
      experience: data.experience.map(job => job.id === id ? { ...job, [field]: value } : job)
    });
  };

  const addBullet = (jobId: string) => {
    setData({
      ...data,
      experience: data.experience.map(job => job.id === jobId ? { ...job, bullets: [...job.bullets, ""] } : job)
    });
  };

  const updateBullet = (jobId: string, index: number, value: string) => {
    setData({
      ...data,
      experience: data.experience.map(job => job.id === jobId ? { ...job, bullets: job.bullets.map((b, i) => i === index ? value : b) } : job)
    });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter(job => job.id !== id) });
  };

  const addEducation = () => {
    const newEdu = { id: crypto.randomUUID(), school: "", degree: "", dates: "" };
    setData({ ...data, education: [...(data.education || []), newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setData({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const SectionHeader = ({ title, id }: { title: string, id: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex justify-between items-center py-4 border-b border-[#27344B] text-white font-bold text-lg hover:text-primary transition-colors">
      {title}
      {openSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  return (
    <div className="space-y-2 pb-20">
      {/* PERSONAL INFO */}
      <SectionHeader title="Personal Details" id="personal" />
      {openSection === "personal" && (
        <div className="py-4 space-y-4 animate-in fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={data.personal?.fullName || ""} onChange={e => updatePersonal("fullName", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={data.personal?.email || ""} onChange={e => updatePersonal("email", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={data.personal?.phone || ""} onChange={e => updatePersonal("phone", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={data.personal?.location || ""} onChange={e => updatePersonal("location", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
          </div>
          <div className="space-y-2"><Label>Website / LinkedIn</Label><Input value={data.personal?.website || ""} onChange={e => updatePersonal("website", e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
        </div>
      )}

      {/* SUMMARY */}
      <SectionHeader title="Headline & Summary" id="summary" />
      {openSection === "summary" && (
        <div className="py-4 space-y-4 animate-in fade-in">
          <div className="space-y-2"><Label>Professional Headline</Label><Input placeholder="e.g. Senior Product Designer" value={data.headline || ""} onChange={e => setData({ ...data, headline: e.target.value })} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
          <div className="space-y-2"><Label>Professional Summary</Label><Textarea value={data.summary || ""} onChange={e => setData({ ...data, summary: e.target.value })} className="bg-[#0B1020] border-[#27344B] text-white resize-none h-24" /></div>
        </div>
      )}

      {/* EXPERIENCE */}
      <SectionHeader title="Work Experience" id="experience" />
      {openSection === "experience" && (
        <div className="py-4 space-y-6 animate-in fade-in">
          {(data.experience || []).map((job, index) => (
            <div key={job.id} className="p-4 border border-[#27344B] rounded-xl bg-[#0B1020]/50 relative">
              <button onClick={() => removeExperience(job.id)} className="absolute top-4 right-4 text-[#64748B] hover:text-[#EF4444]"><Trash2 size={16}/></button>
              <h4 className="text-white font-medium mb-3">Job {index + 1}</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2"><Label>Job Title</Label><Input value={job.role} onChange={e => updateExperience(job.id, "role", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
                <div className="space-y-2"><Label>Company</Label><Input value={job.company} onChange={e => updateExperience(job.id, "company", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
              </div>
              <div className="space-y-2 mb-4"><Label>Dates (e.g. Jan 2020 - Present)</Label><Input value={job.dates} onChange={e => updateExperience(job.id, "dates", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
              
              <Label>Achievements</Label>
              {job.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <Input value={bullet} onChange={e => updateBullet(job.id, i, e.target.value)} placeholder="Achieved X by doing Y..." className="bg-[#111A2E] border-[#27344B] text-white" />
                </div>
              ))}
              <Button onClick={() => addBullet(job.id)} variant="ghost" className="text-primary text-xs mt-2 h-8"><Plus size={14} className="mr-1"/> Add Bullet</Button>
            </div>
          ))}
          <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-[#27344B] text-[#C7D0E0] hover:text-white"><Plus size={16} className="mr-2"/> Add Experience</Button>
        </div>
      )}

      {/* EDUCATION */}
      <SectionHeader title="Education" id="education" />
      {openSection === "education" && (
        <div className="py-4 space-y-6 animate-in fade-in">
          {(data.education || []).map((edu, index) => (
            <div key={edu.id} className="p-4 border border-[#27344B] rounded-xl bg-[#0B1020]/50 relative">
              <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-[#64748B] hover:text-[#EF4444]"><Trash2 size={16}/></button>
              <h4 className="text-white font-medium mb-3">Education {index + 1}</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2"><Label>Degree</Label><Input value={edu.degree} onChange={e => updateEducation(edu.id, "degree", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
                <div className="space-y-2"><Label>School / University</Label><Input value={edu.school} onChange={e => updateEducation(edu.id, "school", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
              </div>
              <div className="space-y-2"><Label>Dates (e.g. 2015 - 2019)</Label><Input value={edu.dates} onChange={e => updateEducation(edu.id, "dates", e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
            </div>
          ))}
          <Button onClick={addEducation} variant="outline" className="w-full border-dashed border-[#27344B] text-[#C7D0E0] hover:text-white"><Plus size={16} className="mr-2"/> Add Education</Button>
        </div>
      )}

      {/* SKILLS */}
      <SectionHeader title="Skills" id="skills" />
      {openSection === "skills" && (
        <div className="py-4 space-y-4 animate-in fade-in">
          <div className="space-y-2">
            <Label>Skills (Comma separated)</Label>
            <Textarea 
              placeholder="e.g. React, Node.js, Project Management, Figma"
              value={(data.skills || []).join(", ")} 
              onChange={e => setData({ ...data, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "") })} 
              className="bg-[#0B1020] border-[#27344B] text-white resize-none h-24" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
