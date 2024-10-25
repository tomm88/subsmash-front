import React, { useContext, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import { PreviewsContext } from "./PreviewsContext";

export const RenderAlertPreview = () => {
    const { subscriberForTestAlert, setSubscriberForTestAlert, layoutElements, setAlertPreviewIsShowing, charName, imgSrc } = useContext(PreviewsContext);

    const currentSubData = useMemo(() => {
        return {
            subscriber: subscriberForTestAlert?.subscriberUsername,
            character: charName,
            gifter: subscriberForTestAlert?.gifterUsername,
            amount: subscriberForTestAlert?.numberSubsGifted,
            months: subscriberForTestAlert?.monthsResubbed,
            message: subscriberForTestAlert?.resubMessage,
            tier: subscriberForTestAlert?.tier
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
        };
    
        const alertCondition = alertConditionMap[subscriberForTestAlert.type]; // Get the condition for the current alert
    
        return layoutElements.map(el => {
            // For text elements, check the corresponding condition dynamically
            if (el.type === 'text') {
                if (alertCondition && !el.conditions[alertCondition]) {
                    return {
                        ...el,
                        content: '' // Hide element if condition is false
                    };
                }
                return {
                    ...el,
                    content: replaceTextPlaceholders(el.content, currentSubData)
                };
            }
    
            // For image elements, check the corresponding condition dynamically
            if (el.type === 'image') {
                if (alertCondition && !el.conditions[alertCondition]) {
                    return {
                        ...el,
                        url: '' // Hide image if condition is false
                    };
                }
                if (el.id === 'layout_placeholder___62efa17d') {
                    return {
                        ...el,
                        url: imgSrc // Update the placeholder image URL
                    };
                }
            }
    
            return el; // Return unchanged elements
        });
    }, [currentSubData, layoutElements, imgSrc, subscriberForTestAlert]);
    

    useEffect(() => {
        if (subscriberForTestAlert) {
            setAlertPreviewIsShowing(true)
            const timer = setTimeout(() => {
                setSubscriberForTestAlert(null);
            }, subscriberForTestAlert.alertDuration);

            return () => {
                clearTimeout(timer); 
                setAlertPreviewIsShowing(false)
            }
        }
    })

    useEffect(() => {
        if (subscriberForTestAlert.alertSoundUrl) {
            const alertSound = new Audio(subscriberForTestAlert.alertSoundUrl);
            alertSound.play();
        }
    }, [subscriberForTestAlert.alertSoundUrl])

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
                    <img src={element.url} alt={element.displayTitle} draggable='false' />
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
