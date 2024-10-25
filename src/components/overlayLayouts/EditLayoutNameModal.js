import React, { useContext, useState } from 'react'
import { editLayoutName } from '../../httpRequests/layoutEdits';
import { LayoutContext } from './LayoutContext';

export const EditLayoutNameModal = ({ setEditingName }) => {

  const { selectedLayout, refreshLayouts, handleSelectLayout } = useContext(LayoutContext);
  const [layoutName, setLayoutName] = useState(selectedLayout.layout_name);
  const [savingName, setSavingName] = useState(false);

  const handleEditName = async () => {
    setSavingName(true);
    await editLayoutName(layoutName, selectedLayout.id);
    const updatedLayouts = await refreshLayouts();
    const renamedLayout = updatedLayouts.find((layout) => layout.id === selectedLayout.id);
    handleSelectLayout(renamedLayout);
    setSavingName(false);
    setEditingName(false);
  }

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={() => setEditingName(false)}>&times;</span>
        <h3>Edit Layout Name</h3>
        <input 
            type="text" 
            value={layoutName} 
            onChange={(e) => setLayoutName(e.target.value)}
        />
        <button className='name-ok-button' onClick={handleEditName}>{savingName ? 'Saving...' : 'Ok'}</button>
        </div>
    </div>
  )
}
