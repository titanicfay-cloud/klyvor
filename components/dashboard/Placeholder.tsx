export default function Placeholder({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-[#C7D0E0] mb-8">{description}</p>
      <div className="border border-dashed border-[#27344B] rounded-2xl p-12 text-center bg-[#0B1020]">
        <p className="text-[#64748B]">This tool is currently under construction for V1.1.</p>
      </div>
    </div>
  );
}
