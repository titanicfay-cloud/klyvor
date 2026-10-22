export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B1020] p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl text-white font-bold mb-4">Welcome to your Workspace</h1>
      <p className="text-muted-foreground mb-8">You are securely logged in.</p>
      <a href="/login" className="bg-klyvor-gradient text-white px-6 py-3 rounded-full font-semibold">Sign Out (Temporary)</a>
    </div>
  );
}
