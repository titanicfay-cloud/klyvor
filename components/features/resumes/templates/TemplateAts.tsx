import { ResumeData } from "@/lib/resume-types";

export default function TemplateAts({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto shadow-lg print:shadow-none print:w-full print:p-0">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">{data.personal?.fullName || "Your Name"}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-2">
          {data.personal?.email && <span>{data.personal.email}</span>}
          {data.personal?.phone && <span>• {data.personal.phone}</span>}
          {data.personal?.location && <span>• {data.personal.location}</span>}
          {data.personal?.website && <span>• {data.personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-2 uppercase">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3 uppercase">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map(job => (
              <div key={job.id} className="break-inside-avoid">
                <div className="flex justify-between font-bold text-sm">
                  <span>{job.role}</span>
                  <span>{job.dates}</span>
                </div>
                <div className="text-sm italic mb-1">{job.company}</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {job.bullets.filter(b => b.trim() !== "").map((bullet, i) => <li key={i}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3 uppercase">Education</h2>
          <div className="space-y-2">
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between text-sm break-inside-avoid">
                <div><span className="font-bold">{edu.degree}</span>, {edu.school}</div>
                <span>{edu.dates}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3 uppercase">Skills</h2>
          <p className="text-sm">{data.skills.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}
