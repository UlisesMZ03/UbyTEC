import React from 'react';
import UserProfile from './UserProfile'; // Asegúrate de que la ruta sea correcta
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfilePage = () => {
    return (
        <div>
            <h1 className="text-center mt-4">User Profile</h1>
            <UserProfile />
        </div>
    );
};

export default UserProfilePage;
