import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../components/auth';

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

    return (
        <div className='container mt-5'>
            <h1>Sign Up</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    className='form-control mb-3'
                    type='text'
                    placeholder='First name'
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <input
                    className='form-control mb-3'
                    type='text'
                    placeholder='Last name'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <input
                    className='form-control mb-3'
                    type='email'
                    placeholder='Email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className='form-control mb-3'
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    className='form-control mb-3'
                    type='password'
                    placeholder='Confirm Password'
                    name='re_password'
                    value={formData.re_password}
                    onChange={handleChange}
                    required
                />
                <button 
                    className='btn btn-primary' 
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
            <p className='mt-3'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    );
};

export default Register;