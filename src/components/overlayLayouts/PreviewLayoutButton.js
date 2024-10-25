import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import openNewIcon from '../../assets/icons/open_in_new.svg'
import { LayoutContext } from './LayoutContext';

export const PreviewLayoutButton = () => {
  const { selectedLayout } = useContext(LayoutContext);
  
  return (
    <Link to={`/dashboard/previews?layout=${encodeURIComponent(JSON.stringify(selectedLayout))}`} target='_blank'>
        <button className='preview-button'>
            Preview
            <img className='open-new-tab-icon' alt='opens-new-tab' src={openNewIcon} />
        </button>
    </Link>
  )
}
