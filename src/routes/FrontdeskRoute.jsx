import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import FrontRoot from '../layout/FrontRoot';

const FrontdeskRoute = ({children}) => {
    const {authUser,loading} = useContext(AuthContext);
    
    if(loading)
    {
        return <loading></loading>
    }
    if(!authUser)
    {
        return <Navigate to={'/login'}></Navigate>
    }
     if(authUser.role_id ==3)
    {
        return <Navigate to={'/login'}></Navigate>
    }
    return children;
};

export default FrontRoot;