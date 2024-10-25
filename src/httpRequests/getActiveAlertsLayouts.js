import axios from 'axios' 
const apiUrl = process.env.REACT_APP_API_URL;

export const getActiveAlertsLayouts = async (alertsHash) => {
    try {
        const alertsLayouts = await axios.get(`${apiUrl}/db/layouts/activeAlerts/${alertsHash}`);
        return alertsLayouts.data.alertsLayouts
    } catch (error) {
        console.error('Error getting alerts layout', error)
    }
};