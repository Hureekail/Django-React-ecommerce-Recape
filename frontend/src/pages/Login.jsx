import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { login } from '../components/auth'
import api from "../api";
import GoogleAuth from '../components/GoogleAuth';

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


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);


    return (
        <div className="container mt-5">
            <h1>Sign In</h1>
            <p>Sign into your account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                    type="email"
                    className="form-control mb-3"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    placeholder="Email"
                    required />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    className="form-control mb-3"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    minLength='6'
                    placeholder="Password"
                    required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <div className="mt-3">
                <p>Or sign in with:</p>
                <GoogleAuth />
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