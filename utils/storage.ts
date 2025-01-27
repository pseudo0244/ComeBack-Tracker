import type { Detail } from "../app/types/contribution"

export const saveDetailsToLocalStorage = (details: Detail[]) => {
  localStorage.setItem("contributionDetails", JSON.stringify(details))
}

export const loadDetailsFromLocalStorage = (): Detail[] => {
  const storedDetails = localStorage.getItem("contributionDetails")
  return storedDetails ? JSON.parse(storedDetails) : []
}

export const clearAllDetails = () => {
  localStorage.removeItem("contributionDetails")
}

