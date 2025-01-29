import { Button } from "@/components/ui/button";
import { ContributionManager } from "./components/ContributionManager";
import TodoList from "./components/TodoList"; // Import the TodoList component

export const runtime = "edge";

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">2025 Comeback Tracker🔥</h1>
          <Button asChild>
            <a href="/journal">Journal</a>
          </Button>
        </div>
        <p className="text-gray-600 text-xl mt-4">
          Built by{" "}
          <a href="https://www.hopp.bio/harshithj" className="text-blue-500 hover:underline">
            Harshith J
          </a>{" "}
          ❤️
        </p>
        <ContributionManager />
        <TodoList /> {/* Add TodoList component here */}
      </div>
    </main>
  );
}
