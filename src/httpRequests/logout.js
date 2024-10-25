import axios from 'axios';

export const logout = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    await axios.post(`${apiUrl}/twitch/logout`, {}, { withCredentials: true })
    .then(response => {
        window.location.href = response.data.redirectUrl;
    })
    .catch(error => {
        console.error('Error logging out: ', error)
    })
}