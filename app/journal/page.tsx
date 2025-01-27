import { JournalForm } from "../components/JournalForm"

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Daily Journal</h1>
        <JournalForm />
      </div>
    </main>
  )
}

