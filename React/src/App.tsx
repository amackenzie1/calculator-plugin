import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Calculator from "@/components/Calculator";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Calculator />
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
