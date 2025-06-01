import { FcGoogle } from "react-icons/fc"; 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { login } from '../components/auth'
import '../styles/input.css';
import '../styles/settings.css';
import { GrNext } from "react-icons/gr";
import axios from 'axios';

import Cookies from 'js-cookie';



const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authError = useSelector(state => state.auth.error);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const onSubmit = async (e) => {
        e.preventDefault()

        const success = await dispatch(login({ email, password }));
        if (success) {
            navigate('/');
        }
    };

    const continueWithGoogle = async () => {
        console.log('Starting Google authentication...');
        try {
            const redirectUri = 'http://localhost:5173/google';
            console.log('Redirect URI:', redirectUri);
            
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                withCredentials: true
            };
            
            const url = `${import.meta.env.VITE_API_URL}/api/auth/o/google-oauth2/?redirect_uri=${redirectUri}`;
            console.log('Making request to:', url);
            
            const res = await axios.get(url, config);
            
            console.log('Full response:', res);
            console.log('Response data:', res.data);
            console.log('Response type:', typeof res.data);
            
            if (typeof res.data === 'string') {
                console.log('Response is HTML, trying to parse it');
                // If response is HTML, try to find the authorization URL in it
                const match = res.data.match(/authorization_url["']:\s*["']([^"']+)["']/);
                if (match) {
                    console.log('Found authorization URL in HTML:', match[1]);
                    window.location.replace(match[1]);
                    return;
                }
            }
            
            if (res.data.authorization_url) {
                console.log('Authorization URL found:', res.data.authorization_url);
                window.location.replace(res.data.authorization_url);
            } else {
                console.error('No authorization URL in response. Response data:', res.data);
            }
        } catch (err) {
            console.error('Google auth error:', err);
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                console.error('Error response headers:', err.response.headers);
            } else if (err.request) {
                console.error('Error request:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);


    return (
        <div className="settings">
            <div className='flex flex-col items-center justify-center'>
                <h1>Sign In</h1>
                <form onSubmit={e => onSubmit(e)}>
                    <div className="group mt-3">
                        <input 
                        type="email"
                        className="input-bar"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required />
                        <label>Email</label>
                    </div>
                    <div className="group">
                        <input
                        type="password"
                        className="input-bar"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required />
                        <label>Password</label>
                    </div>
                    <button className='press float-right flex items-center justify-end' type='submit'>
                        Submit
                        <GrNext className="w-4 h-4 ml-1"/>
                    </button>
                </form>
            </div>

            <div className="press btn bg-transparent border border-gray-300 flex justify-start" onClick={continueWithGoogle}>
                <p className='flex items-center' >Or sign in with:   <FcGoogle className="w-8 h-8"/></p>
            </div>
            <p className="mt-3">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <p className="mt-3">
                Forgot your password? <Link to="/reset-password">Reset Password</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login)