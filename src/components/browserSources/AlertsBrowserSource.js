import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import { RenderAlert } from "./RenderAlert";
import { getActiveAlertsLayouts } from "../../httpRequests/getActiveAlertsLayouts";

export const AlertsBrowserSource = () => {

    const { hash } = useParams();
    const [alertQueue, setAlertQueue] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [allActiveLayouts, setAllActiveLayouts] = useState([])
    const [chosenLayoutElements, setChosenLayoutElements] = useState([])
    const [alertDuration, setAlertDuration] = useState(3);
    const [alertSoundUrl, setAlertSoundUrl] = useState('')
    const [isReconnect, setIsReconnect] = useState(false);
    const websocketUrl = process.env.REACT_APP_WS_URL;
    const apiUrl = process.env.REACT_APP_API_URL;


    const getLayouts = useCallback( async () => {
        const activeLayouts = await getActiveAlertsLayouts(hash);
        setAllActiveLayouts(activeLayouts)
    }, [hash]);

    useEffect(() => {
        getLayouts();
    }, [getLayouts]);

    const chooseLayout = useCallback((alert) => {   
        if (alert.data.isTest) {
            const layout = {
                id: 'test',
                layout_data: alert.data.layoutElements
            }
            return layout;
        }
        const alertConditionMap = {
            'new_subscriber': 'isNewSubscriberAlert',
            'resub': 'isResubscribeAlert',
            'gift_sub': 'isGiftSubAlert'
        };

        const alertCondition = alertConditionMap[alert.type];

        const filteredLayouts = allActiveLayouts.filter((layout) => {
            const config = layout.layout_data.find(el => el.type === 'config');
            return config && config.conditions[alertCondition]
        });

        if (filteredLayouts.length > 0) {
            const randomLayout = filteredLayouts[Math.floor(Math.random() * filteredLayouts.length)]
            return randomLayout;
        }

        return null;

    }, [allActiveLayouts])


    useEffect(() => {
        const initialize = () => {  
       
            try {
                const eventSubSubscriptions = async () => {
                    try {
                        await axios.post(`${apiUrl}/twitch/eventSub/alerts`, { hash });
                    } catch (error) {
                        console.error("Could not establish websocket connection for alerts", error);
                    }
                }

                const ws = new WebSocket(`${websocketUrl}?hash=${hash}`);
                
                ws.onopen = async () => {
                    console.log('Websocket connection open for Alerts');
                    await eventSubSubscriptions();
                    setIsReconnect(true);
                };

                ws.onmessage = (message) => {
                    console.log('in AlertsBrowserSource. Alert message received: ', message)
                    const { type, data } = JSON.parse(message.data);
                        setAlertQueue((prevQueue) => [...prevQueue, { type, data }]);
                };

                ws.onclose = () => {
                    console.log('Websocket connection closed. Retrying in 1 seconds...');
                    ws.close();
                    setTimeout(() => initialize(), 1000);
                };

                ws.onerror = (error) => {
                    console.error('Websocket error in Alerts:', error);
                    ws.close();
                };

                return () => {
                    ws.close();
                };

            } catch (error) {
                console.error("Error initializing websocket connection to SubSmash from Alerts", error)
            }
        };

        if (!isReconnect) {
            initialize();
        }
        
    }, [hash, websocketUrl, apiUrl, isReconnect]);

    useEffect(() => {
        if (alertQueue.length > 0 && !currentAlert && allActiveLayouts.length > 0) {
            const layout = chooseLayout(alertQueue[0]);
            console.log('chosen layout: ', layout)
            if(layout) {
                setChosenLayoutElements(layout.layout_data);
                const config = layout.layout_data.find(el => el.type === 'config');
                setAlertDuration(parseInt(config.duration) * 1000)
                setAlertSoundUrl(config.soundUrl)
            }
            setCurrentAlert(alertQueue[0]);
            setAlertQueue((prevQueue) => prevQueue.slice(1));

        }

        if (currentAlert) {
            const timer = setTimeout(() => {
                setCurrentAlert(null);
            }, alertDuration);

            return () => {
                clearTimeout(timer); 
                setChosenLayoutElements([]);
            }
        }
    }, [alertQueue, currentAlert, allActiveLayouts, chooseLayout, alertDuration, alertSoundUrl])


    return (
        <>
            {currentAlert && chosenLayoutElements.length > 0 && <RenderAlert currentAlert={currentAlert} layoutElements={chosenLayoutElements} alertSoundUrl={alertSoundUrl} />}
        </>
    )
}