import axios from 'axios';

export const uploadImages = async (formData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const images = await axios.post(`${apiUrl}/aws/uploadUserImages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        })
        return {
            message: 'Files uploaded successfully',
            data: images
        }

    } catch (error) {
        console.error('Error uploading files', error);
        return 'Error uploading files, please refresh the page and try again'
    }
}