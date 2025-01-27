export function getDaysArray(year: number, month?: number): Date[] {
  const arr = []
  const startDate = month !== undefined ? new Date(year, month, 1) : new Date(year, 0, 1)
  const endDate = month !== undefined ? new Date(year, month + 1, 0) : new Date(year, 11, 31)

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    arr.push(new Date(d))
  }
  return arr
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function getMonthName(month: number): string {
  return new Date(0, month).toLocaleString("default", { month: "long" })
}

