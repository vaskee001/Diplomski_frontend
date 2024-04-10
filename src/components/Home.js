import React from 'react'
import useAuth from '../hooks/useAuth';
import {jwtDecode} from "jwt-decode"

import { useNavigate, Link } from "react-router-dom";
import useLogout from '../hooks/useLogout';

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }


    // PROBA AUTENTIFIKACIJE
    const {auth}= useAuth();

    const decoded= auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined
    
    const userAuthorization = decoded?.UserInfo?.username || ""

    console.log(decoded.UserInfo.username);

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <div className="flexGrow">
                <button onClick={signOut}>Sign Out</button>
            </div>
            <p>{`Ovo je ${userAuthorization}`}</p>
        </section>
    )
}

export default Home