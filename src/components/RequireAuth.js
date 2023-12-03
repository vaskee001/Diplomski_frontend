import React from 'react'
import { useLocation,Navigate,Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import {jwtDecode} from "jwt-decode"

const RequireAuth = ({allowedRoles}) =>{
    const {auth}= useAuth();
    const location = useLocation();

    const decoded= auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined

    const roles = decoded?.UserInfo?.roles || []

    return(
        roles.find(role=> allowedRoles?.includes(role))
            ? <Outlet/>
            : auth?.user 
            // state i replace idu zato sto user nije trazio da ode na tu str vec ga primoravamo
                ? <Navigate to="unauthorized" state={{from: location}} replace /> 
                : <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth;