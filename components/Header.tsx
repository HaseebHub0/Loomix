import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-full max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {isAuthenticated && user ? (
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5">
                        <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                        <span className="font-semibold text-gray-700">{user.credits}</span>
                    </div>
                    <a href="#/settings" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity">Upgrade</a>
                    <img src={`https://i.pravatar.cc/40?u=${user.email}`} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-indigo-500" />
                </div>
            ) : (
                <div className="flex items-center gap-4">
                     <a href="#/login" className="px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">Login</a>
                     <a href="#/signup" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity">Get Started Free</a>
                </div>
            )}
        </header>
    );
};