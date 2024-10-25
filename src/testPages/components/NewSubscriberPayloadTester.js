import React, { useState, useEffect } from 'react'
import newSubscriberTestRouteHandler from '../routeHandlers/newSubscriberTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const NewSubscriberPayloadTester = () => {
    const [streamerTwitchId, setStreamerTwitchId] = useState('');
    const [streamerUsername, setStreamerUsername] = useState('');
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null)
    const [subscriberTwitchId, setSubscriberTwitchId] = useState('')
    const [subscriberTwitchUsername, setSubscriberTwitchUsername] = useState('');
    const [tier, setTier] = useState('1000');

    const [loadingState, setLoadingState] = useState(false);

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

    const sendDummyPayload = async () => {
        const payload = {
            user_id: subscriberTwitchId,
            user_name: subscriberTwitchUsername,
            broadcaster_user_id: streamerTwitchId,
            broadcaster_user_name: streamerUsername,
            tier,
            is_gift: false
        };

        try {
            const response = await newSubscriberTestRouteHandler(payload, streamerDatabaseId);
            return response.data
        }
        catch (error) {
            console.error('Error delivering payload: ', error)
        }
    }

    const handleClick = async () => {
        setLoadingState(true);
        try{
            await sendDummyPayload();
        } catch (error) {
            console.error('Error in handleClick:', error);
        } finally {
            setLoadingState(false)
        }
    }
    

  return (
    <div>
        <h2>Simulate New Subscriber</h2>
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
        <label>
            Tier:
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="1000">1</option>
                <option value="2000">2</option>
                <option value="3000">3</option>
            </select>
        </label>
        <br />
        <button onClick={handleClick} disabled={loadingState}>{loadingState ? 'loading...' : 'Test New Subscriber'}</button>
    </div>
  )
}

export default NewSubscriberPayloadTester;