"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ContributionGraph } from "./ContributionGraph"
import type { Detail, ContributionDay } from "../types/contribution"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveDetailsToLocalStorage, loadDetailsFromLocalStorage, clearAllDetails } from "@/utils/storage"
import { Trash2 } from "lucide-react"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"

export const ContributionManager: React.FC = () => {
  const [details, setDetails] = useState<Detail[]>([])
  const [newDetail, setNewDetail] = useState({ name: "", color: "#4CAF50" })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteDetailId, setDeleteDetailId] = useState<string | null>(null)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  useEffect(() => {
    const loadedDetails = loadDetailsFromLocalStorage()
    setDetails(loadedDetails)
  }, [])

  useEffect(() => {
    saveDetailsToLocalStorage(details)
  }, [details])

  const addDetail = () => {
    if (newDetail.name) {
      setDetails([
        ...details,
        {
          id: Date.now().toString(),
          name: newDetail.name,
          color: newDetail.color,
          contributions: [],
        },
      ])
      setNewDetail({ name: "", color: "#4CAF50" })
    }
  }

  const addContribution = (detailId: string, achievementLevel: 0 | 25 | 50 | 75 | 100) => {
    const today = new Date().toISOString().split("T")[0]
    setDetails(
      details.map((detail) => {
        if (detail.id === detailId) {
          const existingContributionIndex = detail.contributions.findIndex((c) => c.date === today)
          let updatedContributions: ContributionDay[]
          if (existingContributionIndex !== -1) {
            updatedContributions = [...detail.contributions]
            updatedContributions[existingContributionIndex] = { date: today, achievementLevel }
          } else {
            updatedContributions = [...detail.contributions, { date: today, achievementLevel }]
          }
          return {
            ...detail,
            contributions: updatedContributions,
          }
        }
        return detail
      }),
    )
  }

  const handleDeleteDetail = (detailId: string) => {
    setDetails(details.filter((detail) => detail.id !== detailId))
  }

  const handleDeleteAllDetails = () => {
    setDetails([])
    clearAllDetails()
    setShowDeleteAllDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="destructive" onClick={() => setShowDeleteAllDialog(true)} className="ml-auto">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete All Trackers
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-grow">
              <Label htmlFor="detailName">Habit Name</Label>
              <Input
                id="detailName"
                type="text"
                value={newDetail.name}
                onChange={(e) => setNewDetail({ ...newDetail, name: e.target.value })}
                placeholder="Enter habit name"
              />
            </div>
            <div>
              <Label htmlFor="detailColor">Color</Label>
              <Input
                id="detailColor"
                type="color"
                value={newDetail.color}
                onChange={(e) => setNewDetail({ ...newDetail, color: e.target.value })}
                className="w-12 h-10 p-1"
              />
            </div>
            <Button onClick={addDetail}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="yearSelect">Year</Label>
              <Select onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedYear.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label htmlFor="monthSelect">Month</Label>
              <Select onValueChange={(value) => setSelectedMonth(value === "all" ? undefined : Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedMonth !== undefined
                        ? new Date(0, selectedMonth).toLocaleString("default", { month: "long" })
                        : "All"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {details.map((detail) => (
        <Card key={detail.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: detail.color }}></span>
                <span>{detail.name}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDeleteDetailId(detail.id)
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[0, 25, 50, 75, 100].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={level === 0 ? "outline" : "default"}
                    onClick={() => addContribution(detail.id, level as 0 | 25 | 50 | 75 | 100)}
                  >
                    {level}%
                  </Button>
                ))}
              </div>
              <ContributionGraph
                contributions={detail.contributions}
                color={detail.color}
                year={selectedYear}
                month={selectedMonth}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setDeleteDetailId(null)
        }}
        onConfirm={() => {
          if (deleteDetailId) {
            handleDeleteDetail(deleteDetailId)
          }
          setShowDeleteDialog(false)
          setDeleteDetailId(null)
        }}
        title="Delete Tracker"
        description="Are you sure you want to delete this tracker? This action cannot be undone."
      />

      <DeleteConfirmDialog
        isOpen={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleDeleteAllDetails}
        title="Delete All Trackers"
        description="Are you sure you want to delete all trackers? This action cannot be undone."
      />
    </div>
  )
}

