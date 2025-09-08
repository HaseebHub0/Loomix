import React from 'react';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [hash, setHash] = React.useState(window.location.hash);

    React.useEffect(() => {
        const handleHashChange = () => {
            setHash(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // The AuthProvider handles the initial loading state, so a check here is not needed.
    // When this component renders, the auth state has already been determined.

    if (!isAuthenticated) {
        if (hash === '#/signup') return <SignupPage />;
        if (hash === '#/login') return <LoginPage />;
        return <LandingPage />;
    }

    // Authenticated routes
    if (hash === '#/settings') return <SettingsPage />;
    
    // Default to generator page if logged in
    return <GeneratorPage />;
};

export default App;