import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Calculator from "@/components/Calculator";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Use It Wisely</h1>
            <div className="flex items-center gap-2">
              {/* You could add theme toggle, help button, etc. here */}
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Calculator />
        </main>
        <footer className="mt-16 border-t py-8 bg-card/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Use It Wisely - Financial Planning Tool</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
