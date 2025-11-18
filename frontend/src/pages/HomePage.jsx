import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage(){

    const {isAuthenticated} = useAuth();
    const destination = isAuthenticated ? '/dashboard' : '/login';

    return(
        <>
            <div className="flex flex-col items-center justify-center text-center px-6 py-24">

                <h1 className="text-5xl font-bold text-text-primary mb-6">
                    Welcome to Splitly!
                </h1>

                <p className="text-xl text-text-primary max-w-2xl mb-12">
                    Stop stressing about who paid what. Easily split bills for dinners, 
                    trips, and monthly rent with your friends and flatmates.
                </p>

                <Link
                    to={destination} 
                    className="px-8 py-4 rounded-lg bg-primary text-text-primary text-xl font-bold hover:opacity-90 shadow-lg"
                >
                    Get Started
                </Link>.
            </div>
        </>
    )
}