import React, { useState, useEffect } from 'react'
import giftSubTestRouteHandler from '../routeHandlers/giftSubTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const GiftSubPayloadTester = () => {
    const [streamerTwitchId, setStreamerTwitchId] = useState('');
    const [streamerUsername, setStreamerUsername] = useState('');
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null);
    const [gifterTwitchId, setGifterTwitchId] = useState('');
    const [gifterTwitchUsername, setGifterTwitchUsername] = useState('');
    const [numberOfGifts, setNumberOfGifts] = useState(1)
    const [tier, setTier] = useState('1000');

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
            user_id: gifterTwitchId,
            user_name: gifterTwitchUsername,
            broadcaster_user_id: streamerTwitchId,
            broadcaster_user_name: streamerUsername,
            total: numberOfGifts,
            tier,
        };

        try {
            const response = await giftSubTestRouteHandler(payload, streamerDatabaseId);
            console.log('Gift sub payload sent successfully: ', response.data)
        }
        catch (error) {
            console.error('Error delivering resub payload: ', error)
        }
    }
    

  return (
    <div>
        <h2>Simulate Gift Subscription</h2>
        <label>
            Gifter ID:
            <input type="text" value={gifterTwitchId} onChange={(e) => setGifterTwitchId(e.target.value)} />
        </label>
        <br />
        <label>
            Gifter Username:
            <input type="text" value={gifterTwitchUsername} onChange={(e) => setGifterTwitchUsername(e.target.value)} />
        </label>
        <br />
        <label>
            Number of Gift Subs:
            <input type="number" min="1" value={numberOfGifts} onChange={(e) => setNumberOfGifts(e.target.value)} />
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
        <button onClick={sendDummyPayload}>Test Gift Subscription</button>
    </div>
  )
}

export default GiftSubPayloadTester;