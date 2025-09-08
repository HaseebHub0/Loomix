import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-lg">
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.69 4.31002C14.85 2.43002 17.53 2.43002 18.69 4.31002L22.9 11.53C24.06 13.41 22.72 15.75 20.59 15.75H11.79C9.66 15.75 8.32 13.41 9.48 11.53L13.69 4.31002Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5.31006 11.53L9.52006 18.75C10.6801 20.63 13.3601 20.63 14.5201 18.75L16.6201 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Loomix</h1>
        </div>
        <div className="flex items-center gap-4">
            <a href="#/login" className="px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">Login</a>
            <a href="#/signup" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity">Get Started Free</a>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Create Stunning Social Posts in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Seconds</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Stop wasting time. Our AI-powered designer generates professional, on-brand social media content instantly. Just describe your product, and watch the magic happen.
          </p>
          <div className="mt-10">
            <a href="#/signup" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105">
              Get Started For Free
            </a>
            <p className="mt-4 text-sm text-gray-500">5 free credits upon signup.</p>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Loomix. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;