import React, { useContext } from 'react';
import AuthContext from '../context/auth/AuthContext';

function Dashboard(props) {

    const {user} = useContext(AuthContext);
    
    return (
        <div className='flex justify-center mt-4'>
            <span className='text-[50px]'>Welcome {user?.name}</span>
        </div>
    );
}

export default Dashboard;