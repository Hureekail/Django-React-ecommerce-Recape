import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../components/auth'

const Activate = ({ verify }) => {
    const [verified, setVerified] = useState(false);
    const { uid, token } = useParams();

    const verify_account = async () => {
        try {
            await verify(uid, token);
            setVerified(true);
        } catch (error) {
            console.error('Verification failed:', error);
        }
    };

    if (verified) {
        return <Navigate to='/' />
    }

    return (
        <div className='container'>
            <div 
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
                <h1>Verify your Account:</h1>
                <button
                    onClick={verify_account}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-primary'
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default connect(null, { verify })(Activate);