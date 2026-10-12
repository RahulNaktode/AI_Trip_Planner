import React from 'react'

function Matrix({ label, value, icon: Icon }) {
  return (
    <div className='flex flex-col gap-1'>
        <span className='text-[10px] font-black text-gray-600 uppercase flex items-center gap-2'>
            <Icon size={12} /> {label}
        </span>
      <span className='font-black text-2xl italic'>{value}</span>
    </div>
  )
}

export default Matrix
