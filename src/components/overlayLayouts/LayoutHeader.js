import React, { useContext, useEffect, useState } from 'react'
import { LayoutContext } from './LayoutContext'
import '../../styles/overlayLayouts/layoutHeader.css'
import { NewLayoutModal } from './NewLayoutModal';
import { EditLayoutNameModal } from './EditLayoutNameModal';

export const LayoutHeader = () => {
    const { selectedLayout, handleSaveLayout, savingLayout, view, setView, settings, saveSuccess, backgroundColor, setBackgroundColor } = useContext(LayoutContext);
    const [creatingNewLayout, setCreatingNewLayout] = useState(false);
    const [editingName, setEditingName] = useState(false);

    useEffect(() => {
      let somethingisActive = false;
      if (!somethingisActive && settings.isNewSubscriberAlert){setView("new_subscriber"); somethingisActive=true}
      if (!somethingisActive && settings.isResubscribeAlert){setView("resub"); somethingisActive=true}
      if (!somethingisActive && settings.isGiftSubAlert){setView("gift_sub"); somethingisActive=true}
      if (!somethingisActive && settings.isFollowerAlert){setView("follower"); somethingisActive=true}
      if (!somethingisActive && settings.isCheerAlert){setView("cheer"); somethingisActive=true}
      if (!somethingisActive && settings.isRaidAlert){setView("raid"); somethingisActive=true}
    }, [])

    const handleSelectFromDropdown = (e) => {
      setView(e.target.value)
    }

  return (
    <div className='layout-header'>
        <div className='layout-name-and-edit-button'>
            <h3>{selectedLayout ? selectedLayout.layout_name : 'New Layout'}</h3>
            {selectedLayout.streamer_id !== 1 && <button onClick={() => setEditingName(true)}>Edit Name</button>}
        </div>
        {selectedLayout.layout_type === 'alerts' && 
        <div className='view-options-container'>
          <div className='view-options'>
            <h4>View</h4>
            <select id='alert-type-view-selector' value={view} onChange={handleSelectFromDropdown}>
              {settings.isNewSubscriberAlert && 
              <option key='new_subscriber' value='new_subscriber'>New Subscriber</option>
              }
              {settings.isResubscribeAlert && 
              <option key='resub' value='resub'>Resubscription</option>
              }
              {settings.isGiftSubAlert && 
              <option key='gift_sub' value='gift_sub'>Gift Sub</option>
              }
              {settings.isFollowerAlert && 
              <option key='follower' value='follower'>Follower</option>
              }
              {settings.isCheerAlert && 
              <option key='cheer' value='cheer'>Cheer</option>
              }
              {settings.isRaidAlert && 
              <option key='raid' value='raid'>Raid</option>
              }
            </select>
          </div>
        </div>}
        <div className='background-color-selector-container'>
          <label>
              <input 
                type='color' 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
              /> <br />Background Color (preview / testing only)
            </label>
        </div>
        <div className='create-and-save-buttons'>
            <button onClick={() => setCreatingNewLayout(true)}>Create New Layout</button>
            {selectedLayout.streamer_id !== 1 && <button className={`save-button ${saveSuccess ? 'save-success' : ''}`} disabled={savingLayout} onClick={handleSaveLayout}>{savingLayout ? 'Saving...' : saveSuccess ? 'Layout Saved' : 'Save Layout'}</button>}
        </div>
        {creatingNewLayout && <NewLayoutModal setCreatingNewLayout={setCreatingNewLayout} />}
        {editingName && <EditLayoutNameModal setEditingName={setEditingName} />}
        
    </div>
  )
}
