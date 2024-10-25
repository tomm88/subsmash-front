import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditElementModal } from './EditElementModal';
import { EditPromptNameModal } from './EditPromptNameModal';
import '../../styles/MyPrompt/promptEditor.css'

export const PromptEditor = ({ prompt, onDragEnd, isPreset, setSelectedPrompt, refreshPrompts }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [elementToEdit, setElementToEdit] = useState({});

    const handleEditPromptNameClick = () => {
        setIsEditingName(true)
    }

    const handleCloseEditPromptName = () => {
        setIsEditingName(false)
    }

    const handleEditElementClick = (element) => {
        setElementToEdit(element)
        setIsEditing(true)
    }

    const handleCloseEditElement = () => {
        setIsEditing(false)
    }

    const handleDeleteElement = (element) => {
        const newPromptData = prompt.prompt_data.filter((item) => item.sortIndex !== element.sortIndex);

        const updatedPrompt = {
            ...prompt,
            prompt_data: newPromptData
        }

        setSelectedPrompt(updatedPrompt);
    }

    return (
        <div>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="promptElements">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='prompt-editor-container'  
                    >
                        <div className='prompt-editor-header'>
                        <h3>{prompt.prompt_name}</h3>
                        <button hidden={isPreset} onClick={handleEditPromptNameClick}>Edit Prompt Name</button>
                        </div>
                        <br />
                        {prompt.prompt_data.map((item, index) => (
                            <Draggable key={item.sortIndex} draggableId={String(item.sortIndex)} index={index}>
                                {(provided) => (
                                    <div
                                        className={`element-container ${item.type === 'random' ? 'random-element-container' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ ...provided.draggableProps.style }}  
                                    >

                                        {item.type === 'static' ? (
                                            <div className='element'>
                                                {item.value}
                                            </div>
                                        ) : (
                                            <div className='element'>
                                                {'{'} {item.elementName} {'}'}
                                            </div>
                                        )}
                                        <div className='edit-delete-buttons-container'>
                                            <button className='edit-button' hidden={isPreset} onClick={() => handleEditElementClick(item)}>
                                                Edit    
                                            </button>        
                                            <button className='delete-button' hidden={isPreset} onClick={() => handleDeleteElement(item)}>
                                                Delete    
                                            </button>   
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        {isEditing && (
            <EditElementModal 
                element={elementToEdit}
                onClose={handleCloseEditElement}
                onEditElement={(updatedPrompt) => setSelectedPrompt(updatedPrompt)}
                prompt={prompt}
            />
        )}
        {isEditingName && (
            <EditPromptNameModal 
                prompt={prompt}
                onClose={handleCloseEditPromptName} 
                onNameEdit={(updatedPrompt) => setSelectedPrompt(updatedPrompt)} 
                refreshPrompts={refreshPrompts}
            />
        )}
        </div>
    );
};
