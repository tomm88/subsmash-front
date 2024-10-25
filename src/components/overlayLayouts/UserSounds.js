import React, { useContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { LayoutContext } from './LayoutContext'
import { useDropzone } from 'react-dropzone';
import { uploadSounds } from '../../httpRequests/uploadSounds';
import '../../styles/overlayLayouts/userSounds.css'

export const UserSounds = () => {
    const { userSounds, setUserSounds, presetSounds, setPresetSounds, apiUrl, showSoundsPanel, setShowSoundsPanel, setLayoutElements, layoutElements, selectedSound, setSelectedSound } = useContext(LayoutContext);
    const [uploadingSound, setUploadingSound] = useState(false);

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

    const handleSoundSelect = (sound) => {
        setSelectedSound(sound)
        const configIndex = layoutElements.findIndex(el => el.type === 'config');
        const newElements = layoutElements.map((el, index) => {
            if(index === configIndex) {
                return {
                    ...el,
                    soundUrl: sound
                };
            }
            return el;
        })
        setLayoutElements(newElements);
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

  return (
    <div className='user-sounds-container'>
        {showSoundsPanel && <div className='hideable-sounds-container'>
            <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />
            <span className={`upload-sounds-header ${isDragActive ? 'upload-header-with-drag' : ''}`}>{uploadingSound ? 'Uploading...' : 'Drag sound file or click to upload'}</span>
            </div>
            <br />
            <ul className='user-sounds-list'>
                <li className='user-sounds-item' key='uploads-heading'>Your Uploaded Sounds</li>
            {userSounds.length > 0 ? (
                <>
                    {userSounds.map((sound, index) => (
                        <li 
                            key={index} 
                            className='user-sounds-item'
                        >
                            <input 
                                type='radio' 
                                value={sound.url}
                                checked={selectedSound === sound.url}
                                onChange={() => handleSoundSelect(sound.url)}
                                className='input-radio'
                            />
                            <span className='sound-title'>{sound.title}</span>
                        </li>
                    ))}                          
                </>
            ) : (
                <li className='user-sounds-item' key='no-uploads'>No sounds uploaded yet</li>
            )}
            <li className='user-sounds-item' key='presets-heading'>Preset Sounds</li>
            {presetSounds.map((sound, index) => (
                        <li 
                            key={index} 
                            className='user-sounds-item'
                        >
                            <input 
                                type='radio' 
                                value={sound.url}
                                checked={selectedSound === sound.url}
                                onChange={() => handleSoundSelect(sound.url)}
                                className='input-radio'
                            />
                            <span className='sound-title'>{sound.title}</span>
                        </li>
                    ))}
                    <li key='noSound' className='user-sounds-item'>
                        <input 
                            type='radio'
                            value={null}
                            checked={selectedSound === null}
                            onChange={() => handleSoundSelect(null)}
                            className='input-radio'
                        />
                        <span>No sound</span>
                    </li> 
            </ul> 
    </div>
        }
        
        <p className='toggle-hide' onClick={handleToggleShowPanel}>{showSoundsPanel ? 'Hide sounds panel' : 'Show sounds panel'}</p>
    </div>
  )
}
