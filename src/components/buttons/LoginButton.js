import React from 'react'
import {images} from '../../assets/images'

const LoginButton = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/twitchUriRedirect`;
  }

  return (
    <button className='homepage-login-button' onClick={handleLogin}>
      <img src={images.twitchLogo} className='login-button-twitch-logo' alt='twitch-logo' />
      <span>Login with Twitch</span></button>
  )
}

export default LoginButton