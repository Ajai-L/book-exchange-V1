import React, { useEffect, useState } from 'react'
import { getReports, resolveReport } from '../../services/admin.service'

export default function Reports() {
  const [reports, setReports] = useState([])
  useEffect(() => { getReports().then(setReports).catch(()=>{}) }, [])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Reports</h2>
      <div className="mt-4 space-y-2">
        {reports.map(r => (
          <div key={r._id} className="p-2 border rounded flex items-center justify-between">
            <div>{r.title}</div>
            <button className="text-green-600" onClick={() => resolveReport(r._id).then(()=>alert('resolved'))}>Resolve</button>
          </div>
        ))}
      </div>
    </div>
  )
}
