import React, { useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";

export const RenderAlert = ({ currentAlert, layoutElements }) => {

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

    const imageUrl = currentAlert.data.imageUrl
    let imgSrc = imageUrl
    if (imageUrl === 'subNotFound___123.png') {
        imgSrc = process.env.REACT_APP_API_URL + '/' + imageUrl
    }

    const currentSubData = useMemo(() => {
        return {
            subscriber: currentAlert?.data.subscriberTwitchUsername || '',
            character: currentAlert?.data.characterName || '',
            gifter: currentAlert?.data.gifterTwitchUsername || '',
            giftAmount: currentAlert?.data.numberOfGifts || '',
            months: currentAlert?.data.cumulativeMonths || '',
            tier: currentAlert?.data.tier || '',
            resubMessage: currentAlert?.data.resubMessage || '',
            follower: currentAlert?.data.followerTwitchUsername || '',
            cheerer: currentAlert?.data.cheererTwitchUsername || '',
            cheerMessage: currentAlert?.data.cheerMessage || '',
            cheerAmount: currentAlert?.data.bits || '',
            raider: currentAlert?.data.raiderTwitchUsername || '',
            raidAmount: currentAlert?.data.viewers || ''
        }
    }, [currentAlert]);

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
    
        const alertCondition = alertConditionMap[currentAlert.type]; // Get the condition for the current alert
    
        return layoutElements.filter(el => {
            if (alertCondition && !el.conditions[alertCondition]) {
                return false;
            }
            return true;
        })
        .map(el => {
            // For text elements, replace user variables with actual data from event
            if (el.type === 'text') {
                return {
                    ...el,
                    content: replaceTextPlaceholders(el.content, currentSubData)
                };
            }
    
            // For image elements, check if it's the placeholder image and replace it with actual user image if so
            if (el.type === 'image') {
                if (el.id === 'layout_placeholder___62efa17d') {
                    return {
                        ...el,
                        url: imgSrc // Update the placeholder image URL
                    };
                }
            }
    
            return el; // Return unchanged elements
        });
    }, [currentSubData, layoutElements, imgSrc, currentAlert]);
    

    if (!currentAlert) return null;

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
};