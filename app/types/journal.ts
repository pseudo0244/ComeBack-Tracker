export interface HabitCategory {
    name: string
    habits: {
      id: number
      text: string
      completed: boolean
    }[]
  }
  
  export interface JournalEntry {
    date: string
    categories: {
      spiritual: HabitCategory
      mental: HabitCategory
      physical: HabitCategory
      emotional: HabitCategory
      economical: HabitCategory
      general: HabitCategory
    }
    thankfulFor: string[]
    proudOf: string[]
    totalScore: number
  }
  
  