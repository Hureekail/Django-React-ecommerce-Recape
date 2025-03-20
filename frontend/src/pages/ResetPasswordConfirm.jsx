import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { reset_password_confirm } from '../components/auth'


const ResetPasswordConfirm = () => {
    const [requestSent, setRequestSent] = useState(false)
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: '',
    })

    const { new_password, re_new_password } = formData

    const { uid, token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (new_password !== re_new_password) {
            alert("Passwords do not match!");
            return;
        }
        

        try {
            await dispatch(reset_password_confirm(uid, token, new_password, re_new_password));
            setRequestSent(true);
        } catch (err) {
            console.error('Password reset confirmation failed:', err);
        }
    };

    if (requestSent) {
        navigate('/');
    }

    return (
        <div className="container mt-5">
            <h1>Password Reset:</h1>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                    type="password"
                    className="form-control mb-3"
                    name="new_password"
                    value={new_password}
                    onChange={e => onChange(e)}
                    minLength='6'
                    placeholder="New Password"
                    required />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    className="form-control mb-3"
                    name="re_new_password"
                    value={re_new_password}
                    onChange={e => onChange(e)}
                    minLength='6'
                    placeholder="Confirm New Password"
                    required />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
        </div>
    )
}


export default ResetPasswordConfirm