import React, { useState, useEffect } from 'react'
import NewSubscriberPayloadTester from '../components/NewSubscriberPayloadTester'
import ResubPayloadTester from '../components/ResubPayloadTester'
import GiftSubPayloadTester from '../components/GiftSubPayloadTester'
import { checkAuth } from '../../httpRequests/checkAuth'

const TwitchEventTestsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState('new_subscriber')

  useEffect(() => {
    const checkSession = async () => {
        try {
            const authenticated = await checkAuth();
            if (!authenticated){
              alert("not authorized")
              window.location.href = '/';
            } 
        } catch(error) {
            console.error("Error checking session: ", error)
        }              
    }
    checkSession();
}, []);

  const renderTesterComponent = () => {
    switch (selectedEvent) {
      case 'new_subscriber':
        return <NewSubscriberPayloadTester />;
      case 'resub':
        return <ResubPayloadTester />;
      case 'gift_Sub':
        return <GiftSubPayloadTester />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Twitch Event Test Page</h1>
      <label>
        Select Event Type:
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value={'new_subscriber'}>New Subscriber</option>
          <option value={'resub'}>Resubscription</option>
          <option value={'gift_Sub'}>Gift Subscription</option>
        </select>
      </label>
      <div>
        {renderTesterComponent()}
      </div>
    </div>
  )
}

export default TwitchEventTestsPage;