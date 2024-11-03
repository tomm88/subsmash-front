import React, { useState, useEffect } from 'react'
import followTestRouteHandler from '../routeHandlers/followTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const FollowPayloadTester = () => {
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null)
    const [followerTwitchUsername, setFollowerTwitchUsername] = useState('');

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
            followerTwitchUsername,
        };

        try {
            const response = await followTestRouteHandler(payload, streamerDatabaseId);
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
        <h2>Simulate New Follower</h2>
        <label>
            Follower Username:
            <input type="text" value={followerTwitchUsername} onChange={(e) => setFollowerTwitchUsername(e.target.value)} />
        </label>
        <br />
        <button onClick={handleClick} disabled={loadingState}>{loadingState ? 'loading...' : 'Test New Follower'}</button>
    </div>
  )
}

export default FollowPayloadTester;