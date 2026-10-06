import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router';
import Loading from '../components/Loading';

const AdminPrivateRoute = ({children}) => {
    const {authUser,loading} = useContext(AuthContext);

    if(loading)
    {
        return <Loading/>
    }
    if(!authUser)
    {
        return <Navigate to={'/login'}></Navigate>
    }
    if(authUser.role_id !=1)
    {
        return <Navigate to={'/login'}></Navigate>
    }

    return  children;
};

export default AdminPrivateRoute;