import React, { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: ReactNode;
    activeTab: 'article' | 'history';
    onTabChange: (tab: 'article' | 'history') => void;
    hasActiveDoc: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange, hasActiveDoc }) => {
    return (
        <div className="app-container">
            <Header />
            <div className="documentation-container">
                <Sidebar />
                <main className="main-content">
                    {hasActiveDoc && (
                        <div className="topbar">
                            <div className="tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'article' ? 'active' : ''}`}
                                    onClick={() => onTabChange('article')}
                                >
                                    Article
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                                    onClick={() => onTabChange('history')}
                                >
                                    History
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="reader-area">
                        <div className="reader-content">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
