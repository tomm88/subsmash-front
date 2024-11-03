import { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useGetTwitchSubsSlideshow } from '../../hooks/useGetTwitchSubsSlideshow' 
import { getActiveSlideshowLayout } from '../../httpRequests/getActiveSlideshowLayout';
import { Rnd } from 'react-rnd';
import '../../styles/slideshow.css';

export const SlideshowBrowserSource = () => {
    const { hash } = useParams();
    const [layout, setLayout] = useState([]);
    const [layoutElements, setLayoutElements] = useState([]);
    const [slideDuration, setSlideDuration] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReconnect, setIsReconnect] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const websocketUrl = process.env.REACT_APP_WS_URL;

    const { activeSubscribers, setActiveSubscribers } = useGetTwitchSubsSlideshow(hash);

    const getLayout = useCallback( async () => {
        const activeLayout = await getActiveSlideshowLayout(hash);
        setLayout(activeLayout);
        setLayoutElements(activeLayout.layout_data);

        const config = activeLayout.layout_data.find(el => el.type === 'config');
        setSlideDuration(parseInt(config.duration) * 1000)

    }, [hash]);

    useEffect(() => {
        getLayout();
    }, [getLayout]);

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

        const initialize = () => {
            try {
                const eventSubSubscriptions = async () => {
                    try {
                        await axios.post(`${apiUrl}/twitch/eventSub/slideshow`, { hash });
                    } catch (error) {
                        console.error("Could not establish websocket connection for slideshow", error)
                    }
                }

                const ws = new WebSocket(`${websocketUrl}?hash=${hash}`);

                ws.onopen = async () => {
                    console.log('Websocket connection open for Slideshow');
                    await eventSubSubscriptions();
                    setIsReconnect(true);
                }

                ws.onmessage = (message) => {
                    const { type, data } = JSON.parse(message.data);
                    if (!data.isTest) {
                        if (type === "reroll"){
                            if (!data.active) return;
                            console.log(`${data.subscriberTwitchUsername} rerolled their character.`)
                            setActiveSubscribers((prevSubscribers) => {
                                const index = prevSubscribers.findIndex(sub => sub.subscriberTwitchUsername === data.subscriberTwitchUsername);
                                if (index !== -1) {
                                    const updatedSubscribers = [...prevSubscribers];
                                    updatedSubscribers[index] = data;
                                    return updatedSubscribers;
                                } else {
                                    console.error("subscriber not found", data.subscriberTwitchUsername);
                                    return;
                                }
                            })
                            
                        } if (type === 'new_subscriber') {
                            setActiveSubscribers((prevSubscribers) => [...prevSubscribers, data]);
                        } if (type === 'resub') {
                            setActiveSubscribers((prevSubscribers) => {
                                const index = prevSubscribers.findIndex(sub => sub.subscriberTwitchUsername === data.subscriberTwitchUsername);
                                if (index === -1) {
                                    return [...prevSubscribers, data]
                                } else {
                                    return prevSubscribers;
                                }
                            });
                        }
                    }
                };

                ws.onclose = () => {
                    console.log('Websocket connection closed. Retrying in 1 seconds...');
                    ws.close();
                    setTimeout(() => initialize(), 1000);
                };

                ws.onerror = (error) => {
                    console.error('Error in Slideshow websocket:', error);
                    ws.close();
                }

                return () => {
                    ws.close();
                };
            } catch (error) {
                console.error("Error initializing websocket connection to SubSmash from Slideshow", error)
            }
        };


        if (!isReconnect) {
            initialize();
        }

    }, [hash, websocketUrl, setActiveSubscribers, isReconnect, apiUrl]);


    useEffect(() => {
        if (activeSubscribers.length > 0) {

            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSubscribers.length);
            }, slideDuration);

            return () => clearInterval(interval);
        }

    },[activeSubscribers.length, slideDuration])

    const currentSubscriber = useMemo(() => {
        return activeSubscribers[currentIndex]
    }, [currentIndex, activeSubscribers])

    const currentSubData = useMemo(() => {
        return {
            subscriber: currentSubscriber?.subscriberTwitchUsername,
            character: currentSubscriber?.characterName
        }
    }, [currentSubscriber]);

    const replaceTextPlaceholders = (text, data) => {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    };


    const currentFrame = useMemo(() => {
        if (!layout || !currentSubscriber) return null;
        return layoutElements.map(el => {
            if (el.type === 'text') {
                return {
                    ...el,
                    content: replaceTextPlaceholders(el.content, currentSubData)
                }

            }
            if (el.type === 'image') {
                if (el.id === 'layout_placeholder___62efa17d') {
                    return {
                        ...el,
                        url: currentSubscriber.imageUrl
                    }
                }
            }
            return el
        })
    }, [currentSubData, currentSubscriber, layout, layoutElements])

    
    if (activeSubscribers.length === 0 || !layout) {
        return;
    }

    return (
        <div className='slideshow-container'>
            <>
                {currentFrame && 
                <>
                {currentFrame.filter(el => el.type !== 'config')
                .map((element) => (
                    <Rnd
                id={element.id}
                key={element.id}
                disableDragging={true} 
                className='slideshow-element'
                position={{ x: element.position.x, y: element.position.y }}
                size={{ width: element.size.width, height: element.size.height }}
                enableResizing={false}
                style={{ zIndex: element.zIndex }}
                >
                {element.type === 'image' && 
                    <img 
                    src={element.url} 
                    alt={element.displayTitle} 
                    draggable='false' 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                }
                {element.type === 'text' && 
                <div 
                className='rnd-element-text-container'
                ><span 
                className='rnd-element-text'
                spellCheck={false}
                suppressContentEditableWarning={true} 
                style={{
                    display: 'flex',
                    width: '100%',
                    fontSize: `${element.fontSize}px`,
                    color: element.fontColor,
                    fontFamily: element.fontFamily,
                    fontWeight: element.fontWeight,
                    justifyContent: element.textAlign
                }} 
                >
                    {element.content}</span></div>}
                </Rnd>
                ))
                }
            </>
        }
    </>
        </div>
    )

}