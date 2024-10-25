import axios from 'axios';

export const savePrompt = async (prompt) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { prompt_name, prompt_data, id } = prompt;

    try {
        await axios.put(`${apiUrl}/db/prompts/savePrompt/${id}`, {
            prompt_name,
            prompt_data,
        })
        console.log("Prompt saved successfully")
    } catch (error) {
        console.error ("Error saving prompt", error)
    }
} 