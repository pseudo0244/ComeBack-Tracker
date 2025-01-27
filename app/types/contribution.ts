export interface ContributionDay {
    date: string
    achievementLevel: 0 | 25 | 50 | 75 | 100
  }
  
  export interface Detail {
    id: string
    name: string
    color: string
    contributions: ContributionDay[]
  }
  
  