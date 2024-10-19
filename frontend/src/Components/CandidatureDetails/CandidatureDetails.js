import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ajout de useNavigate pour la redirection
import axios from 'axios';
import './CandidatureDetails.css'; // Importer le fichier CSS pour le style

const CandidatureDetails = () => {
    const { id } = useParams(); // Récupère l'ID de la candidature à partir de l'URL
    const [candidature, setCandidature] = useState(null);
    const [loggedIn, setLoggedIn] = useState(true); // Vérifie si l'utilisateur est connecté
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const session_id = localStorage.getItem('session_id'); // Récupérer l'ID de session
    const navigate = useNavigate(); // Pour rediriger si la session n'est pas valide

    useEffect(() => {
        const fetchCandidatureDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/get_candidature_details.php?id=${id}`,
                    {
                        headers: {
                            Authorization: session_id // Envoie le session_id dans l'Authorization
                        }
                    }
                );
                setCandidature(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Si l'utilisateur n'est pas connecté ou si la session a expiré
                    setLoggedIn(false);
                    localStorage.removeItem('session_id');
                    navigate('/login'); // Redirige vers la page de connexion
                } else {
                    console.error('Erreur lors de la récupération des détails de la candidature :', error);
                }
            }
        };

        fetchCandidatureDetails();
    }, [id, apiBaseUrl, session_id, navigate]);

    if (!loggedIn) {
        return <div>Redirection vers la page de connexion...</div>;
    }

    if (!candidature) {
        return <div>Chargement des détails de la candidature...</div>;
    }

    return (
        <div className="candidature-details">
            <h2>Détails de la Candidature</h2>
            <div className="details-container">
                <p><strong>Entreprise :</strong> {candidature.entreprise}</p>
                <p><strong>Poste :</strong> {candidature.poste}</p>
                <p><strong>Date de Candidature :</strong> {candidature.date_de_candidature || 'Non spécifiée'}</p>
                <p><strong>Statut :</strong> {candidature.statut}</p>
                <div className="remarques">
                    <strong>Remarques :</strong>
                    <div dangerouslySetInnerHTML={{ __html: candidature.remarques }} />
                </div>
                <p><strong>Rappel :</strong> {candidature.rappel || 'Pas de rappel'}</p>
                <p><strong>Adresse de l'Entreprise :</strong> {candidature.adresse}</p>
                <p><strong>Contact de l'Entreprise :</strong> {candidature.contact}</p>
                <p><strong>Secteur d'Activité :</strong> {candidature.secteur}</p>
            </div>
        </div>
    );
};

export default CandidatureDetails;
