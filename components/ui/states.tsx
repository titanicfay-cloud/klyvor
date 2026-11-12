export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#C7D0E0]">
      <div className="h-8 w-8 rounded-full border-2 border-[#27344B] border-t-[#00D4FF] animate-spin mb-4" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function PageEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="col-span-full border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
      <h3 className="text-white font-medium mb-2">{title}</h3>
      {description ? <p className="text-sm text-[#64748B]">{description}</p> : null}
    </div>
  );
}
