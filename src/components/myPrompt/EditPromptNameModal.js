import React, { useState } from 'react'
import { savePromptName } from '../../httpRequests/promptEdits';

export const EditPromptNameModal = ({ prompt, onClose, onNameEdit, refreshPrompts }) => {

    const [promptName, setPromptName] = useState(prompt.prompt_name)
    const [savingName, setSavingName] = useState(false);

    const handleEditName = async () => {
        setSavingName(true);
        await savePromptName(prompt.id, promptName);
        await refreshPrompts();

        const updatedPrompts = await refreshPrompts();
        const promptWithNewName = updatedPrompts.find((p) => p.id === prompt.id)
        onNameEdit(promptWithNewName)
        setSavingName(false);
        onClose();
    }

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h3>Edit Prompt Name</h3>
        <input 
            type="text" 
            value={promptName} 
            onChange={(e) => setPromptName(e.target.value)}
        />
        <button className='name-ok-button' onClick={handleEditName}>{savingName ? 'Saving...' : 'Ok'}</button>
        </div>
    </div>
  )
}
