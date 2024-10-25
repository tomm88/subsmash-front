import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const createNewLayout = async (layoutName, layoutType, layoutData) => {
    try {
        const newLayout = await axios.post(`${apiUrl}/db/layouts/create`, 
            { layoutName, layoutType, layoutData, active: false },
            { withCredentials: true }
        )
        return newLayout.data.newLayout
    } catch (error) {
        console.error ("Error adding new layout to database", error)
    }
}

export const editLayoutName = async (newLayoutName, id) => {
    try {
        const updatedLayout = await axios.put(`${apiUrl}/db/layouts/updateName/${id}`, { newLayoutName });
        return updatedLayout.data.newLayoutName
    } catch (error) {
        console.error('Error updating layout name', error)
    }
} 

export const deleteLayout = async (layoutId) => {
    try {
        await axios.delete(`${apiUrl}/db/layouts/delete/${layoutId}`)
        return
    } catch (error) {
        console.error('Error deleting layout', error)
    }
}

export const updateActiveStatus = async (layoutId, layoutType, newStatus) => {
    try {
        await axios.put(`${apiUrl}/db/layouts/active/${layoutId}`, {layoutType, newStatus}, {withCredentials: true});
        return;
    } catch (error) {
        console.error('Error setting active status', error);
    }
}