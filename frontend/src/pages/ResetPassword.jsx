import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { reset_password } from '../components/auth'

const ResetPassword = ({ reset_password, passwordResetSuccess }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
    });

    const { email } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await reset_password({ email });
        if (success) {
            setRequestSent(true);
            navigate('/');
        }
    };

    useEffect(() => {
        if (requestSent) navigate('/')
    }, [requestSent]);

    return (
        <div className="container mt-5">
            <h1>Request Password Reset:</h1>
            {passwordResetSuccess && <div className="alert alert-success">Password reset successful!</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control mb-3"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    passwordResetSuccess: state.auth.passwordResetSuccess
});

export default connect(mapStateToProps, { reset_password })(ResetPassword);
