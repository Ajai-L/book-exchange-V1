import React from 'react'

export default function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm mb-1">{label}</div>}
      <input className="border rounded p-2 w-full" {...props} />
    </label>
  )
}
