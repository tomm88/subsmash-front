import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const updateActiveStatus = async (promptId, isActive) => {

    try {
        await axios.put(`${apiUrl}/db/prompts/active/${promptId}`, 
            { isActive },
            { withCredentials: true }
        )

    } catch (error) {
        console.error("Error updating Active status", error)
    }
}

export const createNewPrompt = async (promptName, promptData) => {
    try {
        const newPrompt = await axios.post(`${apiUrl}/db/prompts/create`, 
            { promptName, promptData },
            { withCredentials: true }
        )
        return newPrompt.data.newPrompt
    } catch (error) {
        console.error ("Error adding new prompt to database", error)
    }
}

export const deletePrompt = async (promptId) => {
    try {
        await axios.delete(`${apiUrl}/db/prompts/delete`, { 
                data: { promptId },
                withCredentials: true
        });
    } catch (error) {
        console.error("Error deleting prompt", error)
    }
}

export const savePromptName = async (promptId, newPromptName) => {
    try {
        await axios.put(`${apiUrl}/db/prompts/updateName/${promptId}`, 
            {newPromptName}
        )
    } catch (error) {
        console.error("Error updating prompt name", error)
    }
}