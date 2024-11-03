import React, { useState, useEffect } from 'react'
import cheerTestRouteHandler from '../routeHandlers/cheerTestRouteHandler';
import getSessionData from '../routeHandlers/getSessionData';

const CheerPayloadTester = () => {
    const [streamerDatabaseId, setStreamerDatabaseId] = useState(null)
    const [cheererTwitchUsername, setCheererTwitchUsername] = useState('');
    const [cheerMessage, setCheerMessage] = useState('');
    const [bits, setBits] = useState(0)

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
            user_name: cheererTwitchUsername,
            message: cheerMessage,
            bits
        };

        try {
            const response = await cheerTestRouteHandler(payload, streamerDatabaseId);
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
        <h2>Simulate New Cheer</h2>
        <label>
            Cheerer Username:
            <input type="text" value={cheererTwitchUsername} onChange={(e) => setCheererTwitchUsername(e.target.value)} />
        </label>
        <br />
        <label>
            Cheer Message:
            <input type="text" value={cheerMessage} onChange={(e) => setCheerMessage(e.target.value)} />
        </label>
        <br />
        <label>
            Number of Bits:
            <input type="number" min="1" value={bits} onChange={(e) => setBits(e.target.value)} />
        </label>
        <br />
        <button onClick={handleClick} disabled={loadingState}>{loadingState ? 'loading...' : 'Test Cheer'}</button>
    </div>
  )
}

export default CheerPayloadTester;