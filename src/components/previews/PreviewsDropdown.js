import React, { useCallback, useContext, useEffect } from 'react'
import { PreviewsContext } from './PreviewsContext';

export const PreviewsDropdown = () => {

    const { layouts, handleSelectLayout, selectedLayout, alertPreviewIsShowing } = useContext(PreviewsContext)

    const initialLayout = JSON.parse(sessionStorage.getItem('selectedLayout'));

    const setInitialLayout = useCallback(() => {
        handleSelectLayout(initialLayout);
    }, [handleSelectLayout, initialLayout])

    useEffect(() => {
        if (Object.keys(selectedLayout).length === 0) {
            setInitialLayout();
        }
    }, [selectedLayout, setInitialLayout])

    const handleSelectFromDropdown = (e) => {
        const layoutId = e.target.value;
        const selected = layouts.find((layout) => layout.id === parseInt(layoutId));
        handleSelectLayout(selected);
    }

  return (
    <div>
    <label htmlFor='promptSelect'>Select a Layout:</label>
    <select disabled={alertPreviewIsShowing} id='layoutSelect' value={selectedLayout?.id || ''} onChange={handleSelectFromDropdown}>
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
