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
    LOGOUT,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
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
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    
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
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await api.post(`${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?${formBody}`, config);

            dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(load_user());
        } catch (err) {
            dispatch({
                type: GOOGLE_AUTH_FAIL
            });
        }
    }
};