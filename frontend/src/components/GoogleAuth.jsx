import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { googleAuth } from './auth';
import queryString from 'query-string';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ googleAuth }) => {
    let location = useLocation();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (response) => {
        if (response.credential) {
            try {
                const token = response.credential;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    navigate('/');
                }
            } catch (error) {
                console.error('Google authentication error:', error);
            }
        }
    };

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            const handleAuth = async () => {
                const success = await googleAuth(state, code);
                if (success) {
                    navigate('/');
                }
            };
            handleAuth();
        }
    }, [location, googleAuth, navigate]);

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            useOneTap
            flow="implicit"
        />
    );
};

export default connect(null, { googleAuth })(GoogleAuth);