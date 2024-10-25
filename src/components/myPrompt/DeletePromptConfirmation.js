import React from 'react'
import { deletePrompt } from '../../httpRequests/promptEdits'

export const DeletePromptConfirmation = ({ onClose, promptName, promptId, refreshPrompts, selectPrompt }) => {

    const handleDelete = async () => {
        await deletePrompt(promptId);
        const updatedPrompts = await refreshPrompts();
        const firstActivePrompt = updatedPrompts.find(p => p.active) || updatedPrompts[0];
        selectPrompt(firstActivePrompt)
        onClose();
    }

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
            <h5>Are you sure you want to delete prompt "{promptName}"?</h5>
            <div className='delete-conf-buttons-container'>
                <button className='delete-prompt-yes-button' onClick={handleDelete}>Yes</button>
                <button className='delete-prompt-no-button' onClick={onClose}>No</button>
            </div>
        </div>
    </div>
  )
}
