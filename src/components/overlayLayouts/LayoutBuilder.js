import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { LayoutContext } from './LayoutContext';
import '../../styles/overlayLayouts/layoutBuilder.css'

export const LayoutBuilder = () => {

  const { layoutElements, setLayoutElements, view, selectedLayout, selectedElementId, setSelectedElementId, backgroundColor } = useContext(LayoutContext);

  
  const [currentText, setCurrentText] = useState('');
  const [filteredElements, setFilteredElements] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isLayoutElement = layoutElements.some((element) => {
        const el = document.getElementById(element.id);
        return el && el.contains(event.target);
      });

      if (!isLayoutElement) {
        setSelectedElementId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [layoutElements, setSelectedElementId])

  const filterElements = useCallback(() => {
    const elements = layoutElements.filter(el => {
      if (selectedLayout.layout_type === 'alerts'){
        if (view === 'new_subscriber') {
          return el.conditions?.isForNewSubscriber;
        } else if (view === 'resub') {
          return el.conditions?.isForResubscription;
        } else if (view === 'gift_sub') {
          return el.conditions?.isForGiftSub;
        } else if (view === 'follower') {
          return el.conditions?.isForFollower;
        } else if (view === 'cheer') {
          return el.conditions?.isForCheer;
        } else if (view === 'raid') {
          return el.conditions?.isForRaid;
        }
        return false
      }
      return true
    })
    setFilteredElements(elements)
  }, [layoutElements, selectedLayout, view])

  useEffect(() => {
    filterElements()
  }, [filterElements, view])

  const updateElementPosition = (id, newPosition) => {
    setLayoutElements((prevElements) => 
      prevElements.map((element) => 
        element.id === id
        ? { ...element, position: { x: newPosition.x, y: newPosition.y } }
        : element
      )
    );
  };

  const updateElementSize = (id, newSize) => {
    setLayoutElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? { ...element, 
            size: { width: newSize.width, height: newSize.height },
          position: { x: newSize.x, y: newSize.y },
          }
          : element
      )
    );
  }

  const handleElementClick = (elementId) => {
    const element = layoutElements.find(el => el.id === elementId)
    if (selectedLayout.streamer_id !== 1 && !element.locked) {
      setSelectedElementId(elementId);
    }
  }

  const resizeHandleClasses = {
    bottom: "handle long-handle-horizontal bottom-handle",
    bottomLeft: "handle left-handle bottom-handle",
    bottomRight: "handle right-handle bottom-handle",
    left: "handle long-handle left-handle",
    right: "handle long-handle right-handle",
    top: "handle long-handle-horizontal top-handle",
    topLeft: "handle left-handle top-handle",
    topRight: "handle right-handle top-handle"
  }

  const handleTextInput = (e) => {
    if (e.target.textContent !== '') { 
      setCurrentText(e.target.textContent)
    } else {
      setCurrentText('enter text')
    }
  };

  const handleTextBlur = (id) => {
    setLayoutElements((prevElements) => 
      prevElements.map((element) => 
        element.id === id ? { ...element, content: currentText } : element
      )
    );
    setCurrentText('');
  };
  

  return (
    <div className='layout-builder-container' style={{backgroundColor: backgroundColor}}>
      {filteredElements
      .filter((element) => element.type !== 'config')
      .map((element) => (
        <Rnd
          id={element.id}
          key={element.id}
          className={`rnd-element rnd-element-resizable ${selectedElementId === element.id ? 'selected' : ''}`}
          position={{ x: element.position.x, y: element.position.y }}
          size={{ width: element.size.width, height: element.size.height }}
          resizeHandleClasses={selectedElementId === element.id ? resizeHandleClasses : ''}
          enableResizing={selectedElementId === element.id ? true : false}
          
          disableDragging={selectedLayout.streamer_id === 1 || element.locked}

          style={{ zIndex: element.zIndex }}
          onDragStop={(e, d) => updateElementPosition(element.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => 
            updateElementSize(element.id, {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            })
          }
          lockAspectRatio={element.type === 'image' ? true : false}
          onMouseDown={() => handleElementClick(element.id)}
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
          onMouseDown={(e) => {
            if (e.target.firstChild) {
              e.target.firstChild.focus();
            }
          }}
          ><span 
          className='rnd-element-text'
          contentEditable={selectedLayout.streamer_id !== 1 && !element.locked}
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
          onFocus={(e) => setCurrentText(e.currentTarget.textContent)}
          onInput={handleTextInput} 
          onBlur={() => handleTextBlur(element.id)}
          onMouseDown={(e) => {
            handleElementClick(element.id);
            e.stopPropagation();
          }}
          >
            {element.content}</span></div>}
        </Rnd>
      ))}
    </div>
  )
}
