export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  headline: string;
  summary: string;
  experience: Array<{ id: string; company: string; role: string; dates: string; bullets: string[] }>;
  education: Array<{ id: string; school: string; degree: string; dates: string }>;
  skills: string[];
}
