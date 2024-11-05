import React, { useContext, useState } from 'react'
import { deleteLayout } from '../../httpRequests/layoutEdits'
import { LayoutContext } from './LayoutContext'

export const DeleteLayoutConfirmationModal = ({ setDeleteModalOpen }) => {
    const { selectedLayout, handleSelectLayout, refreshLayouts } = useContext(LayoutContext);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteLayout = async () => {
        setDeleting(true);
        const deleteResponse = await deleteLayout(selectedLayout.id);
        if (deleteResponse.data.message === 'Error: Layout is active') {
          alert("Layout is active. Please deactivate it before deleting");
          setDeleting(false);
          setDeleteModalOpen(false);
          return;
        }
        const refreshedLayouts = await refreshLayouts();
        handleSelectLayout(refreshedLayouts[0]);
        setDeleting(false);
        setDeleteModalOpen(false)
    }

  return (
    <div className='modal-overlay'>
    <div className='modal-content'>
    <span className="modal-close" onClick={() => setDeleteModalOpen(false)}>&times;</span>
    <h3>Delete Layout {selectedLayout.layout_name}?</h3>
    <br />
    <div className='delete-conf-buttons-container'>
        <button className='delete-button' onClick={handleDeleteLayout}>{deleting ? 'Deleting...' : 'Delete'}</button>
        <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
    </div>
    </div>
</div>
  )
}
