import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../components/auth';

import '../styles/input.css';
import '../styles/settings.css';
import { GrNext } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc"; 



const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password === formData.re_password) {
            const success = await dispatch(signup(formData));
            if (success) navigate('/login');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
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

    return (
        <div className='settings'>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                
                <div className='flex flex-col items-center justify-center'>
                    <h1>Sign Up</h1>
                    <div className="group mt-4">
                        <input
                            className='input-bar'
                            type='text'
                            name='first_name'
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className="group">
                        <input
                            className='input-bar'
                            type='text'
                            name='last_name'
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                        <label>Last Name</label>
                    </div>
                    <div className="group">
                        <input
                            className='input-bar'
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className="group">
                        <input
                            className='input-bar'
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label>Password</label>
                    </div>
                    <div className="group">
                        <input
                            className='input-bar'
                            type='password'
                            name='re_password'
                            value={formData.re_password}
                            onChange={handleChange}
                            required
                        />
                        <label>Confirm Password</label>
                    </div>
                </div>
                
            
                <button className='press float-right flex items-center justify-end' type='submit'>
                    Submit
                    <GrNext className="w-4 h-4 ml-1"/>
                </button>
            </form>
            <div className="press btn bg-transparent border border-gray-300 flex justify-start" onClick={continueWithGoogle}>
                <p className='flex items-center' >Or sign in with:   <FcGoogle className="w-8 h-8"/></p>
            </div>
            <p className='flex flex-col items-center justify-center mt-3'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    );
};

export default Register;