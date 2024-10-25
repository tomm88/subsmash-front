import React, { useContext } from 'react'
import { LayoutBuilder } from './LayoutBuilder';
import '../../styles/overlayLayouts/overlayLayouts.css'
import { LayoutsDropdown } from './LayoutsDropdown';
import { LayoutHeader } from './LayoutHeader';
import { DeleteLayoutButton } from './DeleteLayoutButton';
import { PreviewLayoutButton } from './PreviewLayoutButton';
import { CopyUrlBox } from '../dashboard/CopyUrlBox';
import { Panels } from './Panels';
import { LayoutContext } from './LayoutContext';

export const LayoutPage = () => {
    const {selectedLayout} = useContext(LayoutContext);
  return (
    <div className='layout-page'>
    <div>
      <div>
    <div className='heading-and-url-box-container'>
      <div className='heading-and-dropdown-container'>
      <h2>Layout Builder</h2>
      <LayoutsDropdown />
      </div>
      <CopyUrlBox />
      </div>
      
      <br />
      <LayoutHeader />
    </div>
    <br />
    <div className='layout-builder-components-container'>
      <div className='builder-and-delete-button-container'>
        <LayoutBuilder />  
        <br />
        <div className='delete-and-preview-buttons'>
          {selectedLayout.streamer_id !== 1 && <DeleteLayoutButton /> }
          <PreviewLayoutButton />
        </div>
      </div>
      <div>     
        <Panels />
      </div>
    </div>
    </div>

  </div>
  )
}
