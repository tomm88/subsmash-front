import React, { useContext, useState } from 'react';
import { LayoutContext } from './LayoutContext';
import { createNewLayout } from '../../httpRequests/layoutEdits';
import { placeholderImage } from '../../utils/placeholderImage';

export const NewLayoutModal = ({ setCreatingNewLayout }) => {

    const [layoutName, setLayoutName] = useState('');
    const [layoutType, setLayoutType] = useState('alerts');
    const [startOption, setStartOption] = useState('scratch');
    const [selectedExistingLayout, setSelectedExistingLayout] = useState();

    const { layouts, handleSelectLayout, refreshLayouts, settings } = useContext(LayoutContext)

    const handleCreateLayout = async () => {
        if (!layoutName) {
            alert('Please enter a name for the layout');
            return;
        }

        let layoutData = [placeholderImage([])];

        if (layoutType === 'alerts') {
            layoutData.push({
                type: 'config',
                conditions: {
                    isNewSubscriberAlert: settings.isNewSubscriberAlert,
                    isResubscribeAlert: settings.isResubscribeAlert,
                    isGiftSubAlert: settings.isGiftSubAlert
                },
                duration: 10,
                soundUrl: ''
            })
        }

        if (layoutType === 'slideshow') {
            layoutData.push({
                type: 'config',
                duration: 10
            })
        }

        if (startOption === 'existing') {
            for (let i=0; i<layouts.length; i++) {
                
                if (layouts[i].id === parseInt(selectedExistingLayout)) {
                    layoutData = layouts[i].layout_data
                }
            }
        }
        
        const newLayout = await createNewLayout(layoutName, layoutType, layoutData);
        await refreshLayouts()
        handleSelectLayout(newLayout);
        setCreatingNewLayout(false);
    }

  return (
    <div className="modal-overlay">
        <div className="modal-content new-layout-modal">
            <span className="modal-close" onClick={() => setCreatingNewLayout(false)}>&times;</span>

            <h2>Create New Layout</h2>
            <div className='form-group'>
                <label>Layout Type:</label>
                <label>
                <input
                    type="radio" 
                    value="alerts" 
                    checked={layoutType === 'alerts'} 
                    onChange={() => setLayoutType('alerts')}
                />
                Alerts
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="alerts" 
                        checked={layoutType === 'slideshow'} 
                        onChange={() => setLayoutType('slideshow')}
                    />
                    Slideshow
                </label>
            </div>
            <div className="form-group">
                <label>Layout Name:</label>
                <input
                    className='layout-name-input'
                    type="text"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
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
                    <label>Select an existing layout:</label>
                    <select
                        value={selectedExistingLayout}
                        onChange={(e) => setSelectedExistingLayout(e.target.value)}
                    >
                        <option value="">-- Select a layout --</option>
                        {layouts.map((layout) => (
                            <option key={layout.id} value={layout.id}>
                                {layout.layout_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {layoutType === 'alerts' && (
                <div className="form-group">
                    <label>Use this layout for:</label>
                    <input 
                    type='checkbox' 
                    checked={settings.isNewSubscriberAlert}
                    onChange={() => settings.setIsNewSubscriberAlert(!settings.isNewSubscriberAlert)}
                    />
                        New Subscriber
                    <input 
                    type='checkbox' 
                    checked={settings.isResubscribeAlert}
                    onChange={() => settings.setisResubscribeAlert(!settings.isResubscribeAlert)}
                    />
                        Resubscription
                    <input 
                    type='checkbox' 
                    checked={settings.isGiftSubAlert}
                    onChange={() => settings.setIsGiftSubAlert(!settings.isGiftSubAlert)}
                    />
                        Gifted Subs
                </div>
            )}

            <div className="form-group">
                <button className="create-button" onClick={handleCreateLayout}>
                    Create Layout
                </button>
                <button className="cancel-button" onClick={() => setCreatingNewLayout(false)}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}
