import { Button } from "@/components/ui/button";
import { ContributionManager } from "./components/ContributionManager";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HJ&apos;s Comeback Tracker🔥</h1>
          <Button asChild>
            <a href="/journal">Journal</a>
          </Button>
        </div>
        <ContributionManager />
      </div>
    </main>
  );
}
