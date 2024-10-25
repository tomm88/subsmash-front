import React, { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios';
import { getSubsFromDatbase } from '../../httpRequests/getSubsFromDatabase';
const apiUrl = process.env.REACT_APP_API_URL;

export const PreviewsContext = createContext();

export const PreviewsProvider = ({ children }) => {
    const [layouts, setLayouts] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState({});
    const [layoutElements, setLayoutElements] = useState([]);
    const [alertTypeToTest, setAlertTypeToTest] = useState('new_subscriber')
    const [subscriberForTestAlert, setSubscriberForTestAlert] = useState(null);
    const [alertDuration, setAlertDuration] = useState(3);
    const [alertSoundUrl, setAlertSoundUrl] = useState('')
    const [alertPreviewIsShowing, setAlertPreviewIsShowing] = useState(false);
    const [liveTesting, setLiveTesting] = useState(false);

    const getLayouts = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/db/getLayouts`, { withCredentials: true });
            setLayouts(response.data.layouts);            
            return response.data.layouts;
        } catch (error) {
            console.error("Error getting layouts", error);
        }
    }, [])
    
      useEffect(() => {
        const layouts = async () => {
          await getLayouts();
        }
        layouts();
      }, [getLayouts]);

      useEffect(() => {
        try {
          const getSubs = async () => {
            const subs = await getSubsFromDatbase()
            setSubscribers(subs);
          }
          getSubs();
        } catch (error) {
          console.error('Error getting subs from database', error)
        }
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

      const handleSelectLayout = (layout) => {
        setSelectedLayout(layout);
        setLayoutElements(layout.layout_data)
      }

      const handleTestAlertTypeChange = (e) => {
        setAlertTypeToTest(e.target.value)
      }

      const setAlertConfig = useCallback(() => {
        if (layoutElements.length > 0) {
          const config = layoutElements.find(el => el.type === 'config');
          setAlertDuration(parseInt(config.duration) * 1000);
          setAlertSoundUrl(config.soundUrl)
        }
      }, [layoutElements])

      useEffect(() => {
        setAlertConfig()
      }, [setAlertConfig]);

      const randomIndex = Math.floor(Math.random() * 5)
      const imageUrls = [
          'Arman Kahlil___96369804cca8fef22607.png',
          'Astrid Frostwhisper___51c3077f36a269fd0ba0.png',
          'Mystara Shadowleaf___eb8f21f72333df8a1ecd.png',
          'Talon Earthshaper___c81b8f2a3cd3fe2e1e61.png',
          'Tariq Ifeanyi Goldspark___76743328adab5df7e40c.png'
      ]
      const charNames = [
          'Arman Kahlil', 'Astrid Frostwhisper', 'Mystara Shadowleaf', 'Talon Earthshaper', 'Tariq Ifeanyi Goldspark'
      ]
  
      const charName = charNames[randomIndex];
      const imgSrc = `${apiUrl}/${imageUrls[randomIndex]}`;

      const contextValue = {
        layouts,
        subscribers,
        handleSelectLayout,
        selectedLayout,
        layoutElements,
        alertTypeToTest,
        handleTestAlertTypeChange,
        subscriberForTestAlert,
        setSubscriberForTestAlert,
        alertDuration,
        alertSoundUrl,
        alertPreviewIsShowing,
        setAlertPreviewIsShowing,
        liveTesting,
        setLiveTesting,
        charName, 
        imgSrc,
        apiUrl
      }

  return (
    <PreviewsContext.Provider value={contextValue}>
        {children}
    </PreviewsContext.Provider>
  )
}
