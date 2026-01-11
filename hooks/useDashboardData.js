import { useState, useEffect, useCallback } from 'react'

export function useDashboardData(refreshInterval = 30000) { // Default 30 detik
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  }
}

export function useRealTimeStats() {
  return useDashboardData(60000) // Refresh setiap 60 detik untuk mengurangi load
}