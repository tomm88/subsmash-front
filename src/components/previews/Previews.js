import React from 'react'
import { PreviewsProvider } from './PreviewsContext';
import { PreviewsPage } from './PreviewsPage';

export const Previews = () => {

  return (
    <PreviewsProvider>
      <PreviewsPage />
    </PreviewsProvider>
  )
}
