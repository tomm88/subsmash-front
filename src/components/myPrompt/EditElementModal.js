import React, { useState } from 'react'

export const EditElementModal = ({ element, onClose, onEditElement, prompt }) => {

    const [value, setValue] = useState(Array.isArray(element.value) ? element.value.join(', ') : element.value);
    const [name, setName] = useState(element.elementName || '');

    const handleSaveElement = () => {
        const updatedElement = element.type === 'random'
        ? {
            ...element,
            value: value.split(',').map(val => val.trim()),
            elementName: name
        }
        : {
            ...element,
            value
        }

        const updatedPrompt = {
            ...prompt,
            prompt_data: prompt.prompt_data.map((el) => el === element ? updatedElement : el)
        };

        onEditElement(updatedPrompt);
        onClose();
      }

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Edit Element</h2>
        {element.type === 'static' && (
            <div className='form-group'>
                <label>Text: </label>
                <textarea 
                className='large-textarea'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                />
            </div>
        )}

        {element.type === 'random' && (
            <div className='form-group'>
                <label>Element Name: </label>
                <textarea 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
        )}

        {element.type === 'random' && (
            <div className='form-group'>
                <label>Values comma-separated: </label>
                <textarea 
                className='large-textarea'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                />
         </div>
        )}

        <button onClick={handleSaveElement}>Ok</button>

        </div>

    </div>
  )
}
