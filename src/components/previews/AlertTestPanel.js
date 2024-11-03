import React, { useContext, useState } from 'react'
import { PreviewsContext } from './PreviewsContext'
import { testTwitchEvent } from '../../httpRequests/testTwitchEvent'
import '../../styles/previews/alertTestPanel.css'

export const AlertTestPanel = () => {

    const { 
        alertTypeToTest, 
        handleTestAlertTypeChange, 
        setSubscriberForTestAlert, 
        alertDuration, 
        alertSoundUrl, 
        alertPreviewIsShowing, 
        liveTesting, 
        setLiveTesting,
        charName,
        imgSrc,
        layoutElements
    } = useContext(PreviewsContext)
    const [subscriberUsername, setSubscriberUsername] = useState('');
    const [gifterUsername, setGifterUsername] = useState('');
    const [numberSubsGifted, setNumberSubsGifted] = useState(1);
    const [monthsResubbed, setMonthsResubbed] = useState(1);
    const [resubMessage, setResubMessage] = useState('');
    const [tier, setTier] = useState(1);
    const [followerTwitchUsername, setFollowerTwitchUsername] = useState('');
    const [cheererTwitchUsername, setCheererTwitchUsername] = useState('');
    const [cheerMessage, setCheerMessage] = useState('');
    const [cheerAmount, setCheerAmount] = useState(1);
    const [raiderTwitchUsername, setRaiderTwitchUsername] = useState('');
    const [raidAmount, setRaidAmount] = useState(1);

    const handleSetTier = (userTier) => {
        let controlledTier = userTier;
        if (userTier > 3) {
            controlledTier = 3
        }
        setTier(controlledTier);
    }

    const handleSetMonths = (userMonths) => {
        let controlledMonths = userMonths;
        if (userMonths > 100) {
            controlledMonths = 100
        }
        setMonthsResubbed(controlledMonths);
    }

    const handleSetGiftedAmount = (userAmount) => {
        let controlledAmount = userAmount;
        if (userAmount > 100) {
            controlledAmount = 100
        }
        setNumberSubsGifted(controlledAmount);
    }

    const handleSetCheerAmount = (userAmount) => {
        let controlledAmount = userAmount;
        if (userAmount > 10000) {
            controlledAmount = 10000
        }
        setCheerAmount(controlledAmount);
    }

    const handleSetRaidAmount = (userAmount) => {
        let controlledAmount = userAmount;
        if (userAmount > 10000) {
            controlledAmount = 10000
        }
        setRaidAmount(controlledAmount);
    }

    const handleClickTestButton = async () => {
        const testSub = {
            type: alertTypeToTest,
            subscriberUsername,
            gifterUsername,
            numberSubsGifted,
            monthsResubbed,
            resubMessage,
            tier,
            alertDuration,
            alertSoundUrl,
            followerTwitchUsername,
            cheererTwitchUsername,
            cheerMessage,
            bits: cheerAmount,
            raiderTwitchUsername,
            viewers: raidAmount
        }
        setSubscriberForTestAlert(testSub);

        if (liveTesting) {
            const testData = {
                type: alertTypeToTest,
                subscriberTwitchUsername: subscriberUsername,
                gifterTwitchUsername: gifterUsername,
                tier,
                cumulativeMonths: monthsResubbed,
                numberOfGifts: numberSubsGifted,
                characterName: charName,
                imageUrl: imgSrc,
                message: resubMessage,      
                isTest: true,
                layoutElements        
            }
            await testTwitchEvent(testData);
        }
    }

  return (
    <>
        <div className='alerts-test-panel-container'>
        <h3>Test Your Alerts</h3>
        <div className='dropdown-and-test-button-container'>
            <select disabled={alertPreviewIsShowing} id='alert_type_select' value={alertTypeToTest} onChange={handleTestAlertTypeChange}>
                <option key={'new_subscriber'} value={'new_subscriber'}>
                    New Subscriber
                </option>
                <option key={'resub'} value={'resub'}>
                    Resubscription
                </option>
                <option key={'gift_sub'} value={'gift_sub'}>
                    Gift Subscriptions
                </option>
                <option key={'follower'} value={'follower'}>
                    Followers
                </option>
                <option key={'cheer'} value={'cheer'}>
                    Cheers
                </option>
                <option key={'raid'} value={'raid'}>
                    Raids
                </option>
            </select> 
            <button disabled={alertPreviewIsShowing} onClick={handleClickTestButton}>Test</button>
            </div>
            <div className='test-alert-inputs-container'>
                {(alertTypeToTest === 'new_subscriber' || alertTypeToTest === 'resub') && 
                <>
                <label className='test-alert-input-with-label'>
                    Subscriber Username:
                    <input 
                    id='subscriber-name-input' 
                    value={subscriberUsername}
                    onChange={(e) => setSubscriberUsername(e.target.value)}
                    />
                </label>
                <label className='test-alert-input-with-label'>
                    Tier:
                    <input 
                    id='subscriber-tier-input' 
                    type='number'
                    value={tier}
                    onChange={(e) => handleSetTier(parseInt(e.target.value))}
                    min="1" 
                    max="3" 
                    />
                </label>
                {alertTypeToTest === 'resub' && 
                <>
                    <label className='test-alert-input-with-label'>
                    Months:
                        <input 
                        id='subscriber-months-input' 
                        type='number'
                        value={monthsResubbed}
                        onChange={(e) => handleSetMonths(parseInt(e.target.value))}
                        min="1" 
                        max="100" 
                        />
                    </label>    
                    <label className='test-alert-input-with-label'>
                    Resub Message:
                        <textarea 
                        id='subscriber-resub-message-input' 
                        value={resubMessage}
                        onChange={(e) => setResubMessage(e.target.value)}
                        />
                    </label>   
                </>
                }
                </>}
                {alertTypeToTest === 'gift_sub' && 
                    <>
                    <label className='test-alert-input-with-label'>
                    Gifter Username:
                        <input 
                        id='gifter-name-input' 
                        value={gifterUsername}
                        onChange={(e) => setGifterUsername(e.target.value)}
                        />
                    </label>
                    <label className='test-alert-input-with-label'>
                    Tier:
                        <input 
                        id='gifted-tier-input' 
                        type='number'
                        value={tier}
                        onChange={(e) => handleSetTier(parseInt(e.target.value))}
                        min="1" 
                        max="3" 
                        />
                    </label>
                    <label className='test-alert-input-with-label'>
                    Subs Gifted:
                    <input 
                        id='subscriber-gifted-amount-input' 
                        type='number'
                        value={numberSubsGifted}
                        onChange={(e) => handleSetGiftedAmount(parseInt(e.target.value))}
                        min="1" 
                        max="100" 
                        />
                    </label>    
                    </>
                }
                {alertTypeToTest === 'follower' && 
                    <>
                    <label className='test-alert-input-with-label'>
                    Follower Username:
                        <input 
                        id='follower-name-input' 
                        value={followerTwitchUsername}
                        onChange={(e) => setFollowerTwitchUsername(e.target.value)}
                        />
                    </label> 
                    </>
                }
                {alertTypeToTest === 'cheer' && 
                    <>
                    <label className='test-alert-input-with-label'>
                    Cheerer Username:
                        <input 
                        id='cheerer-name-input' 
                        value={cheererTwitchUsername}
                        onChange={(e) => setCheererTwitchUsername(e.target.value)}
                        />
                    </label>
                    <label className='test-alert-input-with-label'>
                    Message:
                        <textarea 
                        id='cheer-message-input' 
                        value={cheerMessage}
                        onChange={(e) => setCheerMessage(e.target.value)}
                        />
                    </label>
                    <label className='test-alert-input-with-label'>
                    Amount Cheered:
                    <input 
                        id='cheer-amount-input' 
                        type='number'
                        value={cheerAmount}
                        onChange={(e) => handleSetCheerAmount(parseInt(e.target.value))}
                        min="1" 
                        max="10000" 
                        />
                    </label>    
                    </>
                }
                {alertTypeToTest === 'raid' && 
                    <>
                    <label className='test-alert-input-with-label'>
                    Raider Username:
                        <input 
                        id='raider-name-input' 
                        value={raiderTwitchUsername}
                        onChange={(e) => setRaiderTwitchUsername(e.target.value)}
                        />
                    </label>
                    <label className='test-alert-input-with-label'>
                    Viewers:
                        <input 
                        id='raid-viewers-input' 
                        type='number'
                        value={raidAmount}
                        onChange={(e) => handleSetRaidAmount(parseInt(e.target.value))}
                        min="1" 
                        max="10000" 
                        />
                    </label> 
                    </>
                }
            </div>
            <label>
                <input disabled={alertPreviewIsShowing} type='checkbox' checked={liveTesting} onChange={() => setLiveTesting(!liveTesting)}/>
                Test Live on Stream
            </label>
        </div>
    </>
  )
}
