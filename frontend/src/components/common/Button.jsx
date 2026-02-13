import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 rounded font-medium disabled:opacity-60 transition-colors'
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-400 text-white hover:bg-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
