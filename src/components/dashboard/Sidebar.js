import React from 'react';
import '../../styles/dashboard/sidebar.css';
import homeIcon from '../../assets/icons/home.svg'
import promptIcon from '../../assets/icons/prompt.svg'
import slideshowIcon from '../../assets/icons/slideshow.svg'
import helpIcon from '../../assets/icons/help.svg'
import logoutIcon from '../../assets/icons/logout.svg'
import { logout } from '../../httpRequests/logout';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
    return (
        <nav className="sidebar">
            <ul className='sidebar-list'>
                <li className="sidebar-item">                    
                    <Link to="/dashboard">
                        <img src={homeIcon} alt="home icon" className='sidebar-icon' />
                        Dashboard
                    </Link></li>
                <li className="sidebar-item">
                    <Link to="/dashboard/prompt">
                        <img src={promptIcon} alt="home icon" className='sidebar-icon' />
                        My Prompts
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/dashboard/layouts">
                        <img src={slideshowIcon} alt="home icon" className='sidebar-icon' />
                        Overlay Layouts
                    </Link>
                </li>
            </ul>
            <ul className="sidebar-footer">
                <li className="sidebar-item">
                    <Link to="/dashboard/help">
                        <img src={helpIcon} alt="home icon" className='sidebar-icon' />
                        Help & Support
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link 
                        to="/dashboard"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                logout();
                            }
                        }
                    >
                        <img src={logoutIcon} alt="home icon" className='sidebar-icon' />
                        Log out
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
