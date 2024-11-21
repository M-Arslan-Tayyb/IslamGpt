import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import './AppLayout.css'
import { useState } from 'react'


function AppLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="root-container">
            <Header onMenuStateChange={setIsMenuOpen} />
            <main className="">
                <Outlet context={{ isMenuOpen }} />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout