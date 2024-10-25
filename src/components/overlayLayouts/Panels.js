import React, { useContext } from 'react'
import { Layers } from './Layers'
import { UserImages } from './UserImages'
import { UserSounds } from './UserSounds'
import { LayoutSettings } from './LayoutSettings'
import { LayoutContext } from './LayoutContext'

export const Panels = () => {
    const { selectedLayout } = useContext(LayoutContext);
  return (
    <div className='right-panels-container'>
        {selectedLayout.streamer_id !== 1 && <Layers />}
        <div className='image-sounds-settings-panels-container'>
        {selectedLayout.streamer_id !== 1 && <UserImages />}
        {selectedLayout.layout_type === 'alerts' && selectedLayout.streamer_id !== 1 && <UserSounds />}
        <LayoutSettings />
        </div>
    </div>
  )
}
