import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PreviewsContext } from './PreviewsContext'
import { Rnd } from 'react-rnd';
const apiUrl = process.env.REACT_APP_API_URL;

export const RenderSlideshowPreview = () => {
    const { subscribers, selectedLayout } = useContext(PreviewsContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const subsWithChars = useMemo(() => {
        const displaySubs = subscribers.filter(sub => sub.characterName !== 'No character name');
        if (displaySubs.length < 3) {
            const fillerSubs = [
                {subscriberTwitchUsername: 'subscriber 1', characterName: 'Arman Kahlil', imageUrl: `${apiUrl}/Arman Kahlil___96369804cca8fef22607.png`}, 
                {subscriberTwitchUsername: 'subscriber 2', characterName: 'Mystara Shadowleaf', imageUrl: `${apiUrl}/Mystara Shadowleaf___eb8f21f72333df8a1ecd.png`}, 
                {subscriberTwitchUsername: 'subscriber 3', characterName: 'Talon Earthshaper', imageUrl: `${apiUrl}/Talon Earthshaper___c81b8f2a3cd3fe2e1e61.png`}
            ]

            for(let i=0; i<3; i++) {
                if (!displaySubs[i]) {
                    displaySubs.push(fillerSubs[i])
                }
            }
        }

        return displaySubs;

    }, [subscribers]) 

    const currentSubscriber = useMemo(() => {
        return subsWithChars[currentIndex]
    }, [currentIndex, subsWithChars])

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
        if (!selectedLayout || !currentSubscriber) return null;
        return selectedLayout.layout_data.map(el => {
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
    }, [currentSubData, currentSubscriber, selectedLayout])

    const duration = useCallback(() => {
        const config = selectedLayout?.layout_data.find(el => el.type === 'config')
        return config.duration * 1000 || 3000
    }, [selectedLayout?.layout_data])

    useEffect(() => {
        if (subsWithChars.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % subsWithChars.length);
            }, duration()); 

            return () => clearInterval(interval);
        }

    },[subsWithChars.length, duration])

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
          className='preview-element'
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
