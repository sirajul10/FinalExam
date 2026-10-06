import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Loading from '../components/Loading';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const {authUser,loading} = useContext(AuthContext);
    if(loading)
    {
        return <Loading/>
    }
    
    if(!authUser)
    {
        return <Navigate to={'/login'}></Navigate>
    }
    return children;
};

export default PrivateRoute;