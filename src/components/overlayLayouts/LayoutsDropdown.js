import React, { useContext } from 'react'
import { LayoutContext } from './LayoutContext'

export const LayoutsDropdown = () => {
    const { selectedLayout, handleSelectLayout, layouts } = useContext(LayoutContext);

    const handleSelectFromDropdown = (e) => {
        const layoutId = e.target.value;
        const selected = layouts.find((layout) => layout.id === parseInt(layoutId));
        handleSelectLayout(selected);
    }

  return (
    <div>
        <label htmlFor='promptSelect'>Select a Layout:</label>
        <select id='layoutSelect' value={selectedLayout?.id || ''} onChange={handleSelectFromDropdown}>
            <optgroup label="Presets">
                {layouts.filter(layout => layout.streamer_id === 1).map((layout) => (
                    <option key={layout.id} value={layout.id}>
                        {layout.layout_name}
                    </option>
                ))}
            </optgroup>
            <optgroup label='My Layouts'>
                {layouts.filter(layout => layout.streamer_id !== 1).map((layout) => (
                    <option key={layout.id} value={layout.id}>
                        {layout.layout_name}
                    </option>
                ))}
            </optgroup>
        </select>
    </div>
  )
}
