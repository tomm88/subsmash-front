import React, { useState } from 'react'
import { DeleteLayoutConfirmationModal } from './DeleteLayoutConfirmationModal';

export const DeleteLayoutButton = () => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  return (
    <div>
        <button className='delete-layout-button' onClick={() => setDeleteModalOpen(true)}>Delete Layout</button>
        {deleteModalOpen && <DeleteLayoutConfirmationModal setDeleteModalOpen={setDeleteModalOpen}/>}
    </div>
  )
}
