import { useState, useEffect, useCallback } from 'react';
import Logo from '../../assets/logo.png';
import './Navbar.scss';
import { IoClose, IoMenu } from "react-icons/io5";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useCurrency } from '../../context/CurrencyContext';

const Navbar = () => {
    const [opened, setOpened] = useState(false);
    const [user, setUser] = useRecoilState(userState);
    const location = useLocation();
    const { currency, setCurrency, options } = useCurrency();
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const handleLogout = () => {
        signOut(auth);
        setUser(null);
    }

    const handleToggle = () => {
        setOpened(!opened);
        document.querySelector('nav').classList.toggle('active');
    }

    const handleThemeToggle = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only update if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    window.addEventListener('scroll', () => {
        if (document.querySelector('nav')?.classList.contains('active')) {
            document.querySelector('nav').classList.remove('active');
            setOpened(false);
        }
    });

    return (
        <header>
            <NavLink to="/" className='logo' onClick={handleToggle}>
                <img src={Logo} alt="Goal Genius" />
            </NavLink>
            <nav>
                <div className="btn-container">
                    {/*<div className="currency-switch" role="group" aria-label="Select currency">
                        {Object.values(options).map((opt) => (
                            <button
                                key={opt.code}
                                type="button"
                                className={`currency-chip ${currency === opt.code ? 'active' : ''}`}
                                onClick={() => setCurrency(opt.code)}
                                title={opt.code}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>*/}
                    <button 
                        className="theme-toggle" 
                        onClick={handleThemeToggle} 
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        {theme === 'dark' ? <IoSunnyOutline /> : <IoMoonOutline />}
                    </button>
                    {
                        user ? <>
                            {
                                ['kkibetkkoir@gmail.com', 'charleykibet254@gmail.com', 'kipkiruik1@gmail.com'].includes(user.email) && <>
                                <NavLink className="btn" to="users">Users</NavLink>
                                <NavLink className="btn" to="add-tip">Add Tips</NavLink>
                                </>
                            }
                            <span className='btn' onClick={() => {
                                handleLogout();
                                handleToggle();
                            }}>Logout</span> 
                        </>
                            : 
                        <>
                            <NavLink className="btn" to="login" onClick={handleToggle} state={{ from: location }}>Login</NavLink>
                            <NavLink className="btn" to="register" onClick={handleToggle} state={{ from: location }}>Register</NavLink>
                        </>
                    }
                </div>
            </nav>

            <div className="icon" id='menu-bars' onClick={handleToggle}>
                {opened ? <IoClose /> : <IoMenu />}
            </div>
        </header>
    );
}

export default Navbar;