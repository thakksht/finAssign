import { Dashboard } from "@/components/dashboard";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Dashboard />
      </div>
    </div>
  );
}
