import React, { useContext } from 'react'
import { PreviewsHeader } from './PreviewsHeader';
import { PreviewsDisplay } from './PreviewsDisplay';
import { AlertTestPanel } from './AlertTestPanel';
import '../../styles/previews/previews.css'
import { PreviewsContext } from './PreviewsContext';

export const PreviewsPage = () => {
    const { selectedLayout } = useContext(PreviewsContext)
  return (
    <>
        <PreviewsHeader />
      <br />
      <div className='display-and-panel-container'>
        <PreviewsDisplay />
        {selectedLayout.layout_type === 'alerts' && <AlertTestPanel />}
      </div></>
  )
}
