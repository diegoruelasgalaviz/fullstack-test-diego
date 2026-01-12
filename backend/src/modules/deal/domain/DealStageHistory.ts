export interface DealStageHistory {
  id: string
  dealId: string
  stageId: string | null
  userId: string
  changedAt: Date
  durationInStage: number | null // Duration in milliseconds spent in the previous stage
  notes: string | null
  createdAt: Date
}

export interface CreateDealStageHistoryDTO {
  dealId: string
  stageId: string | null
  userId: string
  changedAt?: Date
  durationInStage?: number | null
  notes?: string | null
}

export interface DealStageHistoryWithDetails extends DealStageHistory {
  stageName: string | null
  stageColor: string | null
  userName: string
  userEmail: string
}

export interface StageDurationAnalytics {
  stageId: string
  stageName: string
  averageDuration: number // in milliseconds
  totalTransitions: number
  minDuration: number
  maxDuration: number
}

export interface DealStageAnalytics {
  dealId: string
  totalStages: number
  totalDuration: number // total time in pipeline
  currentStageDuration: number // time in current stage
  stageHistory: DealStageHistoryWithDetails[]
}