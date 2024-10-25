import React, { useState } from 'react'
import { createNewPrompt } from '../../httpRequests/promptEdits';
import '../../styles/MyPrompt/newPromptModal.css'

export const NewPromptModal = ({ prompts, refreshPrompts, onClose, selectPrompt }) => {
    const [promptName, setPromptName] = useState('');
    const [startOption, setStartOption] = useState('scratch');
    const [selectedExistingPrompt, setSelectedExistingPrompt] = useState();

    const handleCreatePrompt = async () => {
        if (!promptName) {
            alert(('Please enter a name for the prompt'));
            return;
        }
        let promptData = [];
        if (startOption === 'existing') {
            for (let i=0; i<prompts.length; i++) {
                
                if (prompts[i].id === parseInt(selectedExistingPrompt)) {
                    promptData = prompts[i].prompt_data
                }
            }
        }
        const newPrompt = await createNewPrompt(promptName, promptData);
        await refreshPrompts();
        selectPrompt(newPrompt)
        onClose();
    }

  return (
    <div className="modal-overlay">
            <div className="modal-content new-prompt-modal">
                <span className="modal-close" onClick={onClose}>&times;</span>

                <h2>Create New Prompt</h2>
                <div className="form-group">
                    <label>Prompt Name:</label>
                    <input
                        className='prompt-name-input'
                        type="text"
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>How do you want to start?</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="existing"
                                checked={startOption === 'existing'}
                                onChange={() => setStartOption('existing')}
                            />
                            Start from existing
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="scratch"
                                checked={startOption === 'scratch'}
                                onChange={() => setStartOption('scratch')}
                            />
                            Start from scratch
                        </label>
                    </div>
                </div>

                {startOption === 'existing' && (
                    <div className="form-group">
                        <label>Select an existing prompt config:</label>
                        <select
                            value={selectedExistingPrompt}
                            onChange={(e) => setSelectedExistingPrompt(e.target.value)}
                        >
                            <option value="">-- Select a prompt config --</option>
                            {prompts.map((prompt) => (
                                <option key={prompt.id} value={prompt.id}>
                                    {prompt.prompt_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <button className="create-button" onClick={handleCreatePrompt}>
                        Create Prompt
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
  )
}
