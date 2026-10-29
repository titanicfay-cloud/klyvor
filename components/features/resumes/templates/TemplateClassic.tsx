import { ResumeData } from "@/lib/resume-types";

export default function TemplateClassic({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-10 font-serif min-h-[297mm] w-full max-w-[210mm] mx-auto shadow-lg print:shadow-none print:w-full print:p-0">
      {/* Header */}
      <div className="text-center mb-8 border-b border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">{data.personal?.fullName || "Your Name"}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-2">
          {data.personal?.email && <span>{data.personal.email}</span>}
          {data.personal?.phone && <span>| {data.personal.phone}</span>}
          {data.personal?.location && <span>| {data.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-2 text-center">Objective</h2>
          <p className="text-sm leading-relaxed text-center italic">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map(job => (
              <div key={job.id} className="break-inside-avoid">
                <div className="flex justify-between font-bold text-sm">
                  <span>{job.company}</span>
                  <span>{job.dates}</span>
                </div>
                <div className="text-sm italic mb-1">{job.role}</div>
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
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Education</h2>
          <div className="space-y-2">
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between text-sm break-inside-avoid">
                <div><span className="font-bold">{edu.school}</span> - {edu.degree}</div>
                <span>{edu.dates}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Skills</h2>
          <p className="text-sm">{data.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
