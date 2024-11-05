import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { fetchUploadedFonts } from '../../httpRequests/fetchUploadedFonts';
import { updateActiveStatus } from '../../httpRequests/layoutEdits';
import { saveLayout } from '../../httpRequests/saveLayout';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [layouts, setLayouts] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState({});
    const [userImages, setUserImages] = useState([]);
    const [presetImages, setPresetImages] = useState([])
    const [layoutElements, setLayoutElements] = useState([]);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUploadPanel, setShowUploadPanel] = useState(true);
    const [userFonts, setUserFonts] = useState([]);
    const [presetFonts, setPresetFonts] = useState([]);
    const [showSettings, setShowSettings] = useState(true);
    const [isNewSubscriberAlert, setIsNewSubscriberAlert] = useState(false);
    const [showNewSubAlertForGifted, setShowNewSubAlertForGifted] = useState(false);
    const [isResubscribeAlert, setisResubscribeAlert] = useState(false);
    const [isGiftSubAlert, setIsGiftSubAlert] = useState(false);
    const [isFollowerAlert, setIsFollowerAlert] = useState(false);
    const [isCheerAlert, setIsCheerAlert] = useState(false);
    const [isRaidAlert, setIsRaidAlert] = useState(false);
    const [savingLayout, setSavingLayout] = useState(false);
    const [activeSlideshowLayout, setActiveSlideshowLayout] = useState(null);
    const [activeAlertsLayouts, setActiveAlertsLayouts] = useState([]);
    const [view, setView] = useState('new_subscriber');
    const [duration, setDuration] = useState(3);
    const [userSounds, setUserSounds] = useState([]);
    const [presetSounds, setPresetSounds] = useState([]);
    const [showSoundsPanel, setShowSoundsPanel] = useState(true);
    const [selectedSounds, setSelectedSounds] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#2a2a2a')

    const apiUrl = process.env.REACT_APP_API_URL;

    const getLayouts = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/db/getLayouts`, { withCredentials: true });
            setLayouts(response.data.layouts);
            setActiveSlideshowLayout(response.data.activeSlideshowLayout);
            setActiveAlertsLayouts(response.data.activeAlertsLayouts);
            if (Object.keys(selectedLayout).length === 0) {
              handleSelectLayout(response.data.layouts[0])
            }
            
            return response.data.layouts;
        } catch (error) {
            console.error("Error getting layouts", error);
        }
    }, [apiUrl, selectedLayout])
    
      useEffect(() => {
        const layouts = async () => {
          await getLayouts();
        }
        layouts();
      }, [getLayouts]);

      useEffect(() => {
        const loadUserFonts = async () => {
          const fonts = await fetchUploadedFonts();
          setUserFonts(fonts.userFonts);
          setPresetFonts(fonts.presetFonts)
        };
        loadUserFonts();
      }, []);

      useEffect(() => {
        layoutElements.forEach(element => {
          if (element.isCustomFont && element.url) {
            const newFont = new FontFace(element.fontFamily, `url(${element.url})`);
            newFont.load().then((loadedFont) => {
              document.fonts.add(loadedFont);
            }).catch((error) => {
              console.error('Failed to load custom font', error)
            })
          }
        })
      }, [layoutElements])

      useEffect(() => {
        const element = layoutElements.find((el) => el.type === 'config')
        if (element)  {
        if (selectedLayout.layout_type === 'alerts'){
            setIsNewSubscriberAlert(element.conditions.isNewSubscriberAlert || false);
            setShowNewSubAlertForGifted(element.conditions.showNewSubAlertForGifted|| false);
            setisResubscribeAlert(element.conditions.isResubscribeAlert || false);
            setIsGiftSubAlert(element.conditions.isGiftSubAlert || false);
            setSelectedSounds(element.soundUrls || null);
            setIsFollowerAlert(element.conditions.isFollowerAlert || false);
            setIsCheerAlert(element.conditions.isCheerAlert || false);
            setIsRaidAlert(element.conditions.isRaidAlert || false);
          }
          setDuration(element.duration)
        }
      }, [layoutElements, selectedLayout.layout_type]);

    const refreshLayouts = async () => {
      const updatedLayouts = await getLayouts();
      return updatedLayouts;
    }

    const refreshUserFonts = async () => {
      const fonts = await fetchUploadedFonts();
      setUserFonts(fonts.userFonts);
    }

    const addElementToLayout = (newElement) => {
        setLayoutElements((prevElements) => [newElement, ...prevElements])
    };

    const handleSelectLayout = (layout) => {
        setSelectedLayout(layout);
        setLayoutElements(layout.layout_data);
    };

    const randomString = () => {
        const str = crypto.getRandomValues(new Uint8Array(6));
        return btoa(String.fromCharCode(...str))
    }

    const handleSaveLayout = async () => {
      setSavingLayout(true);
      await saveLayout(selectedLayout, layoutElements);
      const updatedLayouts = await refreshLayouts();
      const savedLayout = updatedLayouts.find((layout) => layout.id === selectedLayout.id);
      handleSelectLayout(savedLayout);
      setSavingLayout(false)
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 1000)
    }

    const handleActiveToggle = async (selectedLayout, newStatus) => {
      await updateActiveStatus(selectedLayout.id, selectedLayout.layout_type, newStatus);
      await getLayouts();
    }

    const handleUpdateDuration = async (newDuration) => {
      let controlledDuration = newDuration;
      if (newDuration > 60) {
        controlledDuration = 60
      }
      setDuration(controlledDuration)
      const configIndex = layoutElements.findIndex(el => el.type === 'config');
      const updatedLayoutElements = layoutElements.map((el, index) => {
        if (index === configIndex) {
          return {
            ...el,
            duration: controlledDuration
          };
        }
        return el;
      });
      setLayoutElements(updatedLayoutElements)
    }

    const settings = {
      showSettings,
      setShowSettings,
      isNewSubscriberAlert,
      setIsNewSubscriberAlert,
      showNewSubAlertForGifted,
      setShowNewSubAlertForGifted,
      isResubscribeAlert,
      setisResubscribeAlert,
      isGiftSubAlert,
      setIsGiftSubAlert,
      isFollowerAlert,
      setIsFollowerAlert,
      isCheerAlert,
      setIsCheerAlert,
      isRaidAlert,
      setIsRaidAlert,
      duration
    }

    const contextValue = {
        layouts,
        refreshLayouts,
        selectedLayout,
        handleSelectLayout,
        userImages,
        setUserImages,
        presetImages,
        setPresetImages,
        layoutElements,
        setLayoutElements,
        addElementToLayout,
        selectedElementId,
        setSelectedElementId,
        loading,
        setLoading,
        apiUrl,
        randomString,
        showUploadPanel,
        setShowUploadPanel,
        userFonts,
        refreshUserFonts,
        presetFonts,
        settings,
        handleActiveToggle,
        handleSaveLayout,
        savingLayout,
        activeSlideshowLayout,
        activeAlertsLayouts,
        handleUpdateDuration,
        view, 
        setView,
        userSounds, 
        setUserSounds,
        presetSounds,
        setPresetSounds,
        showSoundsPanel,
        setShowSoundsPanel,
        selectedSounds,
        setSelectedSounds,
        saveSuccess,
        backgroundColor,
        setBackgroundColor
    }


  return (
    <LayoutContext.Provider value={contextValue}>
        {children}
    </LayoutContext.Provider>
  )
}
