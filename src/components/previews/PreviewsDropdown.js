import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PreviewsContext } from './PreviewsContext';

export const PreviewsDropdown = () => {

    const { layouts, handleSelectLayout, selectedLayout, alertPreviewIsShowing } = useContext(PreviewsContext)

    const initialLayout = JSON.parse(sessionStorage.getItem('selectedLayout'));
    const [sortedPresetLayouts, setSortedPresetLayouts] = useState([]);
    const [sortedUserLayouts, setSortedUserLayouts] = useState([]);

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

    const sortLayouts = useCallback(() => {
        const presets = layouts.filter(layout => layout.streamer_id === 1).sort((a, b) => a.id - b.id);
        setSortedPresetLayouts(presets);
        const users = layouts.filter(layout => layout.streamer_id !== 1).sort((a, b) => a.layout_name.toLowerCase().localeCompare(b.layout_name.toLowerCase()));
        setSortedUserLayouts(users);
    }, [layouts])

    useEffect(() => {
        sortLayouts()
    }, [sortLayouts])

  return (
    <div>
    <label htmlFor='promptSelect'>Select a Layout:</label>
    <select disabled={alertPreviewIsShowing} id='layoutSelect' value={selectedLayout?.id || ''} onChange={handleSelectFromDropdown}>
        <optgroup label="Presets">
            {sortedPresetLayouts.map((layout) => (
                <option key={layout.id} value={layout.id}>
                    {layout.layout_name}
                </option>
            ))}
        </optgroup>
        <optgroup label='My Layouts'>
            {sortedUserLayouts.map((layout) => (
                <option key={layout.id} value={layout.id}>
                    {layout.layout_name}
                </option>
            ))}
        </optgroup>
    </select>
</div>
  )
}
