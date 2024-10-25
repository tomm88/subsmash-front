import React from 'react';
import { LayoutProvider } from './LayoutContext';
import { LayoutPage } from './LayoutPage';

export const OverlayLayouts = () => {
  return (
    <LayoutProvider>
      <LayoutPage />
    </LayoutProvider>
  )
}
