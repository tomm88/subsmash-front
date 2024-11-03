import React, { useCallback, useContext, useEffect, useState} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LayoutContext } from './LayoutContext';
import '../../styles/overlayLayouts/layers.css'
import { EditTextModal } from './EditTextModal';
import { EditImagesModal } from './EditImagesModal';
import { placeholderImage } from '../../utils/placeholderImage';
import lockIconClosed from '../../assets/icons/lock_closed.svg';
import lockIconOpen from '../../assets/icons/lock_open.svg';

export const Layers = () => {
    const { layoutElements, setLayoutElements, addElementToLayout, randomString, selectedElementId } = useContext(LayoutContext);
    const [layerToEdit, setLayerToEdit] = useState(null);
    const [editingTextLayer, setEditingTextLayer] = useState(false);
    const [editingImageLayer, setEditingImageLayer] = useState(false);

    const isPlaceholderPreset = useCallback(() => {
        const result = layoutElements.find(el => el.id === 'layout_placeholder___62efa17d')
        if (result) return true;
        return false;
    }, [layoutElements])

    const [placeholderImageExists, setPlaceholderImageExists] = useState(isPlaceholderPreset());

    useEffect(() => {
        setPlaceholderImageExists(isPlaceholderPreset())
    }, [layoutElements, isPlaceholderPreset])

    const handleOpenEditTextModal = (layer) => {
        setEditingTextLayer(true);
        setLayerToEdit(layer);
    }

    const handleCloseEditTextModal = () => {
        setEditingTextLayer(false);
    }

    const handleOpenEditImageModal = (layer) => {
        setEditingImageLayer(true);
        setLayerToEdit(layer);
    }

    const handleCloseEditImageLayer = () => {
        setEditingImageLayer(false);
    }

    const handleRestorePlaceholderImage = () => {
        setLayoutElements([placeholderImage(layoutElements), ...layoutElements])
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(layoutElements);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        let z = items.length + 4;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type !== 'config'){
                items[i].zIndex = z;
                z--;
            }
        }

        setLayoutElements(items);
    };

    const handleLockToggle = (el, currentStatus) => {
        const newElements = layoutElements.map(e => {
            if (e.id === el.id) {
                const newElement = {
                    ...e,
                    locked: !currentStatus
                }
                return newElement
            }
            return e;
        });
        console.log(newElements)
        setLayoutElements(newElements);
    }

    const handleAddText = () => {

        let largestZIndex = 4;
        layoutElements.forEach(el => {
            if (el.zIndex > largestZIndex) {
                largestZIndex = el.zIndex
            }
        });

        const newTextElement = {
            id: `text-${randomString()}`,
            type: 'text',
            content: 'New text layer',
            position: { x: 100, y: 100 },
            size: { width: 250, height: 30 },
            zIndex: largestZIndex + 1,
            fontSize: 16,
            fontColor: '#000000',
            fontFamily: 'Roboto',
            fontWeight: 400,
            locked: false,
            isCustomFont: false,
            url: '',
            conditions: {
                isForNewSubscriber: true,
                isForResubscription: true,
                isForGiftSub: true,
                isForFollower: true,
                isForCheer: true,
                isForRaid: true
            }
        }

        addElementToLayout(newTextElement);
        handleOpenEditTextModal(newTextElement);
    }

  return (
    <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='layers'>
                {(provided) => (
                    <ul className='layers-list' {...provided.droppableProps} ref={provided.innerRef}>
                        <div className='layer-heading-container'>
                            <h3>Layers</h3>
                            {!placeholderImageExists && <button onClick={handleRestorePlaceholderImage}>Add Placeholder Image</button>}
                            <button className='add-text-layer-button' onClick={handleAddText}>Add Text</button>
                        </div>
                        {layoutElements.filter((element) => element.type !== 'config')
                        .map((element, index) => (
                            <Draggable key={element.id} draggableId={element.id} index={index}>
                                {(provided) => (
                                    <li 
                                        ref={provided.innerRef} 
                                        {...provided.draggableProps} 
                                        {...provided.dragHandleProps} 
                                        style={{ ...provided.draggableProps.style }}
                                        className={`layer-item ${selectedElementId === element.id ? 'selected' : ''}` }
                                    >
                                        <span className='layer-display-title'>{element.type === 'image' ? element.displayTitle : element.content}</span>
                                        <div className='button-and-lock-icon-container'>
                                            <img 
                                            src={element.locked ? lockIconClosed : lockIconOpen} 
                                            alt={element.locked ? 'unlock element' : 'lock element'}
                                            onClick={() => handleLockToggle(element, element.locked)}
                                            />
                                            <button onClick={element.type === 'image' ? () => handleOpenEditImageModal(element) : () => handleOpenEditTextModal(element)}>edit</button>
                                        </div>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
        {editingTextLayer && 
            <EditTextModal 
            onClose={handleCloseEditTextModal}
            layer={layerToEdit}
            />
        }
        {editingImageLayer && 
            <EditImagesModal 
            onClose={handleCloseEditImageLayer} 
            layer={layerToEdit}
            />
        }

    </>
  )
}
