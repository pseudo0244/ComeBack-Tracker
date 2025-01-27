import type { JournalEntry } from "../app/types/journal"

export const saveJournalEntry = (entry: JournalEntry) => {
  const entries = loadJournalEntries()
  const existingEntryIndex = entries.findIndex((e) => e.date === entry.date)

  if (existingEntryIndex !== -1) {
    entries[existingEntryIndex] = entry
  } else {
    entries.push(entry)
  }

  localStorage.setItem("journalEntries", JSON.stringify(entries))
}

export const loadJournalEntries = (): JournalEntry[] => {
  const entries = localStorage.getItem("journalEntries")
  return entries ? JSON.parse(entries) : []
}

export const getTodayEntry = (): JournalEntry | undefined => {
  const today = new Date().toISOString().split("T")[0]
  return loadJournalEntries().find((entry) => entry.date === today)
}

export const clearAllJournalEntries = () => {
  localStorage.removeItem("journalEntries")
}

export const deleteJournalEntry = (date: string) => {
  const entries = loadJournalEntries()
  const filteredEntries = entries.filter((entry) => entry.date !== date)
  localStorage.setItem("journalEntries", JSON.stringify(filteredEntries))
}

