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
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '95vh',
            backgroundColor: 'black',
            overflow: 'hidden',
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2 style={{ 
                    marginBottom: '20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center', 
                    color: 'white'
                }}>Login</h2>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        marginTop: '3px',
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <label htmlFor="password">Password</label>
            
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        marginTop: '3px',
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <Button type="submit" style={{ marginTop: '20px' }}>Login</Button>
            </form>
        </div>
    );
};

export default LoginPage;