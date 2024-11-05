import React, { useContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { LayoutContext } from './LayoutContext'
import { useDropzone } from 'react-dropzone';
import { uploadSounds } from '../../httpRequests/uploadSounds';
import arrowDown from '../../assets/icons/arrowDown.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import playArrow from '../../assets/icons/playArrow.svg';
import playStop from '../../assets/icons/playStop.svg';
import '../../styles/overlayLayouts/userSounds.css'

export const UserSounds = () => {
    const { userSounds, setUserSounds, presetSounds, setPresetSounds, apiUrl, showSoundsPanel, setShowSoundsPanel, setLayoutElements, layoutElements, selectedSounds, setSelectedSounds } = useContext(LayoutContext);
    const [uploadingSound, setUploadingSound] = useState(false);
    const [showSoundConditions, setShowSoundConditions] = useState({});
    const [soundPlaying, setSoundPlaying] = useState('');
    const [audioInstance, setAudioInstance] = useState('');
    const [activeConditions, setActiveConditions] = useState([]);
    const [showActiveSounds, setShowActiveSounds] = useState(false);

    const getUserSounds = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/aws/sounds`, { withCredentials: true });
            setUserSounds(response.data.sounds.userSounds);
            setPresetSounds(response.data.sounds.presetSounds);
        } catch (error) {
            console.error('Error fetching uploaded sounds', error);
        }
    }, [apiUrl, setUserSounds, setPresetSounds]);

    useEffect(() => {
        getUserSounds()
    }, [getUserSounds]);

    

    const getConditions = useCallback(async () => {
        if (layoutElements) {
            const config = layoutElements.find(el => el.type === 'config');
            if(config && config.conditions) {
                const { conditions } = config;
                const subscriptionTypes = []
                if (conditions.isNewSubscriberAlert) {subscriptionTypes.push('New Subscriber')}
                if (conditions.isResubscribeAlert) {subscriptionTypes.push('Resubscriptions')}
                if (conditions.isGiftSubAlert) {subscriptionTypes.push('Gift Subscriptions')}
                if (conditions.isFollowerAlert) {subscriptionTypes.push('Follows')}
                if (conditions.isCheerAlert) {subscriptionTypes.push('Cheers')}
                if (conditions.isRaidAlert) {subscriptionTypes.push('Raids')}
                setActiveConditions(subscriptionTypes);
            }
        }
    }, [layoutElements]);

    useEffect(() => {
        getConditions()
    }, [getConditions])

    const alertTypeMap = {
        'New Subscriber': "new_subscriber", 
        'Resubscriptions': "resub", 
        'Gift Subscriptions': "gift_sub", 
        'Follows': "follower", 
        'Cheers': "cheer", 
        'Raids': "raid"
    }

    const handleSoundSelect = (soundUrl, alertType) => {

        const soundTypeToSet = alertTypeMap[alertType];

        setSelectedSounds(prevState => ({
            ...prevState,
            [soundTypeToSet]: prevState[soundTypeToSet] === soundUrl ? 'no sound' : soundUrl
        }))
        


        const configIndex = layoutElements.findIndex(el => el.type === 'config');
        const newElements = layoutElements.map((el, index) => {
            if(index === configIndex) {
                return {
                    ...el,
                    soundUrls: {
                        ...el.soundUrls,
                        [soundTypeToSet]: el.soundUrls[soundTypeToSet] === soundUrl ? 'no sound' : soundUrl
                    }
                };
            }
            return el;
        })
        setLayoutElements(newElements);
    }

    const handleToggleSoundConditionCollapse = (soundUrl) => {
        setShowSoundConditions(prevState => ({
            ...prevState,
            [soundUrl]: !prevState[soundUrl]
        }))
    }

    const handlePlaySound = (soundUrl) => {
        if (audioInstance) {
            audioInstance.pause();
            audioInstance.currentTime = 0;
        }

        const sound = new Audio(soundUrl);
        setAudioInstance(sound);
        setSoundPlaying(soundUrl);
        sound.play()
        
        sound.addEventListener('ended', () => {
            setSoundPlaying('');
            setAudioInstance('');
        });
    }

    const handleStopSound = () => {
        if (audioInstance) {
            audioInstance.pause();
            audioInstance.currentTime = 0;
            setSoundPlaying('');
            setAudioInstance('');
        }
    }

    const handleToggleShowPanel = () => {
        setShowSoundsPanel(!showSoundsPanel)
    }

    const onDrop = useCallback(
        async (acceptedFiles) => {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('audio', file);
            }
            );
            

            setUploadingSound(true);
            try {
                await uploadSounds(formData);
                await getUserSounds();
            } catch(error) {
                console.error("Error uploading sound", error)
            } finally {
                setUploadingSound(false)
            }
        }, 
        [getUserSounds]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {
            'audio/mpeg': [],
            'audio/wav': [],
            'audio/ogg': [], 
            'audio/aac': [], 
            }
        });

    const findSoundName = (type) => {
        let soundName;
        const config = layoutElements.find(el => el.type === 'config');
        const {soundUrls} = config;

        if (soundUrls[alertTypeMap[type]] === 'no sound' || soundUrls[alertTypeMap[type]] === '') return 'no sound';

        soundName = userSounds.find(sound => sound.url === soundUrls[alertTypeMap[type]])
        if (soundName) return soundName.title;

        soundName = presetSounds.find(sound => sound.url === soundUrls[alertTypeMap[type]])
        if (soundName) return soundName.title;

        return 'no sound'
    }
        

  return (
    <div className='user-sounds-container'>
        {showSoundsPanel && <div className='hideable-sounds-container'>
            <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />
            <span className={`upload-sounds-header ${isDragActive ? 'upload-header-with-drag' : ''}`}>{uploadingSound ? 'Uploading...' : 'Drag sound file or click to upload'}</span>
            </div>
            <br />
            <ul className='user-sounds-list'>
                <li className='user-sounds-item' key='uploads-heading' style={{fontWeight: 700}}>Your Uploaded Sounds</li>
            {userSounds.length > 0 ? (
                <>
                    {userSounds.map((sound) => (
                        <li 
                            key={sound.url} 
                            className='user-sounds-item'
                        >
                            <div className='sound-name-and-play-button-container'>
                            <div className='arrow-and-sound-name-container'>
                                <img 
                                src={showSoundConditions[sound.url] ? arrowDown : arrowRight} 
                                onClick={() => handleToggleSoundConditionCollapse(sound.url)}
                                className='sounds-panel-button'
                                alt='expand/collapse alert types'
                                />
                                <span className='sound-title'>{sound.title}</span>
                            </div>
                            <img 
                            src={soundPlaying === sound.url ? playStop : playArrow} 
                            className='sounds-panel-button'
                            onClick={soundPlaying === sound.url ? () => handleStopSound() : () => handlePlaySound(sound.url)}
                            alt={`play/stop ${sound.title}`}
                            />
                            </div>
                            {showSoundConditions[sound.url] && 
                            <div className='sound-conditions-list-container'>
                                <ul className='sound-conditions-list'>
                                    {activeConditions.map((type, index) => (
                                        <li key={index}>
                                            <input 
                                            type="checkbox" 
                                            checked={selectedSounds[alertTypeMap[type]] === sound.url}
                                            onChange={() => handleSoundSelect(sound.url, type, selectedSounds[alertTypeMap[type]])}
                                            />
                                            {type}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            }
                        </li>
                    ))}                          
                </>
            ) : (
                <li className='user-sounds-item' key='no-uploads'>No sounds uploaded yet</li>
            )}
            <li className='user-sounds-item' key='presets-heading' style={{fontWeight: 700}}>Preset Sounds</li>
            {presetSounds.map((sound) => (
                        <li 
                            key={sound.url} 
                            className='user-sounds-item'
                        >
                            <div className='sound-name-and-play-button-container'>
                            <div className='arrow-and-sound-name-container'>
                                <img 
                                src={showSoundConditions[sound.url] ? arrowDown : arrowRight} 
                                onClick={() => handleToggleSoundConditionCollapse(sound.url)}
                                className='sounds-panel-button'
                                alt='expand/collapse alert types'
                                />
                                <span className='sound-title'>{sound.title}</span>
                            </div>
                                <img 
                                    src={soundPlaying === sound.url ? playStop : playArrow} 
                                    className='sounds-panel-button'
                                    onClick={soundPlaying === sound.url ? () => handleStopSound() : () => handlePlaySound(sound.url)}
                                    alt={`play/stop ${sound.title}`}
                                />
                            </div>
                            {showSoundConditions[sound.url] && 
                            <div className='sound-conditions-list-container'>
                                <ul className='sound-conditions-list'>
                                {activeConditions.map((type, index) => (
                                        <li key={index}>
                                        <input 
                                        type="checkbox" 
                                        checked={selectedSounds[alertTypeMap[type]] === sound.url}
                                        onChange={() => handleSoundSelect(sound.url, type, selectedSounds[alertTypeMap[type]])}
                                        />
                                        {type}
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            }
                        </li>
                    ))}
                    <li key='noSound' className='user-sounds-item'>
                        <div className='arrow-and-sound-name-container'>
                        <img 
                        src={showSoundConditions['no sound'] ? arrowDown : arrowRight} 
                        onClick={() => handleToggleSoundConditionCollapse('no sound')}
                        className='sounds-panel-button'
                        alt='expand/collapse alert types'
                        />
                        <span>No sound</span>
                        </div>
                        {showSoundConditions['no sound'] && 
                        <div className='sound-conditions-list-container'>
                                <ul className='sound-conditions-list'>
                                {activeConditions.map((type, index) => (
                                        <li key={index}>
                                        <input 
                                        type="checkbox" 
                                        checked={selectedSounds[alertTypeMap[type]] === 'no sound' || selectedSounds[alertTypeMap[type]] === ''}
                                        onChange={() => handleSoundSelect('no sound', type, selectedSounds[alertTypeMap[type]])}
                                        />
                                        {type}
                                    </li>
                                    ))}
                                </ul> 
                        </div>
                        }
                    </li> 
            </ul> 
            <br />
    </div>
        }
        <p className='toggle-hide' onClick={handleToggleShowPanel}>{showSoundsPanel ? 'Hide sounds panel' : 'Show sounds panel'}</p>
        <button className='show-hide-active-sounds-button' onClick={() => setShowActiveSounds(!showActiveSounds)}>
            {showActiveSounds ? 'Hide Active Sounds' : 'Show Active Sounds'}
        </button>
        {showActiveSounds && 
            <div className='active-sounds-container'>
                {activeConditions.map(type => {
                    const soundTitle = findSoundName(type);
                    return (<div className='active-sounds-item' key={type}>
                    <h4>{type}</h4>
                    <span className='active-sound-title'>&bull; {soundTitle}</span>
                    <br />
                    </div>)
                }

                )}
            </div>
        }
    </div>
  )
}
