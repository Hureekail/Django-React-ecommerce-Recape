import api from "../api";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ACCES_TOKEN, REFRESH_TOKEN } from "../constants";

import {
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SIGNUP_START,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    LOGOUT,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    DELETE_PROFILE_FAIL,
    DELETE_PROFILE_SUCCESS,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
} from "./types"


const initializeCsrf = async () => {
    try {
        // Call a GET endpoint to set the CSRF cookie
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/csrf/`, { withCredentials: true });
    } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        throw new Error("CSRF token initialization failed");
    }
};


export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users/me/`, config);
    
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

export const signup = (userData) => async (dispatch) => {
    dispatch({ type: SIGNUP_START });
    try {

        await initializeCsrf();

        const csrfToken = Cookies.get('csrftoken');
        const res = await api.post('api/auth/users/', userData, {headers: {'X-CSRFToken': csrfToken}});
        dispatch({ type: SIGNUP_SUCCESS, payload: res.data });
        return true;
    } catch (err) {
        dispatch({ type: SIGNUP_FAIL, payload: err.response?.data });
        return false;
    }
};


export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        const res = await api.post('/api/auth/users/activation/', body, config);
        dispatch({
            type: ACTIVATION_SUCCESS,
            payload: res.data
        });
        return true;
    } catch (err) {
        console.error('Activation failed:', err.response?.data || err.message);
        dispatch({
            type: ACTIVATION_FAIL,
            payload: err.response?.data
        });
        return false;
    }
};



export const login = ({email, password}) => async (dispatch) => {
    dispatch({ type: LOGIN_START });
    try {

        await initializeCsrf()
        const csrfToken = Cookies.get('csrftoken');
        const body = JSON.stringify({ email, password });
        const res = await api.post('api/auth/jwt/create/', body, {headers: {'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'}});

        const { access, refresh } = res.data;


        localStorage.setItem(ACCES_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);


        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        return true;
    } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
        dispatch({ type: LOGIN_FAIL, payload: err.response?.data });
        return false;
    }
};


export const logout = () => ({ type: LOGOUT });


export const reset_password = ({email}) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({email})

    try {
        const res = await api.post('api/auth/users/reset_password/', body, config)
        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload: res.data
        })
        return true
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);

        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: err.response?.data 
        })
        return false
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({uid, token, new_password, re_new_password})

    try {
        await api.post('api/auth/users/reset_password_confirm/', body, config)

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        })
        return true
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        })
    return false
    }
}


export const googleAuth = (state, code) => async dispatch => {
    if (state && code && !localStorage.getItem('access')) {
        try {
            console.log('Starting Google auth with state:', state);
            await initializeCsrf();
            
            const csrfToken = Cookies.get('csrftoken');
            console.log('Using CSRF token:', csrfToken);
            
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            };

            const formBody = new URLSearchParams({
                'state': state,
                'code': code
            }).toString();

            console.log('Making request with form body:', formBody);

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/o/google-oauth2/`, formBody, config);
            console.log('Google auth response:', res.data);

            dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });
            dispatch(load_user());
            return true;
        } catch (err) {
            console.error('Google auth error:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
                console.error('Error status:', err.response.status);
                console.error('Error headers:', err.response.headers);
            }
            dispatch({
                type: GOOGLE_AUTH_FAIL
            });
            return false;
        }
    }
};


export const DeleteProfile = () => async (dispatch) => {
    const csrfToken = Cookies.get('csrftoken');
    const accessToken = localStorage.getItem(ACCES_TOKEN);

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            await api.delete('/api/accounts/delete-profile/', {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Authorization': `JWT ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch({ type: DELETE_PROFILE_SUCCESS });
            dispatch(logout());
        } catch (error) {
            console.error('Error deleting profile:', error);
            dispatch({ 
                type: DELETE_PROFILE_FAIL,
                payload: error.response?.data || 'Failed to delete profile'
            });
        }
    }
};


export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/verify/`, body, config)

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};