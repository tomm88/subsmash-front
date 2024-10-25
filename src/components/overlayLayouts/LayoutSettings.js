import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LayoutContext } from './LayoutContext'
import '../../styles/overlayLayouts/layoutSettings.css'

export const LayoutSettings = () => {
    const { 
        layouts,
        settings, 
        selectedLayout, 
        layoutElements, 
        setLayoutElements, 
        handleActiveToggle, 
        activeSlideshowLayout, 
        activeAlertsLayouts, 
        handleUpdateDuration, 
        view, 
        setView
     } = useContext(LayoutContext);
    const type  = selectedLayout.layout_type;
    const { showSettings,
        setShowSettings,
        isNewSubscriberAlert,
        setIsNewSubscriberAlert,
        isResubscribeAlert,
        setisResubscribeAlert,
        isGiftSubAlert,
        setIsGiftSubAlert,
        duration } = settings;

    const [isActive, setIsActive] = useState(false);
    const [showActiveLayouts, setShowActiveLayouts] = useState(false);
    const [activeLayoutsNewSub, setActiveLayoutsNewSub] = useState([]);
    const [activeLayoutsResub, setActiveLayoutsResub] = useState([]);
    const [activeLayoutsGiftSub, setActiveLayoutsGiftSub] = useState([]);
    const [activeLayoutSlideshow, setActiveLayoutSlideshow] = useState('');

    useEffect(() => {
        let active = false;
        if (type === 'slideshow') {
            if (selectedLayout.id === activeSlideshowLayout) {
                active = true
            }
        }
        if (type === 'alerts') {
            for (let i=0; i<activeAlertsLayouts.length; i++) {
                if(selectedLayout.id === activeAlertsLayouts[i]) {
                    active = true
                }
            }
        }
        setIsActive(active)
    }, [activeAlertsLayouts, activeSlideshowLayout, selectedLayout.id, type]);

    const setActiveLayouts = useCallback(() => {
        let newSubs = [];
        let resubs = [];
        let giftSubs = [];

        activeAlertsLayouts.forEach(id => {
            const layout = layouts.find(l => l.id === id)
            const config = layout.layout_data.find(el => el.type === 'config');
            if (config.conditions.isNewSubscriberAlert) newSubs.push(layout.layout_name)
            if (config.conditions.isResubscribeAlert) resubs.push(layout.layout_name)
            if (config.conditions.isGiftSubAlert) giftSubs.push(layout.layout_name)
        });

        const slideshowLayout = layouts.find(layout => layout.id === activeSlideshowLayout);
        if(slideshowLayout){
            setActiveLayoutSlideshow(slideshowLayout.layout_name)
        } else {
            setActiveLayoutSlideshow('')
        }

        setActiveLayoutsNewSub(newSubs);
        setActiveLayoutsResub(resubs);
        setActiveLayoutsGiftSub(giftSubs);
    }, [activeAlertsLayouts, layouts, activeSlideshowLayout]);

    useEffect(() => {
        setActiveLayouts();
    }, [setActiveLayouts])

    const handleConditionUpdate = (conditionKey, value) => {
        const updatedElements = layoutElements.map(el => {
            if (el.type === 'config') {
                return {...el, conditions: { ...el.conditions, [conditionKey]: value } };
            }
            return el;
        });
        setLayoutElements(updatedElements);
        return;
    }

    const findActiveView = (disabledView) => {
        if (isNewSubscriberAlert && disabledView !== 'new_subscriber') return 'new_subscriber'
        if (isResubscribeAlert && disabledView !== 'resub') return 'resub';
        if (isGiftSubAlert && disabledView !== 'gift_sub') return 'gift_sub';
        return '';
    }

    const handleNewSubCheckBox = () => {
        const newVal = !isNewSubscriberAlert
        setIsNewSubscriberAlert(newVal);
        handleConditionUpdate('isNewSubscriberAlert', newVal)
        if (!newVal && view === 'new_subscriber'){
            setView(findActiveView('new_subscriber'));
        }
        if (newVal && view === '') {
            setView('new_subscriber')
        }
    }

    const handleReSubCheckBox = () => {
        const newVal = !isResubscribeAlert
        setisResubscribeAlert(newVal);
        handleConditionUpdate('isResubscribeAlert', newVal);
        if (!newVal && view === 'resub'){
            setView(findActiveView('resub'));
        }
        if (newVal && view === '') {
            setView('resub')
        }
    }

    const handleGiftSubCheckBox = () => {
        const newVal = !isGiftSubAlert
        setIsGiftSubAlert(newVal);
        handleConditionUpdate('isGiftSubAlert', newVal);
        if (!newVal && view === 'gift_sub'){
            setView(findActiveView('gift_sub'));
        }
        if (newVal && view === '') {
            setView('gift_sub')
        }
    }

    const handleActiveChange = async () => {
        const newStatus = !isActive
        await handleActiveToggle(selectedLayout, newStatus)
    }

    const handleShowActiveLayouts = () => {
        setShowActiveLayouts(!showActiveLayouts)
    }

  return (
    <>
        <div className='layout-settings-container'>
            {showSettings &&
                <>
                <div className='layout-settings-header'>
                    <h3>Layout Settings</h3>
                    <div>
                    <label className='switch'>
                        <input type="checkbox" checked={isActive} onChange={handleActiveChange}/>
                        <span className='slider round' />
                    </label>
                    <div className='switch-text'>Active</div>
                    </div>
                    </div>
                    <label>Layout Type: {type}</label>
                    {selectedLayout.streamer_id !== 1 && <>
                    <label>{type === 'slideshow' ? 'Slide duration (seconds)' : 'Alert duration (seconds)'}</label>
                    <input 
                        type='number' 
                        value={duration}
                        onChange={(e) => handleUpdateDuration(e.target.value)}
                        min='1' 
                        max='60'
                    />
                    <br />
                    {selectedLayout.layout_type === 'alerts' && 
                    <>
                    <br />
                    <label>Conditions:</label>
                    <div className='form-group'>
                        <div>
                            <input 
                                type='checkbox' 
                                checked={isNewSubscriberAlert}
                                onChange={handleNewSubCheckBox}
                                /> New Subscribers
                        </div>
                        <div>
                            <input 
                                type='checkbox' 
                                checked={isResubscribeAlert}
                                onChange={handleReSubCheckBox}
                                /> Resubscriptions
                        </div>
                        <div>
                            <input 
                                type='checkbox' 
                                checked={isGiftSubAlert}
                                onChange={handleGiftSubCheckBox}
                                /> Gift Subscriptions
                        </div>
                    </div>
                    </>}
                    </>
                    }
                </>
            }
            <p onClick={() => setShowSettings(!showSettings)} className='hide-settings-text'>{showSettings ? 'Hide Layout Settings' : 'Show Layout Settings'}</p>
            <br />
            <button className='show-hide-active-layouts-button' onClick={handleShowActiveLayouts}>{showActiveLayouts ? 'Hide Active Layouts' : 'Show Active Layouts'}</button>
            {showActiveLayouts && 
            <>
                <div className='active-layouts-container'>
                    <h3>Alerts</h3>
                    <h4>New Subscriber</h4>
                    <ul>
                        {activeLayoutsNewSub.length > 0 ? activeLayoutsNewSub.map(title => (<li key={title}>{title}</li>))
                        : 
                        <li>None - No alerts will show for new subscribers.</li>
                        }
                    </ul>
                    <h4>Resubscriptions</h4>
                    <ul>
                        {activeLayoutsResub.length > 0 ? activeLayoutsResub.map(title => (<li key={title}>{title}</li>))
                        : 
                        <li>None - No alerts will show for resubscriptions.</li>
                        }
                    </ul>
                    <h4>Gift Subs</h4>
                    <ul>
                        {activeLayoutsGiftSub.length > 0 ? activeLayoutsGiftSub.map(title => (<li key={title}>{title}</li>))
                        : 
                        <li>None - No alerts will show for gift subs.</li>
                        }
                    </ul>
                    <span>If multiple layouts are active for one alert type, SubSmash will choose a layout at random for that alert type.</span>
                </div>
                <br />
                <div className='active-layouts-container'>
                    <h3>Slideshow</h3>
                    <ul>
                        {activeLayoutSlideshow !== '' ? <li>{activeLayoutSlideshow}</li> : <li>None - slideshow will not display</li>}
                    </ul>
                    <span>Only one active slideshow layout at a time is permitted.</span>
                </div>
            </>
            }
        </div>
    </>
  )
}
