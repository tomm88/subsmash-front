import React, { useCallback, useContext, useState } from 'react'
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import '../../styles/modals.css'
import { LayoutContext } from './LayoutContext';
import leftAlignIcon from '../../assets/icons/format_align_left.svg';
import centerAlignIcon from '../../assets/icons/format_align_center.svg';
import rightAlignIcon from '../../assets/icons/format_align_right.svg';


export const EditTextModal = ({ onClose, layer }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { layoutElements, setLayoutElements, userFonts, refreshUserFonts, presetFonts, selectedLayout, settings } = useContext(LayoutContext)
    const [text, setText] = useState(layer.content);
    const [fontSize, setFontSize] = useState(layer.fontSize);
    const [fontColor, setFontColor] = useState(layer.fontColor);
    const [fontFamily, setFontFamily] = useState(layer.fontFamily);
    const [isBold, setIsBold] = useState(layer.fontWeight === 700);
    const [textAlign, setTextAlign] = useState(layer.textAlign || 'center');
    const [fontUploading, setFontUploading] = useState(false);
    const [isForNewSubscriber, setIsForNewSubscriber] = useState(layer.conditions.isForNewSubscriber || false);
    const [isForResubscription, setIsForResubscription] = useState(layer.conditions.isForResubscription || false);
    const [isForGiftSub, setIsForGiftSub] = useState(layer.conditions.isForGiftSub || false);
    const [showSupportedVariables, setShowSupportedVariables] = useState(false);

    const handleSaveText = () => {
        let custom = false;
        const customUser = userFonts.find(font => font.title === fontFamily);
        const customPreset = presetFonts.find(font => font.title === fontFamily);

        if (customUser || customPreset) {
            custom = true
        }

        const newElement = {
            ...layer,
            content: text,
            fontSize,
            fontColor,
            fontFamily,
            fontWeight: isBold ? 700 : 400,
            textAlign,
            isCustomFont: custom ? true : false,
            url: custom ? customUser ? customUser.url : customPreset.url : '',
            conditions: {
                isForNewSubscriber,
                isForResubscription,
                isForGiftSub
            }
        }

        const updatedElements = layoutElements.map((el) => el === layer ? newElement : el);
        setLayoutElements(updatedElements);
        onClose();
    }

    const handleRemove = () => {
        const filteredElements = layoutElements.filter((el) => el.id !== layer.id);
        setLayoutElements(filteredElements);
        onClose()
    }

    const handleChangeFontSize = (newSize) => {
        let controlledSize = newSize;
        if (newSize > 150) {
            controlledSize = 150;
        }
        setFontSize(controlledSize);
    }

    const onDrop = useCallback( 
        async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append('font', file);
        })

        setFontUploading(true);

        await axios.post(`${apiUrl}/aws/upload/font`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        })
        .then((response) => {
            console.log('Font uploaded successfully', response.data);
        })
        .catch((error) => {
            alert('There was an error uploading your font. Please ensure the file is a valid .ttf or .otf file and try again.')
            console.error('Error uploading the font', error)
        })
        await refreshUserFonts();
        setFontUploading(false)
    }, [refreshUserFonts, apiUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, 
        maxSize: 2000000
    });

  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Edit Layer</h2>
            <div className='text-and-variables-container'>
                <div className='form-group'>
                    <label>Text: </label>
                    <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{ textAlign: textAlign}}
                />
                </div>
                <div className='variables-container'>
                    <span>Places variables in {'{'}braces{'}'}</span>
                    <span 
                        className='show-supported-variables-clickable-text' 
                        onClick={() => setShowSupportedVariables(!showSupportedVariables)}
                        >
                            {showSupportedVariables ? 'Hide supported variables' : 'Show supported variables'}
                        </span>
                    {showSupportedVariables && <div className='supported-variables'>
                        <ul>
                            <span className='variables-list-heading'>Alerts and Slideshow</span>
                            <li>{'{'}subscriber{'}'} - displays the subscriber's Twitch username</li>
                            <li>{'{'}character{'}'} - displays name of the subscriber's SubSmash character</li>
                            <span className='variables-list-heading'>Alerts only</span>
                            <li>{'{'}gifter{'}'} - displays the Twitch username of the viewer who gifted subs</li>
                            <li>{'{'}amount{'}'} - displays the amount of subs gifted</li>
                            <li>{'{'}months{'}'} - displays the number of months subscribed</li>
                            <li>{'{'}message{'}'} - displays the resubscription message</li>
                            <li>{'{'}tier{'}'} - displays the tier of the subscription</li>
                        </ul>
                    </div>}
                </div>
            </div>
            <div className='font-options'>
                <div className='form-group'>
                    <label htmlFor="fontFamily">Font:</label>
                    <select
                    id="fontFamily"
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                    >
                    {userFonts.length > 0 && (
                        <>
                        <optgroup label="My Fonts"></optgroup>
                        {userFonts.map((font, index) => (
                            <option key={index} value={font.title}>{font.title}</option>
                        ))}
                        </>
                    )}
                    <optgroup label="Preset Fonts">
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Oswald">Oswald</option>
                    <option value="Raleway">Raleway</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Nunito">Nunito</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Playfair Display">Playfair Display</option>
                    {presetFonts.map((font, index) => (
                        <option key={index} value={font.title}>{font.title}</option>
                    ))}
                    </optgroup>
                    </select>
                    <label>
                        <input 
                            type='checkbox' 
                            checked={isBold} 
                            onChange={() => setIsBold(!isBold)}
                        />
                        Bold
                    </label>
                    <div {...getRootProps()} className='font-dropzone'>
                        <input {...getInputProps()} />
                        <span className={`upload-fonts-dropzone ${isDragActive ? 'fonts-dropzone-with-drag' : ''}`}>{fontUploading ? 'Uploading...' : 'Upload Font'}</span>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='font-size-and-alignment-buttons-container'>
                    <label>Font Size:</label>
                    <input 
                        type='number' 
                        value={fontSize} 
                        onChange={(e) => handleChangeFontSize(e.target.value)} 
                        min="10" 
                        max="150" 
                    />
                    <div className='alignment-buttons-container'>
                        <img src={leftAlignIcon} onClick={() => setTextAlign('left')} alt='left-align' className='align-icon left' />
                        <img src={centerAlignIcon} onClick={() => setTextAlign('center')} alt='center-align' className='align-icon center' />
                        <img src={rightAlignIcon} onClick={() => setTextAlign('right')} alt='right-align' className='align-icon right' />
                    </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label>Font Color:</label>
                    <input 
                        type='color' 
                        value={fontColor} 
                        onChange={(e) => setFontColor(e.target.value)} 
                    />
                </div>
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
                <button onClick={handleSaveText}>Ok</button>
                <button className='delete-button' onClick={handleRemove}>Remove</button>
            </div>
        </div>

    </div>

  )
}
