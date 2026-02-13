import React, { useEffect, useState } from 'react'
import { getAnalytics } from '../../services/admin.service'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAnalytics().then(setStats).catch(()=>{})
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="mt-4">{stats ? JSON.stringify(stats) : 'Loading...'}</div>
    </div>
  )
}
