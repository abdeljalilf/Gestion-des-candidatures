//frontend\src\Components\Login\PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [loading, setLoading] = useState(true);
    const session_id = localStorage.getItem('session_id');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!session_id) {
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/Login/session_check.php`, {
                    headers: {
                        Authorization: session_id,
                    },
                });
                const { logged_in } = response.data;

                setIsAuthorized(logged_in);
            } catch (error) {
                console.error('Error checking session:', error);
                setIsAuthorized(false);
            }

            setLoading(false);
        };

        checkAuthorization();
    }, [session_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
