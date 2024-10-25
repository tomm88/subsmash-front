import React, { useCallback, useEffect, useState } from 'react';
import { checkAuth } from '../../httpRequests/checkAuth';
import { useGetStreamerTwitchData } from '../../hooks/useGetStreamerTwitchData';
import { getAllUsers } from '../../httpRequests/getAllUsers';
import { updateUserPermissions } from '../../httpRequests/updateUserPermissions';
import '../../styles/admin.css'

export const Admin = () => {

  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streamers, setStreamers] = useState([]);
  const [selectedStreamer, setSelectedStreamer] = useState(0);
  const [selectedStreamerHasAccess, setSelectedStreamerHasAccess] = useState(false);
  const [selectedStreamerIsAdmin, setSelectedStreamerIsAdmin] = useState(false);
  const [saving, setSaving] = useState({
    userPermissions: false
  })
  const [saveSuccessful, setSaveSuccessful] = useState({
    userPermissions: false
  })

  const { isAdmin } = useGetStreamerTwitchData();

    //Check if user is authenticated on page load
    useEffect(() => {
      const checkSession = async () => {
          try {
              const authenticated = await checkAuth();
              if (authenticated){
              setHasSession(true);
              setLoading(false);
              } else {
                  alert("no access token found")
                  window.location.href = '/';
              }
              
          } catch(error) {
              console.error("Error checking session: ", error)
          }              
      }
      checkSession();
  }, []);

  const getStreamers = useCallback(async () => {
    const response = await getAllUsers();
    if (response.length > 0) {
      setStreamers(response);
      setSelectedStreamer(response[0].twitch_username);
      setSelectedStreamerHasAccess(response[0].is_approved);
      setSelectedStreamerIsAdmin(response[0].is_admin);
    }
  }, [])

  useEffect(() => {
    getStreamers();
  }, [getStreamers])

  const handleSelectStreamer = (e) => {
    setSelectedStreamer(e.target.value)
    const streamer = streamers.find(st => st.twitch_username === e.target.value);
    setSelectedStreamerHasAccess(streamer.is_approved);
    setSelectedStreamerIsAdmin(streamer.is_admin);
  }

  const changeUserAccess = () => {
    setSelectedStreamerHasAccess(!selectedStreamerHasAccess)
  }

  const changeUserAdminStatus = () => {
    setSelectedStreamerIsAdmin(!selectedStreamerIsAdmin)
  }

  const handleSaveClick = async (sectionName) => {
    setSaving({
      ...saving,
      [sectionName]: true
    })

    await updateUserPermissions(selectedStreamer, selectedStreamerHasAccess, selectedStreamerIsAdmin);

    setSaving({
      ...saving,
      [sectionName]: false
    })

    setSaveSuccessful({
      ...saveSuccessful,
      [sectionName]: true
    })

    setTimeout(() => {
      setSaveSuccessful({
        ...saveSuccessful,
        [sectionName]: false
      })
    }, 1000)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasSession) {
    window.location.href = '/';
}  

  if (!isAdmin) {
    return <div>Not Authorized</div>
  }

  return (
    <div className='admin-section-divider'>
      <div>
      <div className='heading-and-dropdown-container'>
      <h3>User Permissions</h3>
      <select 
      id='admin-user-select' 
      value={selectedStreamer || 'hello'}
      onChange={handleSelectStreamer}
      >
        {streamers.map(streamer => (
          <option key={streamer.twitch_username} value={streamer.twitch_username}>{streamer.twitch_username}</option>
        ))}
      </select>    
      </div>
      <div className='user-permissions-options-container'>
        <label>
        <input type='checkbox' checked={selectedStreamerHasAccess} onChange={changeUserAccess}/>
        User has access
        </label>
        <label>
        <input type='checkbox' checked={selectedStreamerIsAdmin} onChange={changeUserAdminStatus}/>
        User is Admin
        </label>
      </div>  
      </div>
      <div className='admin-save-button-container'>
        <button 
        className={`save-button ${saveSuccessful.userPermissions ? 'save-success' : ''}`} 
        onClick={() => handleSaveClick('userPermissions')}
        disabled={saving.userPermissions}
        >
          {saving.userPermissions ? 'Saving...' : saveSuccessful.userPermissions ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
