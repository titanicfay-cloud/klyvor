import { ResumeData } from "@/lib/resume-types";

export default function TemplateModern({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto shadow-lg print:shadow-none print:w-full print:p-0">
      {/* Header */}
      <div className="mb-8 border-b-4 border-[#0B1020] pb-4">
        <h1 className="text-4xl font-extrabold text-[#0B1020] mb-1">{data.personal?.fullName || "Your Name"}</h1>
        <h2 className="text-xl text-[#00D4FF] font-semibold mb-3">{data.headline || "Professional Headline"}</h2>
        <div className="text-sm text-gray-600 flex flex-wrap gap-4">
          {data.personal?.email && <span>{data.personal.email}</span>}
          {data.personal?.phone && <span>{data.personal.phone}</span>}
          {data.personal?.location && <span>{data.personal.location}</span>}
          {data.personal?.website && <span className="text-[#7C5CFC]">{data.personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0B1020] mb-4 tracking-widest uppercase">Experience</h2>
          <div className="space-y-6 border-l-2 border-[#00D4FF] pl-4">
            {data.experience.map(job => (
              <div key={job.id} className="break-inside-avoid relative">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-[#00D4FF] rounded-full"></div>
                <div className="flex justify-between font-bold text-base text-[#0B1020]">
                  <span>{job.role}</span>
                  <span className="text-gray-500 text-sm font-normal">{job.dates}</span>
                </div>
                <div className="text-sm text-[#7C5CFC] font-medium mb-2">{job.company}</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {job.bullets.filter(b => b.trim() !== "").map((bullet, i) => <li key={i}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Education */}
        {data.education?.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-lg font-bold text-[#0B1020] mb-3 tracking-widest uppercase">Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id} className="text-sm break-inside-avoid">
                  <div className="font-bold text-[#0B1020]">{edu.degree}</div>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-500 text-xs">{edu.dates}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-lg font-bold text-[#0B1020] mb-3 tracking-widest uppercase">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
