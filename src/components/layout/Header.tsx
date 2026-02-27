import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Sun, Moon } from 'lucide-react';
import { selectTargetRepo, selectTheme } from '../../redux/selectors/appSelectors';
import { toggleTheme } from '../../redux/actions/appActions';
import './Header.scss';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const repo = useSelector(selectTargetRepo);
    const theme = useSelector(selectTheme);

    return (
        <header className="header-container">
            <div className="header-content">
                <a href="/" className="app-title">
                    <span className="logo-text">Code Wiki</span>
                </a>

                <div className="header-search">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="header-search-input"
                        placeholder="Search documentation..."
                        disabled
                        title="Search coming soon"
                    />
                </div>

                <div className="actions">
                    <button
                        className="theme-button"
                        onClick={() => dispatch(toggleTheme())}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
