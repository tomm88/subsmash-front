import React from 'react'
import { PreviewsDropdown } from "./PreviewsDropdown";
import { PreviewsBGColorPicker } from "./PreviewsBGColorPicker";
import '../../styles/previews/previewsHeader.css'

export const PreviewsHeader = () => {
  return (
    <div className='previews-header'>
    <PreviewsDropdown />
    <PreviewsBGColorPicker />
    </div>
  )
}
