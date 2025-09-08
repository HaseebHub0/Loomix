import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

const SettingsPage: React.FC = () => {
    const { user, upgradeUser } = useAuth();

    if (!user) {
        return null; // or a loading spinner
    }

    const handleUpgrade = () => {
        upgradeUser();
        alert('Congratulations! You are now a Pro user with 100 credits.');
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar onSubmit={() => {}} isLoading={false} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4">
                            <div>
                                <h2 className="font-semibold text-gray-600">Email</h2>
                                <p className="text-gray-800">{user.email}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h2 className="font-semibold text-gray-600">Current Plan</h2>
                                <p className="text-gray-800 capitalize">{user.plan}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h2 className="font-semibold text-gray-600">Remaining Credits</h2>
                                <p className="text-3xl font-bold text-indigo-600">{user.credits}</p>
                            </div>
                            
                            {user.plan === 'free' && (
                                <div className="border-t pt-6">
                                    <h2 className="text-xl font-bold text-gray-800">Upgrade to Pro</h2>
                                    <p className="text-gray-600 mt-2">Get 100 credits per month and unlock your full creative potential.</p>
                                    <button 
                                        onClick={handleUpgrade}
                                        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-300"
                                    >
                                        Upgrade for $5/month
                                    </button>
                                </div>
                            )}
                             {user.plan === 'pro' && (
                                <div className="border-t pt-6">
                                    <h2 className="text-xl font-bold text-gray-800">You are a Pro User!</h2>
                                    <p className="text-gray-600 mt-2">Enjoy your 100 monthly credits. Your plan will renew automatically.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
