import React, { useCallback, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutContext } from './LayoutContext';
import { useDropzone } from 'react-dropzone';
import { uploadImages } from '../../httpRequests/uploadImages';
import '../../styles/overlayLayouts/userImages.css';

export const UserImages = () => {
    const { userImages, setUserImages, presetImages, setPresetImages, apiUrl, addElementToLayout, layoutElements, randomString, showUploadPanel, setShowUploadPanel, layouts } = useContext(LayoutContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [allowDelete, setAllowDelete] = useState(false)

    const getUserImages = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/aws/getUserImages`, { withCredentials: true });
            setUserImages(response.data.images.userImages);
            setPresetImages(response.data.images.presetImages);
        } catch (error) {
            console.error('Error fetching uploaded images', error);
        }
    }, [apiUrl, setUserImages, setPresetImages]);

    useEffect(() => {
        getUserImages()
    }, [getUserImages]);


    const handleToggleShowPanel = () => {
        setShowUploadPanel(!showUploadPanel)
    }

    const handleSelect = (imageTitle) => {
        setAllowDelete(true)
        if (selectedImage === imageTitle) {
            setSelectedImage(null);
            return;
        }
        presetImages.forEach(image => {
            if (image.title === imageTitle) {
                setAllowDelete(false)
            }
        })
        setSelectedImage(imageTitle);
    };

    const handleAddToLayout = (imageTitle) => {
        let imageData = userImages.find((img) => img.title === imageTitle);
        if(!imageData) {
            imageData = presetImages.find((img) => img.title === imageTitle)
        }
        const img = new Image();

        let largestZIndex = 4;

        layoutElements.forEach(el => {
            if (el.zIndex > largestZIndex) {
                largestZIndex = el.zIndex
            }
        });

        img.onload = () => {

            const maxWidth = 750;
            const maxHeight = 550;

            let imageWidth = img.naturalWidth;
            let imageHeight = img.naturalHeight;

            const aspectRatio = imageWidth / imageHeight;

            if (imageWidth > maxWidth || imageHeight > maxHeight) {
                if (imageWidth > imageHeight) {
                    imageWidth = maxWidth;
                    imageHeight = maxWidth / aspectRatio;
                } else {
                    imageHeight = maxHeight;
                    imageWidth = maxHeight * aspectRatio;
                }

                if (imageWidth > maxWidth) {
                    imageWidth = maxWidth;
                    imageHeight = maxWidth / aspectRatio;
                } else if (imageHeight > maxHeight) {
                    imageHeight = maxHeight;
                    imageWidth = maxHeight * aspectRatio;
                }
            }

            const newImageElement = {
                ...imageData,
                id: imageTitle + randomString(),
                displayTitle: imageTitle,
                type: 'image',
                locked: false,
                position: { x: 10, y: 10 },
                size: { width: imageWidth, height: imageHeight },
                zIndex: largestZIndex + 1,
                conditions: {
                    isForNewSubscriber: true,
                    isForResubscription: true,
                    isForGiftSub: true,
                    isForFollower: true,
                    isForCheer: true,
                    isForRaid: true
                }
            }
            addElementToLayout(newImageElement);

        }

        img.src = imageData.url

    }

    const handleDelete = async (imageTitle) => {
        for (const l of layouts) {
            const existsInLayout = l.layout_data.filter(image => image.title === imageTitle)
            if (existsInLayout.length !== 0) {
                alert(`Cannot delete ${imageTitle} while it is being used in a layout`);
                return;
            }
        }
        for (const el of layoutElements) {
            if(el.title === imageTitle) {
                alert(`Cannot delete ${imageTitle} while it is being used in a layout`);
                return;
            }
        }
        try {
            const response = await axios.delete(`${apiUrl}/aws/deleteUserImage/${imageTitle}`, {
                withCredentials: true
            });
            if (response.data.message === 'Image deleted successfully') {
                setUserImages(userImages.filter(image => image.title !== selectedImage));
                setSelectedImage(null);
            }
        } catch (error) {
            console.error('Error deleting the image', error)
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles) => {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('files', file);
            }
            );
            

            setUploadingImage(true);
            try {
                await uploadImages(formData);
                await getUserImages();
            } catch(error) {
                console.error("Error uploading image", error)
            } finally {
                setUploadingImage(false)
            }
        }, 
        [getUserImages]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {
            'image/png': [],
            'image/jpeg': [],
            'image/gif': [], 
            }
        });

  return (
    <div className='user-images-container'>
        {showUploadPanel && <div className='hideable-images-container'>
            <div {...getRootProps()} className='dropzone'>
                <input {...getInputProps()} />
                <span className={`upload-images-header ${isDragActive ? 'upload-header-with-drag' : ''}`}>{uploadingImage ? 'Uploading...' : 'Drag image here or click to upload'}</span>
                </div>
                <br />
                <ul className='user-images-list'>
                <li className='user-images-item' key='uploads-heading'>Your Uploaded Images</li>
                {userImages.length > 0 ? (
                    <>
                        {userImages.map((image, index) => (
                            <li 
                                key={index} 
                                className={`user-images-item ${selectedImage === image.title ? 'selected' : ''}`}
                                onClick={() => handleSelect(image.title)}
                            >
                                <img src={image.url} alt={image.title} className='thumbnail' />
                                <span className='image-title'>{image.title}</span>
                            </li>
                        ))}
                    
                    </>
                ) : (
                    <li className='user-images-item' key='no-images'>No images uploaded yet</li>
                )}
                    <li className='user-images-item' key='presets-heading'>Preset Images</li>
                        {presetImages.map((image, index) => (
                            <li 
                                key={index} 
                                className={`user-images-item ${selectedImage === image.title ? 'selected' : ''}`}
                                onClick={() => handleSelect(image.title)}
                            >
                                <img src={image.url} alt={image.title} className='thumbnail' />
                                <span className='image-title'>{image.title}</span>
                            </li>
                        ))}
                </ul>
                {selectedImage && (
                    <div className='action-buttons'>
                        <button className='action-btn add-btn' onClick={() => handleAddToLayout(selectedImage)}>Add to Layout</button>
                        <button className='action-btn delete-btn' onClick={() => handleDelete(selectedImage)} disabled={!allowDelete}>Delete</button>
                    </div>
                )}
                <br />
            </div>
        }
        
        <p className='toggle-hide' onClick={handleToggleShowPanel}>{showUploadPanel ? 'Hide images panel' : 'Show images panel'}</p>
    </div>
  );
};