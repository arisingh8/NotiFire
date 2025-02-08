"use client";

import Button from "../components/button";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Add your authentication logic here
        // For example, you can call an API to authenticate the user
        // If authentication is successful, redirect to the dashboard
        router.push('/dashboard');
    };

    // useEffect(() => {
    //     // Example of fetching protected data
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetchWithAuth('http://localhost:8000/auth/me');
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.log('User data:', data);
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2 style={{ 
                    marginBottom: '20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center' 
                }}>Login</h2>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <></>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" style={{ marginTop: '20px' }}>Login</Button>
            </form>
        </div>
    );
};

export default LoginPage;