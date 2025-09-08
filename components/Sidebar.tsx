import React from 'react';
import { InputForm } from './InputForm';
import type { UserInput } from '../types';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

// FIX: Updated onClick type to allow passing event handlers that receive a mouse event.
const NavLink: React.FC<{ href?: string; onClick?: (e: React.MouseEvent) => void; icon: React.ReactNode; label: string; active?: boolean; beta?: boolean }> = ({ href, onClick, icon, label, active, beta }) => (
    <a href={href} onClick={onClick} className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors text-sm ${active ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        {icon}
        <span className="flex-1">{label}</span>
        {beta && <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Beta</span>}
    </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ onSubmit, isLoading }) => {
    const { logout } = useAuth();
    
    const navIcons = {
        home: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
        canvas: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
        settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
        logout: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    }

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };

    return (
        <aside className="w-[380px] bg-gray-900 text-white flex flex-col p-4 overflow-y-auto shrink-0">
            <a href="#" className="flex items-center gap-3 p-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.69 4.31002C14.85 2.43002 17.53 2.43002 18.69 4.31002L22.9 11.53C24.06 13.41 22.72 15.75 20.59 15.75H11.79C9.66 15.75 8.32 13.41 9.48 11.53L13.69 4.31002Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5.31006 11.53L9.52006 18.75C10.6801 20.63 13.3601 20.63 14.5201 18.75L16.6201 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Loomix</h1>
            </a>

            <nav className="space-y-2 mb-6 border-b border-gray-800 pb-6">
                 <NavLink href="#" icon={navIcons.home} label="AI Image Generation" active />
                 <NavLink href="#" icon={navIcons.canvas} label="AI Canvas" beta />
            </nav>

            <div className="flex-grow">
                 <InputForm onSubmit={onSubmit} isLoading={isLoading} />
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
                <NavLink href="#/settings" icon={navIcons.settings} label="Settings" />
                <NavLink onClick={handleLogout} href="#" icon={navIcons.logout} label="Logout" />
            </div>
        </aside>
    );
};