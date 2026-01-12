import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dealService } from '../services'
import { Deal, DealStageHistoryWithDetails } from '../services'
import { ApiError } from '../services/api'
import { useToast } from '../context/ToastContext'
// Using inline SVG icons instead of heroicons

interface DealAnalytics {
  dealId: string
  totalStages: number
  totalDuration: number
  currentStageDuration: number
  stageHistory: DealStageHistoryWithDetails[]
}

export function DealDetailPage() {
  const { dealId } = useParams<{ dealId: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [deal, setDeal] = useState<Deal | null>(null)
  const [analytics, setAnalytics] = useState<DealAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dealId) {
      loadDealData()
    }
  }, [dealId])

  const loadDealData = async () => {
    if (!dealId) return

    try {
      setLoading(true)

      // Load deal details and analytics in parallel
      const [dealData, analyticsData] = await Promise.all([
        dealService.getById(dealId),
        dealService.getDealAnalytics(dealId),
      ])

      setDeal(dealData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load deal data:', error)

      if (error instanceof ApiError) {
        addToast({
          type: 'error',
          title: 'Failed to Load Deal',
          message: error.message || 'An unexpected error occurred',
        })
      }

      navigate('/deals')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 1000) return 'Less than 1 second'

    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds % 60} second${seconds % 60 > 1 ? 's' : ''}`
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading deal details...</div>
      </div>
    )
  }

  if (!deal || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Deal Not Found</h2>
          <p className="text-slate-500 mb-4">The deal you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/deals')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
          >
            Back to Deals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/deals')}
            className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Deals
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{deal.title}</h1>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span>Value: <span className="font-semibold text-slate-900">${deal.value.toLocaleString()}</span></span>
              <span>Status: <span className="font-semibold text-slate-900">{deal.status}</span></span>
              {analytics.currentStageDuration && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx={12} cy={12} r={10} />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  Current stage: {formatDuration(analytics.currentStageDuration)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stage History Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Stage History</h2>

              {analytics.stageHistory.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No stage history available</p>
              ) : (
                <div className="space-y-6">
                  {analytics.stageHistory.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full flex-shrink-0 mt-1"></div>
                        {index < analytics.stageHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {entry.stageName ? `Moved to ${entry.stageName}` : 'Stage removed'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{entry.userName}</span>
                              <span>•</span>
                              <span>{formatDate(new Date(entry.changedAt))}</span>
                            </div>
                          </div>
                          {entry.durationInStage && (
                            <div className="text-sm text-slate-500">
                              Duration: {formatDuration(entry.durationInStage)}
                            </div>
                          )}
                        </div>

                        {entry.notes && (
                          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mt-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Deal Analytics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Stages:</span>
                  <span className="font-semibold">{analytics.totalStages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Time:</span>
                  <span className="font-semibold">{formatDuration(analytics.totalDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Stage:</span>
                  <span className="font-semibold">{formatDuration(analytics.currentStageDuration)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/deals/${dealId}/edit`)}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Edit Deal
                </button>
                <button
                  onClick={() => {/* TODO: Implement delete */}}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}