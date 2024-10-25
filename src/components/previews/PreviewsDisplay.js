import React, { useContext } from 'react'
import '../../styles/previews/previewDisplay.css'
import { RenderSlideshowPreview } from './RenderSlideshowPreview'
import { RenderAlertPreview } from './RenderAlertPreview'
import { PreviewsContext } from './PreviewsContext'

export const PreviewsDisplay = () => {
  const { selectedLayout, subscriberForTestAlert } = useContext(PreviewsContext);

  return (
    <div className='preview-window'>
      {selectedLayout.layout_type === 'slideshow' && <RenderSlideshowPreview />}
      {selectedLayout.layout_type === 'alerts' && subscriberForTestAlert && <RenderAlertPreview />}
    </div>
  )
}
