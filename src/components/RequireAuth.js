import React from 'react'
import { useLocation,Navigate,Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({allowedRoles}) =>{
    const {auth}= useAuth();
    const location = useLocation();

    return(
        auth?.roles?.find(role=> allowedRoles?.includes(role))
            ? <Outlet/>
            : auth?.user 
            // state i replace idu zato sto user nije trazio da ode na tu str vec ga primoravamo
                ? <Navigate to="unauthorized" state={{from: location}} replace /> 
                : <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth;