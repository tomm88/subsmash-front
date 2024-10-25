import React, { useContext, useState } from 'react'
import { LayoutContext } from './LayoutContext';

export const EditImagesModal = ({ layer, onClose }) => {

    const {layoutElements, setLayoutElements, settings, selectedLayout} = useContext(LayoutContext);
    const [imageDisplayTitle, setImageDisplayTitle] = useState(layer.displayTitle);
    const [isForNewSubscriber, setIsForNewSubscriber] = useState(layer.conditions.isForNewSubscriber || false);
    const [isForResubscription, setIsForResubscription] = useState(layer.conditions.isForResubscription || false);
    const [isForGiftSub, setIsForGiftSub] = useState(layer.conditions.isForGiftSub || false);

    const handleSaveImage = () => {
        const newElement = {
            ...layer,
            displayTitle: imageDisplayTitle,
            conditions: {
                isForNewSubscriber,
                isForResubscription,
                isForGiftSub
            }
        }

        const updatedElements = layoutElements.map((el) => el === layer ? newElement : el);
        setLayoutElements(updatedElements);
        onClose();
    };

    const handleRemove = () => {
        const filteredElements = layoutElements.filter((el) => el.id !== layer.id);
        setLayoutElements(filteredElements);
        onClose()
    };

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Edit Layer</h2>
            <div className='form-group'>
                <label>Title: </label>
                <textarea 
                value={imageDisplayTitle}
                onChange={(e) => setImageDisplayTitle(e.target.value)}
                required
                />
            </div>
            {selectedLayout.layout_type === 'alerts' &&
                <div className='form-group'>
                    <label>Conditions:</label>
                    {settings.isNewSubscriberAlert && 
                        <>                  
                            <input 
                                type='checkbox' 
                                checked={isForNewSubscriber}                         
                                onChange={() => setIsForNewSubscriber(!isForNewSubscriber)} 
                            /> New Subscribers
                            <br />
                        </>
                    }
                    {settings.isResubscribeAlert &&
                        <>
                            <input 
                                type='checkbox' 
                                checked={isForResubscription}                         
                                onChange={() => setIsForResubscription(!isForResubscription)} 
                            /> Resubscriptions
                            <br />
                        </>
                    }   
                    {settings.isGiftSubAlert && 
                        <>
                            <input 
                                type='checkbox' 
                                checked={isForGiftSub}                         
                                onChange={() => setIsForGiftSub(!isForGiftSub)} 
                            /> Gift Subscriptions
                            <br />
                        </>
                    }   
                </div>}
            <div className='buttons-container edit-layer-modal'>
                <button onClick={handleSaveImage}>Save</button>
                <button className='delete-button' onClick={handleRemove}>Remove</button>
            </div>
        </div>
    </div>
  )
}
