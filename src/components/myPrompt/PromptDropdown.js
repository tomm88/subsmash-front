import React, { useEffect } from 'react'

export const PromptDropdown = ({ prompts, onSelectPrompt, selectedPrompt }) => {

    useEffect(() => {
        if (prompts.length > 0 && !selectedPrompt) {
            const activePrompt = prompts.find((p) => p.active);
            if (activePrompt) {
              onSelectPrompt(activePrompt)
            } else { 
                onSelectPrompt(prompts[0])
            }
        }
    }, [prompts, onSelectPrompt, selectedPrompt])

    const handlePromptSelect = (e) => {
        const promptId = e.target.value;
        const selected = prompts.find((p) => p.id === parseInt(promptId));
        onSelectPrompt(selected);
    }

  return (
    <div>
        <label htmlFor='promptSelect'>Select a Prompt:</label>
        <select id='promptSelect' value={selectedPrompt?.id || ''} onChange={handlePromptSelect}>
            <optgroup label="Presets">
                {prompts.filter(p => p.streamer_id === 1).map((prompt) => (
                    <option key={prompt.id} value={prompt.id}>
                        {prompt.prompt_name}
                    </option>
                ))}
            </optgroup>
            <optgroup label='My Prompts'>
                {prompts.filter(p => p.streamer_id !== 1).map((prompt) => (
                    <option key={prompt.id} value={prompt.id}>
                        {prompt.prompt_name}
                    </option>
                ))}
            </optgroup>
        </select>
    </div>
  )
}
