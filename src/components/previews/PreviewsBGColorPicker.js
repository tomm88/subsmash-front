import React, { useContext } from 'react'
import { PreviewsContext } from './PreviewsContext'

export const PreviewsBGColorPicker = () => {
    const { backgroundColor, setBackgroundColor } = useContext(PreviewsContext)
  return (
    <div className='background-color-selector-container'>
    <label>
        <input 
          type='color' 
          value={backgroundColor} 
          onChange={(e) => setBackgroundColor(e.target.value)}
        /> <br />Background Color (preview / testing only)
      </label>
  </div>
  )
}
