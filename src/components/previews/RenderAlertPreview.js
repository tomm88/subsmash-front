import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Rnd } from "react-rnd";
import { PreviewsContext } from "./PreviewsContext";

export const RenderAlertPreview = () => {
    const { subscriberForTestAlert, setSubscriberForTestAlert, layoutElements, setAlertPreviewIsShowing, charName, imgSrc } = useContext(PreviewsContext);

    const audioRef = useRef(null);

    const currentSubData = useMemo(() => {
        return {
            subscriber: subscriberForTestAlert?.subscriberUsername,
            character: charName,
            gifter: subscriberForTestAlert?.gifterUsername,
            giftAmount: subscriberForTestAlert?.numberSubsGifted,
            months: subscriberForTestAlert?.monthsResubbed,
            resubMessage: subscriberForTestAlert?.resubMessage,
            tier: subscriberForTestAlert?.tier,
            follower: subscriberForTestAlert?.followerTwitchUsername || '',
            cheerer: subscriberForTestAlert?.cheererTwitchUsername || '',
            cheerMessage: subscriberForTestAlert?.cheerMessage || '',
            cheerAmount: subscriberForTestAlert?.bits || '',
            raider: subscriberForTestAlert?.raiderTwitchUsername || '',
            raidAmount: subscriberForTestAlert?.viewers || ''
        }
    }, [subscriberForTestAlert, charName]);

    const replaceTextPlaceholders = (text, data) => {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    };

    const currentFrame = useMemo(() => {
        // Map alert types to their corresponding condition keys
        const alertConditionMap = {
            'new_subscriber': 'isForNewSubscriber',
            'resub': 'isForResubscription',
            'gift_sub': 'isForGiftSub',
            'follower': 'isForFollower',
            'cheer': 'isForCheer',
            'raid': 'isForRaid'
        };
    
        const alertCondition = alertConditionMap[subscriberForTestAlert.type]; // Get the condition for the current alert
    
        return layoutElements.filter(el => {
            //filter out the elements that are not for the current alert type
            if (alertCondition && !el.conditions[alertCondition]) {
                return false;
            }
            return true;
        }).map(el => {
            // For text elements, replace the variables with the proper values
            if (el.type === 'text') {
                return {
                    ...el,
                    content: replaceTextPlaceholders(el.content, currentSubData)
                };
            }
    
            if (el.id === 'layout_placeholder___62efa17d') {
                return {
                    ...el,
                    url: imgSrc // Update the placeholder image URL
                };
            }   

            return el; // Return unchanged elements
        });
    }, [currentSubData, layoutElements, imgSrc, subscriberForTestAlert]);
    

    useEffect(() => {
        if (subscriberForTestAlert) {
            setAlertPreviewIsShowing(true)
            if (subscriberForTestAlert.alertSoundUrl && subscriberForTestAlert.alertSoundUrl !== 'no sound') {
                console.log('how many?')
                audioRef.current = new Audio(subscriberForTestAlert.alertSoundUrl);
                audioRef.current.play();
            }
            const timer = setTimeout(() => {
                if (audioRef.current !== null) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
                setSubscriberForTestAlert(null);
            }, subscriberForTestAlert.alertDuration);

            return () => {
                audioRef.current = null;
                clearTimeout(timer); 
                setAlertPreviewIsShowing(false)
            }
        }
    }, [setAlertPreviewIsShowing, setSubscriberForTestAlert, subscriberForTestAlert])

    if (!subscriberForTestAlert) return null;



  return (
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
  )
}
