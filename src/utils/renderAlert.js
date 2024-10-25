import templateImage from '../assets/images/slideshowTemplate.png'
import '../styles/alertBox.css'

export const renderAlert = (currentAlert) => {
    if (!currentAlert) return null;

    //Set parameters for the alert to be rendered based on the currentAlert object passed as an argument
    const imageUrl = currentAlert.data.imageUrl
    let tierMessage = '';
    if (currentAlert.data.tier === '2000') {tierMessage = ' at tier 2'};
    if (currentAlert.data.tier === '3000') {tierMessage = ' at tier 3'};
    let message = '';
    let username = currentAlert.data.subscriberTwitchUsername;
    if (currentAlert.type === 'new_subscriber') { message = `subscribed${tierMessage}!` }
    if (currentAlert.type === 'gift_sub') { message = `gifted ${currentAlert.data.numberOfGifts} subs${tierMessage}!`; username = currentAlert.data.gifterTwitchUsername }
    if (currentAlert.type === 'resub') { message = `resubscribed for ${currentAlert.data.cumulativeMonths} months${tierMessage}!` } 
    if (currentAlert.type === 'reroll') { message = 'rerolled their character!' }
    if (currentAlert.type === 'follow') { message = 'followed!'; username = currentAlert.data.followerTwitchUsername }

    let imgSrc = imageUrl
    if (imageUrl === 'subNotFound___123.png') {
        imgSrc = process.env.REACT_APP_API_URL + '/' + imageUrl
    }

    return (
        <>
        <div className="alert-container">
            <img src={templateImage} alt='Template' className='alert-template' />
            <div className='subscriber-name'><p className='bold'>{username}</p></div>
            <img src={`${imgSrc}`} alt={currentAlert.data.characterName} className='character-image'/>
            <div className='character-name'><p className='bold'>{currentAlert.data.characterName}</p></div>
        </div>
        <div className='subscribe-message'><p className='message-text'>{username} {message}</p></div>
        </>
    )
};