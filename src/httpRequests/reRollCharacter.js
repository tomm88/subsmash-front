import axios from "axios";

export const reRollCharacter = async (subscriberTwitchUsername) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${apiUrl}/openai/reRollCharacter`, 
            {subscriberTwitchUsername},
            { withCredentials: true }
        );
        return response
    } catch(error) {
        alert("An error occured creating the character. Please refresh the page and try again")
        console.error(error, "There was an error re-rolling the character")
    }
}