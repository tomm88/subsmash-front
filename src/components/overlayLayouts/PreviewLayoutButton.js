import React, { useContext } from 'react'
import openNewIcon from '../../assets/icons/open_in_new.svg'
import { LayoutContext } from './LayoutContext';

export const PreviewLayoutButton = () => {
  const { selectedLayout } = useContext(LayoutContext);

  const handlePreviewClick = () => {
    sessionStorage.setItem('selectedLayout', JSON.stringify(selectedLayout));
    window.open('/dashboard/previews', '_blank');
  }
  
  return (
        <button className='preview-button' onClick={handlePreviewClick}>
            Preview
            <img className='open-new-tab-icon' alt='opens-new-tab' src={openNewIcon} />
        </button>
  )
}
