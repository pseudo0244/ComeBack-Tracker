import type React from "react"
import type { ContributionDay } from "../types/contribution"
import { getDaysArray, getWeekNumber, getMonthName } from "@/utils/dateUtils"

interface ContributionGraphProps {
  contributions: ContributionDay[]
  color: string
  year: number
  month?: number
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ contributions, color, year, month }) => {
  const days = getDaysArray(year, month)
  const contributionsMap = new Map(contributions.map((c) => [c.date, c.achievementLevel]))

  const getIntensity = (achievementLevel: number) => {
    if (achievementLevel === 0) return 0
    if (achievementLevel <= 25) return 1
    if (achievementLevel <= 50) return 2
    if (achievementLevel <= 75) return 3
    return 4
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-600">
        {month !== undefined ? `${getMonthName(month)} ${year}` : year}
      </h3>
      <div className="inline-grid grid-cols-53 gap-1">
        {days.map((day, index) => {
          const achievementLevel = contributionsMap.get(day.toISOString().split("T")[0]) || 0
          const intensity = getIntensity(achievementLevel)
          return (
            <div
              key={index}
              className="w-3 h-3 rounded-sm transition-colors duration-200 ease-in-out"
              style={{
                backgroundColor: intensity === 0 ? "rgb(235, 237, 240)" : `${color}${intensity * 2 + 1}0`,
                gridColumn: getWeekNumber(day),
                gridRow: day.getDay() + 1,
              }}
              title={`${day.toDateString()}: ${achievementLevel}% achieved`}
            />
          )
        })}
      </div>
    </div>
  )
}

