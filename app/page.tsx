import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        <h1 className="text-6xl font-bold tracking-tight">
          Welcome to <span className="text-klyvor-gradient">KLYVOR</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Beyond What's Possible. Your new Professional Operating Platform.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button className="bg-klyvor-gradient text-white px-8 py-3 rounded-md font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            Get Started <ArrowRight size={18} />
          </button>
          
          <button className="border border-border bg-card text-foreground px-8 py-3 rounded-md font-semibold hover:bg-muted transition-colors">
            View Directory
          </button>
        </div>

        <div className="mt-12 p-6 bg-card border border-border rounded-xl shadow-lg text-left">
          <h2 className="text-xl font-semibold text-primary mb-2">Test Panel</h2>
          <p className="text-muted-foreground text-sm">
            If you can read this clearly, our Midnight Navy background, Navy surface card, and Cool Silver text are working perfectly.
          </p>
          <div className="mt-4 flex gap-2 text-xs font-medium">
            <span className="bg-success/20 text-success px-2 py-1 rounded">Success State</span>
            <span className="bg-destructive/20 text-destructive px-2 py-1 rounded">Error State</span>
            <span className="bg-warning/20 text-warning px-2 py-1 rounded">Warning State</span>
          </div>
        </div>

      </div>
    </main>
  );
}
