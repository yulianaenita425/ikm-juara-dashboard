import { useState, useEffect } from 'react'
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

export default function RealTimeIndicator({ 
  isConnected = true, 
  lastUpdated, 
  refreshInterval = 15000,
  onRefresh 
}) {
  const [timeAgo, setTimeAgo] = useState('')
  const [nextRefresh, setNextRefresh] = useState(refreshInterval)

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdated) return

      const now = new Date()
      const diff = now - lastUpdated
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)

      if (seconds < 60) {
        setTimeAgo(`${seconds} detik yang lalu`)
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} menit yang lalu`)
      } else {
        const hours = Math.floor(minutes / 60)
        setTimeAgo(`${hours} jam yang lalu`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 1000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  useEffect(() => {
    if (!isConnected) return

    const countdown = setInterval(() => {
      setNextRefresh(prev => {
        if (prev <= 1000) {
          return refreshInterval
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [isConnected, refreshInterval])

  const formatNextRefresh = (ms) => {
    const seconds = Math.ceil(ms / 1000)
    return `${seconds}s`
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <WifiIcon className="h-4 w-4 text-green-600" />
              <span className="text-green-600 ml-1">Live</span>
            </div>
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
            <span className="text-red-600">Terputus</span>
          </>
        )}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex items-center text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>{timeAgo}</span>
        </div>
      )}

      {/* Next Refresh Countdown */}
      {isConnected && (
        <div className="flex items-center text-gray-400">
          <span>Refresh dalam {formatNextRefresh(nextRefresh)}</span>
        </div>
      )}

      {/* Manual Refresh Button */}
      <button
        onClick={onRefresh}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Refresh Sekarang
      </button>
    </div>
  )
}