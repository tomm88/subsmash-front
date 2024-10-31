import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { checkAuth } from '../httpRequests/checkAuth';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Navbar } from '../components/dashboard/Navbar';
import { Sidebar } from '../components/dashboard/Sidebar';
import { MyPrompt } from '../components/myPrompt/MyPrompt';
import { OverlayLayouts } from '../components/overlayLayouts/OverlayLayouts';
import { HelpAndSupport } from '../components/helpAndSupport/HelpAndSupport';
import '../styles/dashboard/dashboardLayout.css'
import { Admin } from '../components/admin/Admin';
import { MyAccount } from '../components/myAccount/MyAccount';
import { Previews } from '../components/previews/Previews';

export const DashboardLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true);

    //Check if user is authenticated on page load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const authenticated = await checkAuth();
                console.log('does this happen?')
                setLoading(false);
                if (authenticated){
                setIsAuthenticated(true);
                } else {
                    alert("please log in")
                    window.location.href = '/';
                }
            } catch(error) {
                console.error("Error checking session: ", error)
            }              
        }
        checkSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        window.location.href = '/';
    }

  return (
    <div className='dashboard-layout'>
        <Navbar />
        <div className='dashboard-content'>
            <Sidebar />
            <main className='main-content'>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/prompt' element={<MyPrompt />} />
                    <Route path='/layouts' element={<OverlayLayouts />} />
                    <Route path='/previews' element={<Previews />} />
                    <Route path='/help' element={<HelpAndSupport />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/my-account' element={<MyAccount />} />
                </Routes>
            </main>
        </div>
    </div>
  )
}