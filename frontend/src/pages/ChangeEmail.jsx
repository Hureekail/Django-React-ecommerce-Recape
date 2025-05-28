import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ChangeEmail } from '../components/auth'


const Login = () => {
    const [formData, setFormData] = useState({
        new_email: '',
        password: '',
    })

    const { new_email, password } = formData

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const onSubmit = async (e) => {
        e.preventDefault()

        const success = await dispatch(ChangeEmail({ new_email, password }));
        if (success) {
            navigate('/');
        }
    };


    return (
        <div className="container mt-5">
            <h1>Sign In</h1>
            <p>Sign into your account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                    type="new_email"
                    className="form-control mb-3"
                    name="new_email"
                    value={new_email}
                    onChange={e => onChange(e)}
                    placeholder="Enter new Email"
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
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login)