import React, { useEffect, useState } from 'react'
import '../../styles/MyPrompt/promptPanel.css'
import { updateActiveStatus } from '../../httpRequests/promptEdits'
import { SamplePrompt } from './SamplePrompt'
import { SampleImage } from './SampleImage'
import { generateSamplePrompt } from '../../utils/generateSamplePrompt'
import { generateSampleImage } from '../../httpRequests/generateSampleImage'
import { savePrompt } from '../../httpRequests/savePrompt'
import { AddElementModal } from './AddElementModal'

export const PromptPanel = ({ prompt, refreshPrompts, isPreset, setSelectedPrompt, activePrompts }) => {

  const [isActive, setIsActive] = useState(false)
  const [showActivePrompts, setShowActivePrompts] = useState(false)
  const [samplePrompt, setSamplePrompt] = useState('')
  const [sampleImage, setSampleImage] = useState({})
  const [imageGenerating, setImageGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [addingElement, setAddingElement] = useState(false);

  useEffect(() => {
    setSamplePrompt('');
    setSampleImage({});
  }, [prompt])

  useEffect(() => {
    if (prompt.active !== undefined) {
      setIsActive(prompt.active);
    }
  }, [prompt.active, prompt.id])

  const handleShowActivePrompts = () => {
    setShowActivePrompts(!showActivePrompts)
  }

  const handleActiveToggle = async () => {
    const newStatus = !isActive
    setIsActive(newStatus);
    await updateActiveStatus(prompt.id, newStatus);
    await refreshPrompts()
  }

  const handleGenerateSamplePrompt = () => {
    const newSamplePrompt = generateSamplePrompt(prompt);
    setSamplePrompt(newSamplePrompt);
  }

  const handleGenerateSampleImage = async () => {
    setImageGenerating(true);
    const newSamplePrompt = generateSamplePrompt(prompt);
    const sampleImage = await generateSampleImage(newSamplePrompt);
    setSamplePrompt(newSamplePrompt)
    setSampleImage(sampleImage)
    setImageGenerating(false);
  }

  const handleSavePrompt = async () => {
    setIsSaving(true);
    await savePrompt(prompt);
    await refreshPrompts();
    setIsSaving(false);
    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000)    
  }

  const showAddElementModal = () => {
    setAddingElement(true);
  }

  const onAddElementClose = () => {
    setAddingElement(false);
  }

  return (
    <div className='panel-and-samples-container'>
      <div className='prompt-panel-container'>
          <div className='controls-container'>
              <button className='add-button' hidden={isPreset} onClick={showAddElementModal}>
              Add Element    
              </button>        
              <div className='active-switch-container'>
              <label className='switch'>
                  <input type="checkbox" checked={isActive} onChange={handleActiveToggle}/>
                  <span className='slider round' />
              </label>
              <div className='switch-text'>Active</div>
          </div>
          </div>     
          {addingElement && (
            <AddElementModal 
            prompt={prompt}
            onClose={onAddElementClose}
            onAddElement={(updatedPrompt) => {setSelectedPrompt(updatedPrompt)}}
            />
          )}
          <button className='view-active-prompts-button' onClick={handleShowActivePrompts}>{showActivePrompts ? "Hide " : "Show "} Active Prompts</button>
          <div className='active-prompts-list' hidden={!showActivePrompts}>
            {activePrompts.length <= 0 ? "No active prompts. 'Preset 1 - Fantasy Characters' will be used as default" : 
              <ul>
                {activePrompts.map((p) => (<li key={p.id}>{p.prompt_name}</li>))}
                <br />
                If more than one prompt is active, SubSmash will choose one at random.
              </ul>
              
            }
          </div>
          <button className='generate-prompt-button' onClick={handleGenerateSamplePrompt}>
          Generate Sample Prompt    
          </button>  
          <button 
          className='generate-image-button' 
          onClick={handleGenerateSampleImage}
          disabled={imageGenerating} 
          >
          {imageGenerating ? "Generating Image..." : "Generate Sample Image" }    
          </button>  
          <button 
          className={`save-button ${saveSuccess ? 'save-success' : ''}`}
          disabled={isSaving} 
          hidden={isPreset} 
          onClick={handleSavePrompt}>
          {saveSuccess ? "Prompt Saved!" : isSaving ? "Saving..." : "Save Prompt"}    
          </button>              
      </div>
      <div className='sample-image-container'>
      {sampleImage.imageUrl !== undefined && (
        <SampleImage 
          sampleImage={sampleImage}
        />
      )}
      {samplePrompt !== '' && (
        <SamplePrompt 
          samplePrompt={samplePrompt}
        />
      )}
      </div>
    </div>
  )
}
