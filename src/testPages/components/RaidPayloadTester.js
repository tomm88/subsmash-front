import React, { useState, useEffect } from 'react'
import raidTestRouteHandler from '../routeHandlers/raidTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const RaidPayloadTester = () => {
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null)
    const [raiderTwitchUsername, setRaiderTwitchUsername] = useState('');
    const [viewers, setViewers] = useState(0)

    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
        const _getSessionData = async () => {
            try {
                const sessionData = await getSessionData();
                console.log("Session data received in component is: ", sessionData)
                setStreamerDatabaseId(sessionData.data.streamerDatabaseId);
            } catch (error) {
                console.error('Error getting session data: ', error)
            }
        }
        _getSessionData()
    }, [])

    const sendDummyPayload = async () => {
        const payload = {
            from_broadcaster_user_name: raiderTwitchUsername,
            viewers
        };

        try {
            const response = await raidTestRouteHandler(payload, streamerDatabaseId);
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
        <h2>Simulate Raid</h2>
        <label>
            Raider Username:
            <input type="text" value={raiderTwitchUsername} onChange={(e) => setRaiderTwitchUsername(e.target.value)} />
        </label>
        <br />
        <label>
            Number of Viewers:
            <input type="number" min="1" value={viewers} onChange={(e) => setViewers(e.target.value)} />
        </label>
        <br />
        <button onClick={handleClick} disabled={loadingState}>{loadingState ? 'loading...' : 'Test Raid'}</button>
    </div>
  )
}

export default RaidPayloadTester;