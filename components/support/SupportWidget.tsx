"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  MessageCircle, X, LifeBuoy, CheckCircle2, Loader2, 
  ArrowLeft, ShieldAlert, FileText, CheckSquare, Calculator, User
} from "lucide-react";

type ViewState = "menu" | "form" | "success";

export default function SupportWidget() {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("menu");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pre-fill user data
  useEffect(() => {
    if (isOpen && view === "form" && !name) {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          setName(user.user_metadata?.full_name || "");
        }
      };
      fetchUser();
    }
  }, [isOpen, view, name, supabase]);

  const handleOpenForm = (prefilledTopic: string) => {
    setTopic(prefilledTopic);
    setView("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !topic || !subject || !message) return toast.error("Please fill in all fields.");

    setIsSubmitting(true);
    
    const { error } = await supabase.from("support_requests").insert([{
      name,
      email,
      topic,
      subject,
      message
    }]);

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      setView("success");
      setSubject("");
      setMessage("");
    }
    setIsSubmitting(false);
  };

  const resetWidget = () => {
    setIsOpen(false);
    setTimeout(() => {
      setView("menu");
      setTopic("");
    }, 300);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* FLOATING PANEL */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#0B1020] border border-[#27344B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-[#111A2E] border-b border-[#27344B] p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-klyvor-gradient flex items-center justify-center">
                <LifeBuoy size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">KLYVOR Support</h3>
                <p className="text-[#64748B] text-xs">We're here to help you move forward.</p>
              </div>
            </div>
            <button onClick={resetWidget} className="text-[#64748B] hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            
            {view === "menu" && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h4 className="text-white font-medium mb-1">Hi there! 👋</h4>
                  <p className="text-[#C7D0E0] text-sm leading-relaxed">How can we help you today? Find a quick answer or send us a message.</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => handleOpenForm("Account & Login")} className="flex items-center gap-3 p-3 bg-[#111A2E] border border-[#27344B] rounded-lg hover:border-primary/50 transition-colors text-left group">
                    <User size={16} className="text-[#64748B] group-hover:text-primary" />
                    <span className="text-sm text-[#C7D0E0] group-hover:text-white">Account & Login</span>
                  </button>
                  <button onClick={() => handleOpenForm("Tasks & Productivity")} className="flex items-center gap-3 p-3 bg-[#111A2E] border border-[#27344B] rounded-lg hover:border-primary/50 transition-colors text-left group">
                    <CheckSquare size={16} className="text-[#64748B] group-hover:text-primary" />
                    <span className="text-sm text-[#C7D0E0] group-hover:text-white">Tasks & Productivity</span>
                  </button>
                  <button onClick={() => handleOpenForm("Documents & Notes")} className="flex items-center gap-3 p-3 bg-[#111A2E] border border-[#27344B] rounded-lg hover:border-primary/50 transition-colors text-left group">
                    <FileText size={16} className="text-[#64748B] group-hover:text-primary" />
                    <span className="text-sm text-[#C7D0E0] group-hover:text-white">Documents & Notes</span>
                  </button>
                  <button onClick={() => handleOpenForm("Pricing Calculator")} className="flex items-center gap-3 p-3 bg-[#111A2E] border border-[#27344B] rounded-lg hover:border-primary/50 transition-colors text-left group">
                    <Calculator size={16} className="text-[#64748B] group-hover:text-primary" />
                    <span className="text-sm text-[#C7D0E0] group-hover:text-white">Pricing Calculator</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#27344B]">
                  <Button onClick={() => handleOpenForm("Other")} className="w-full bg-klyvor-gradient text-white hover:opacity-90">
                    Contact Support
                  </Button>
                </div>
              </div>
            )}

            {view === "form" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setView("menu")} className="text-xs text-[#64748B] hover:text-white flex items-center gap-1 mb-4 transition-colors">
                  <ArrowLeft size={12} /> Back to topics
                </button>
                <h4 className="text-white font-semibold mb-4">Send us a message</h4>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#C7D0E0]">Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white h-9 text-sm focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#C7D0E0]">Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white h-9 text-sm focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#C7D0E0]">Topic</Label>
                    <Select value={topic} onValueChange={(val) => setTopic(val as string)} required>
                      <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white h-9 text-sm">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                        <SelectItem value="Account & Login">Account & Login</SelectItem>
                        <SelectItem value="Technical Problem">Technical Problem</SelectItem>
                        <SelectItem value="Tasks & Productivity">Tasks & Productivity</SelectItem>
                        <SelectItem value="Documents & Notes">Documents & Notes</SelectItem>
                        <SelectItem value="Pricing Calculator">Pricing Calculator</SelectItem>
                        <SelectItem value="Privacy & Data Request">Privacy & Data Request</SelectItem>
                        <SelectItem value="Feedback & Suggestions">Feedback & Suggestions</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#C7D0E0]">Subject</Label>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white h-9 text-sm focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#C7D0E0]">Message</Label>
                    <Textarea value={message} onChange={e => setMessage(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white text-sm focus-visible:ring-primary resize-none h-24" />
                  </div>
                  
                  <div className="flex items-start gap-2 bg-[#EF4444]/10 p-2 rounded border border-[#EF4444]/20">
                    <ShieldAlert size={14} className="text-[#EF4444] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#EF4444] leading-tight">Please never include your password or authentication codes in support messages.</p>
                  </div>

                  <Button type="submit" disabled={isSubmitting || !topic} className="w-full bg-klyvor-gradient text-white h-9 text-sm">
                    {isSubmitting ? <><Loader2 size={14} className="mr-2 animate-spin" /> Sending...</> : "Send Request"}
                  </Button>
                </form>
              </div>
            )}

            {view === "success" && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h4 className="text-white font-bold mb-2">Message Sent</h4>
                <p className="text-[#C7D0E0] text-sm mb-6">We have received your request and will get back to you as soon as possible.</p>
                <Button onClick={resetWidget} variant="outline" className="border-[#27344B] text-white">Close</Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-klyvor-gradient shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white group-hover:animate-pulse" />
        )}
      </button>
    </div>
  );
}
