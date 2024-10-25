import React, { useState } from 'react'

export const AddElementModal = ({ prompt, onClose, onAddElement }) => {

    const sortIndex = prompt.prompt_data.length;
    const [type, setType] = useState('static');
    const [value, setValue] = useState('');
    const [name, setName] = useState('');

    const handleAddElement = () => {

        const element = type === 'random'
        ? {
            type,
            sortIndex,
            elementName: name,
            value: value.split(',').map(val => val.trim()),
        }
        : {
            type,
            value,
            sortIndex
        }

        const updatedPrompt = {
            ...prompt,
            prompt_data: [...prompt.prompt_data, element],
        };

        onAddElement(updatedPrompt)

        onClose();
    }

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Add Element</h2>
        <div className="form-group">
            <label>Type:</label>
            <div>
                <label>
                    <input
                        type="radio"
                        value="static"
                        checked={type === 'static'}
                        onChange={() => setType('static')}
                    />
                    Static text
                </label>
                <label>
                    <input
                        type="radio"
                        value="random"
                        checked={type === 'random'}
                        onChange={() => setType('random')}
                    />
                    Randomized
                </label>
            </div>
        </div>

        {type === 'static' && (
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

        {type === 'random' && (
            <div className='form-group'>
                <label>Element Name: </label>
                <textarea 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
        )}

        {type === 'random' && (
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
        <button 
            className='add-element-button' 
            onClick={handleAddElement} 
            >Add Element</button>
        </div>

    </div>
  )
}
