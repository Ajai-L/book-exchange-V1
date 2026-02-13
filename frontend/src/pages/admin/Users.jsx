import React, { useEffect, useState } from 'react'
import { getUsers, blockUser } from '../../services/admin.service'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => { getUsers().then(setUsers).catch(()=>{}) }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Users</h2>
      <div className="mt-4 space-y-2">
        {users.map(u => (
          <div key={u._id} className="p-2 border rounded flex items-center justify-between">
            <div>{u.name} ({u.email})</div>
            <button className="text-red-600" onClick={() => blockUser(u._id).then(()=>alert('done'))}>Block</button>
          </div>
        ))}
      </div>
    </div>
  )
}
