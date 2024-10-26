import React, { useState } from 'react';
import { useStreamerHashes } from '../../hooks/useStreamerHashes';
import '../../styles/dashboard/urlBox.css'

export const CopyUrlBox = () => {
  const { slideshowUrl, alertsUrl } = useStreamerHashes();
  const [copiedUrl, setCopiedUrl] = useState(null);
  
  const copyUrl = (url, type) => {
    navigator.clipboard.writeText(url).then(() => {
        setCopiedUrl(type);
        setTimeout(() => {
          setCopiedUrl(null);
        }, 1500);
    })
}
  return (
    <div className='url-container'>
      <h4>OBS Broswer Sources</h4>
      <h4>Slideshow URL
      <input type="text" value={slideshowUrl} readOnly />
      <button 
        className={`copy-button ${copiedUrl === 'slideshow' ? 'copied' : ''}`}
        onClick={() => copyUrl(slideshowUrl, 'slideshow')}>
        {copiedUrl === 'slideshow' ? 'Copied ✓' : 'Copy'}
      </button>
      </h4>
      <h4>Alerts URL
      <input type="text" value={alertsUrl} readOnly />
      <button 
        className={`copy-button ${copiedUrl === 'alerts' ? 'copied' : ''}`}
        onClick={() => copyUrl(alertsUrl, 'alerts')}>
        {copiedUrl === 'alerts' ? 'Copied ✓' : 'Copy'}
      </button>
      </h4>
    </div>
  )
}