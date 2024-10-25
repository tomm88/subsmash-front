import React, { useContext } from 'react'
import { PreviewsDropdown } from './PreviewsDropdown';
import { PreviewsDisplay } from './PreviewsDisplay';
import { AlertTestPanel } from './AlertTestPanel';
import '../../styles/previews/previews.css'
import { PreviewsContext } from './PreviewsContext';

export const PreviewsPage = () => {
    const { selectedLayout } = useContext(PreviewsContext)
  return (
    <>
        <PreviewsDropdown />
      <br />
      <div className='display-and-panel-container'>
        <PreviewsDisplay />
        {selectedLayout.layout_type === 'alerts' && <AlertTestPanel />}
      </div></>
  )
}
