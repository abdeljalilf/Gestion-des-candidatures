import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import React from 'react';
import './MainPage.css'; // Assurez-vous de créer ce fichier CSS pour le style

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <AppBar position="static" className="app-bar">
                <Toolbar className="toolbar">
                    <h1 className="app-title">Gestion des Candidatures</h1>
                    <Button color="inherit" onClick={() => navigate('/candidatures')}>
                        Liste des Candidatures
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/ajouter-candidature')} className="nav-button">
                        Ajouter une Candidature
                    </Button>
                    {/* 
                    <Button color="inherit" onClick={() => navigate('/parametres')} className="nav-button">
                        Paramètres
                    </Button> */}
                </Toolbar>
            </AppBar>
            <Outlet />
        </div>
    );
};

export default MainPage;
