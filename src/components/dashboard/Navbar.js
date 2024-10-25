import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetStreamerTwitchData } from '../../hooks/useGetStreamerTwitchData';
import { logout } from '../../httpRequests/logout';
import '../../styles/dashboard/navbar.css';

export const Navbar = () => {
    const { streamerProfilePic, streamerTwitchUsername, isAdmin } = useGetStreamerTwitchData();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    useEffect(() => {
        const handleClickAnywhere = () => {
            if (dropdownVisible) {
                setDropdownVisible(false)
            }
        };

        document.addEventListener('mousedown', handleClickAnywhere);

        return () => {
            document.removeEventListener('mousedown', handleClickAnywhere);
        }
    }, [dropdownVisible])

    return (
        <div className="navbar">
            <div className="logo">SubSmash</div>
            <div className="navbar-right">
                <div className="username" onClick={toggleDropdown}>{streamerTwitchUsername}</div>
                <img 
                    src={streamerProfilePic} 
                    alt="User profile" 
                    className="profile-image" 
                    onClick={toggleDropdown}
                />

                    <div className={`dropdown-menu ${dropdownVisible ? 'open' : ''}`}>
                        {/* <Link to='/dashboard/my-account'>My Account</Link> */}
                        {isAdmin && <Link to='/dashboard/admin'>Admin</Link>}
                        <Link to='/dashboard' onClick={
                            (e) => {
                                e.preventDefault();
                                logout();
                            }
                        }>Logout</Link>
                    </div>
            </div>
        </div>
    );
}
