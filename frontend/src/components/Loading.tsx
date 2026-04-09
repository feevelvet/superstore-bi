import React from 'react'

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-12">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin opacity-20"></div>
      <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
      <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-50"></div>
    </div>
  </div>
)

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div className={`${className} bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-shimmer`}></div>
)
