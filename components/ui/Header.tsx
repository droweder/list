
import React from 'react';

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
    return (
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
                <div>{children}</div>
            </div>
        </header>
    );
};

export default Header;
