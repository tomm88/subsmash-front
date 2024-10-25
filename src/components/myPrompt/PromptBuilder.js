import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PromptDropdown } from './PromptDropdown';
import { PromptEditor } from './PromptEditor';
import { PromptPanel } from './PromptPanel';
import { NewPromptModal } from './NewPromptModal';
import { DeletePromptConfirmation } from './DeletePromptConfirmation';
import '../../styles/MyPrompt/promptBuilder.css'
import '../../styles/modals.css'

export const PromptBuilder = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isPreset, setIsPreset] = useState(false);
  const [newPromptModalIsOpen, setNewPromptModalIsOpen] = useState(false);
  const [deletePromptModalOpen, setDeletePromptModalOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);

  const activePrompts = prompts.filter((p) => p.active)

  const getPrompts = useCallback(async () => {
    try {
        const response = await axios.get(`${apiUrl}/db/getPrompts`, { withCredentials: true });
        setPrompts(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting prompts", error)
    }
  }, [apiUrl])

  useEffect(() => {
    const prompts = async () => {
      await getPrompts();
    }
    prompts();
  }, [getPrompts])

  const handleSelectedPrompt = (prompt) => {
    if (prompt.streamer_id === 1) {setIsPreset(true)} else {setIsPreset(false)}
      setSelectedPrompt(prompt);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedPrompt = Array.from(selectedPrompt.prompt_data);
    const [movedItem] = reorderedPrompt.splice(result.source.index, 1);
    reorderedPrompt.splice(result.destination.index, 0, movedItem);

    const updatedPrompt = reorderedPrompt.map((item, index) => ({
      ...item,
      sortIndex: index,
    }));
    setSelectedPrompt({...selectedPrompt, prompt_data: updatedPrompt});
  }

  const refreshPrompts = async () => {
    const updatedPrompts = await getPrompts();
    return updatedPrompts
  }

  const openNewPromptModal = () => {
    setNewPromptModalIsOpen(true)
  }

  const closeNewPromptModal = () => {
    setNewPromptModalIsOpen(false)
  }

  const openDeletePromptModal = () => {
    setDeletePromptModalOpen(true);
  }

  const closeDeletePromptModal = () => {
    setDeletePromptModalOpen(false);
  }

  return (
    <div>
    <h2>Prompt Builder</h2>
    <br />
    <div className='prompt-builder-container'>
      <div className='dropdown-and-new-prompt-button-container'>
        <PromptDropdown
        prompts={prompts} 
        selectedPrompt={selectedPrompt} 
        onSelectPrompt={handleSelectedPrompt} 
        />
      <button className='new-prompt-button' onClick={openNewPromptModal}>Create New Prompt</button>
      </div>

      <div className='editor-and-panel-container'>
        {selectedPrompt && (
          <PromptEditor 
            prompt={selectedPrompt} 
            onDragEnd={onDragEnd}
            setSelectedPrompt={setSelectedPrompt}
            isPreset={isPreset} 
            refreshPrompts={refreshPrompts}
          />
        )}
        <PromptPanel 
          prompt={selectedPrompt} 
          refreshPrompts={refreshPrompts}
          isPreset={isPreset}
          setSelectedPrompt={setSelectedPrompt}
          activePrompts={activePrompts}
        />
        </div>
        <button className='delete-prompt-button' hidden={isPreset} onClick={openDeletePromptModal}>Delete Prompt</button>

        {newPromptModalIsOpen && (
          <NewPromptModal 
            prompts={prompts} 
            refreshPrompts={refreshPrompts} 
            onClose={closeNewPromptModal}
            selectPrompt={handleSelectedPrompt}
            />
        )}

        {deletePromptModalOpen && (
          <DeletePromptConfirmation 
            onClose={closeDeletePromptModal} 
            promptName={selectedPrompt.prompt_name} 
            promptId={selectedPrompt.id} 
            refreshPrompts={refreshPrompts}
            selectPrompt={handleSelectedPrompt}
          />
        )}
        
    </div>
    </div>
  )
}
