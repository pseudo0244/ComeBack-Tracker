"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  saveJournalEntry,
  getTodayEntry,
  clearAllJournalEntries,
  deleteJournalEntry,
} from "@/utils/journalStorage";
import { Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export interface HabitCategory {
  name: string;
  habits: { id: number; text: string; completed: boolean }[];
}

export type Categories = {
  spiritual: HabitCategory;
  mental: HabitCategory;
  physical: HabitCategory;
  emotional: HabitCategory;
  economical: HabitCategory;
  general: HabitCategory;
};

export interface JournalEntry {
  date: string;
  categories: Categories;
  thankfulFor: string[];
  proudOf: string[];
  totalScore: number;
}

const initialCategories: Categories = {
  spiritual: {
    name: "Spiritual",
    habits: [
      { id: 1, text: "", completed: false },
      { id: 2, text: "", completed: false },
    ],
  },
  mental: {
    name: "Mental",
    habits: [
      { id: 3, text: "", completed: false },
      { id: 4, text: "", completed: false },
    ],
  },
  physical: {
    name: "Physical",
    habits: [
      { id: 5, text: "", completed: false },
      { id: 6, text: "", completed: false },
    ],
  },
  emotional: {
    name: "Emotional",
    habits: [
      { id: 7, text: "", completed: false },
      { id: 8, text: "", completed: false },
    ],
  },
  economical: {
    name: "Economical",
    habits: [
      { id: 9, text: "", completed: false },
      { id: 10, text: "", completed: false },
    ],
  },
  general: {
    name: "General",
    habits: [
      { id: 11, text: "", completed: false },
      { id: 12, text: "", completed: false },
    ],
  },
};

export function JournalForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [thankfulFor, setThankfulFor] = useState<string[]>(["", ""]);
  const [proudOf, setProudOf] = useState<string[]>(["", ""]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  useEffect(() => {
    const todayEntry = getTodayEntry();
    if (todayEntry) {
      setCategories(todayEntry.categories);
      setThankfulFor(todayEntry.thankfulFor);
      setProudOf(todayEntry.proudOf);
    }
  }, []);

  const calculateCategoryScore = (category: HabitCategory) => {
    return category.habits.filter((habit) => habit.completed).length;
  };

  const calculateTotalScore = useCallback(() => {
    return Object.values(categories).reduce((total, category) => {
      return total + calculateCategoryScore(category);
    }, 0);
  }, [categories]);

  const toggleHabit = (categoryKey: keyof Categories, habitId: number) => {
    setCategories((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        habits: prev[categoryKey].habits.map((habit) =>
          habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
        ),
      },
    }));
  };

  const updateHabitText = (categoryKey: keyof Categories, habitId: number, text: string) => {
    setCategories((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        habits: prev[categoryKey].habits.map((habit) =>
          habit.id === habitId ? { ...habit, text } : habit
        ),
      },
    }));
  };

  const handleSave = useCallback(() => {
    const entry: JournalEntry = {
      date: new Date().toISOString().split("T")[0],
      categories,
      thankfulFor,
      proudOf,
      totalScore: calculateTotalScore(),
    };
    saveJournalEntry(entry);
    router.push("/");
  }, [categories, thankfulFor, proudOf, calculateTotalScore, router]);

  const handleDeleteEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    deleteJournalEntry(today);
    router.push("/");
  };

  const handleDeleteAllEntries = () => {
    clearAllJournalEntries();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Today&apos;s Entry
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteAllDialog(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete All Entries
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Good Habits/Activities to Maintain:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="space-y-4">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <div className="space-y-2">
                  {category.habits.map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`habit-${habit.id}`}
                        checked={habit.completed}
                        onCheckedChange={() => toggleHabit(key as keyof Categories, habit.id)}
                      />
                      <Input
                        value={habit.text}
                        onChange={(e) =>
                          updateHabitText(key as keyof Categories, habit.id, e.target.value)
                        }
                        placeholder={`Enter ${category.name.toLowerCase()} habit`}
                        className="flex-grow"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Score: {calculateCategoryScore(category)}/2
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Today I&apos;m thankful for:</h3>
              {thankfulFor.map((item, index) => (
                <Textarea
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newThankful = [...thankfulFor];
                    newThankful[index] = e.target.value;
                    setThankfulFor(newThankful);
                  }}
                  placeholder={`Thankful item ${index + 1}`}
                  className="h-20"
                />
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Today I&apos;m proud of:</h3>
              {proudOf.map((item, index) => (
                <Textarea
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newProud = [...proudOf];
                    newProud[index] = e.target.value;
                    setProudOf(newProud);
                  }}
                  placeholder={`Proud item ${index + 1}`}
                  className="h-20"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              Total score for today: {calculateTotalScore()}/12
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Journal</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteEntry}
        title="Delete Today&apos;s Entry"
        description="Are you sure you want to delete today&apos;s journal entry? This action cannot be undone."
      />

      <DeleteConfirmDialog
        isOpen={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleDeleteAllEntries}
        title="Delete All Entries"
        description="Are you sure you want to delete all journal entries? This action cannot be undone."
      />
    </div>
  );
}
