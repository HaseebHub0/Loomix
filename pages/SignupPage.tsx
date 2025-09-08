import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SignupPage: React.FC = () => {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            await signup(email, password);
            window.location.hash = '#/';
        } catch (err) {
            if (err instanceof Error && err.message.includes('auth/email-already-in-use')) {
                 setError("An account with this email already exists.");
            } else {
                setError(err instanceof Error ? err.message : 'Failed to sign up');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-center gap-3 mb-6">
                     <div className="bg-gray-800 p-2 rounded-lg">
                        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.69 4.31002C14.85 2.43002 17.53 2.43002 18.69 4.31002L22.9 11.53C24.06 13.41 22.72 15.75 20.59 15.75H11.79C9.66 15.75 8.32 13.41 9.48 11.53L13.69 4.31002Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5.31006 11.53L9.52006 18.75C10.6801 20.63 13.3601 20.63 14.5201 18.75L16.6201 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Create your Loomix Account</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 disabled:opacity-50">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="#/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;