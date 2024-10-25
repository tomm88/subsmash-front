import axios from 'axios';

export const saveLayout = async (layout, layoutElements) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { layout_name, id } = layout;

    try {
        await axios.put(`${apiUrl}/db/layouts/saveLayout/${id}`, {
            layout_name,
            layout_data: layoutElements
        });
        console.log('Layout saved successfully')
    } catch (error) {
        console.error('Error saving the layout', error)
    }
}