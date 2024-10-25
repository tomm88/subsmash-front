import React, { useState, useEffect, useCallback } from 'react'
import resubTestRouteHandler from '../routeHandlers/resubTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const ResubPayloadTester = () => {
    const [streamerTwitchId, setStreamerTwitchId] = useState('');
    const [streamerUsername, setStreamerUsername] = useState('');
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null);
    const [subscriberTwitchId, setSubscriberTwitchId] = useState('');
    const [subscriberTwitchUsername, setSubscriberTwitchUsername] = useState('');
    const [cumulativeMonths, setCumulativeMonths] = useState(1)
    const [tier, setTier] = useState('1000');
    const [message, setMessage] = useState({text: '', emotes: ''})
    const [messageText, setMessageText] = useState('')

    useEffect(() => {
        const _getSessionData = async () => {
            try {
                const sessionData = await getSessionData();
                console.log("Session data received in component is: ", sessionData)
                setStreamerTwitchId(sessionData.data.streamerTwitchId);
                setStreamerUsername(sessionData.data.streamerUsername);
                setStreamerDatabaseId(sessionData.data.streamerDatabaseId);
            } catch (error) {
                console.error('Error getting session data: ', error)
            }
        }
        _getSessionData()
    }, [])

    const handleSetMessage = useCallback(() => {
        const fullMessage = {
            text: messageText,
            emotes: ''
        }
        setMessage(fullMessage)
    }, [messageText])

    useEffect(() => {
        handleSetMessage()
    }, [messageText, handleSetMessage])

    const sendDummyPayload = async () => {
        const payload = {
            user_id: subscriberTwitchId,
            user_name: subscriberTwitchUsername,
            broadcaster_user_id: streamerTwitchId,
            broadcaster_user_name: streamerUsername,
            cumulative_months: cumulativeMonths,
            tier,
            message
        };

        try {
            const response = await resubTestRouteHandler(payload, streamerDatabaseId);
            console.log('Resub payload sent successfully: ', response.data)
        }
        catch (error) {
            console.error('Error delivering resub payload: ', error)
        }
    }
    

  return (
    <div>
        <h2>Simulate Resubscription</h2>
        <label>
            Subscriber ID:
            <input type="text" value={subscriberTwitchId} onChange={(e) => setSubscriberTwitchId(e.target.value)} />
        </label>
        <br />
        <label>
            Subscriber Username:
            <input type="text" value={subscriberTwitchUsername} onChange={(e) => setSubscriberTwitchUsername(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
            Months Subscribed:
            <input type="number" min="1" value={cumulativeMonths} onChange={(e) => setCumulativeMonths(e.target.value)} />
        </label>
        <br />
        <label>
            Tier:
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="1000">1</option>
                <option value="2000">2</option>
                <option value="3000">3</option>
            </select>
        </label>
        <br />
        <label>
            Subscription Message:
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        </label>
        <br />
        <button onClick={sendDummyPayload}>Test Resubscription</button>
    </div>
  )
}

export default ResubPayloadTester;