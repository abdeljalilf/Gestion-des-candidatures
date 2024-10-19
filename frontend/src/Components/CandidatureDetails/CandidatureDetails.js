import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CandidatureDetails.css'; // Assurez-vous d'importer le fichier CSS

const CandidatureDetails = () => {
    const { id } = useParams(); // Récupère l'ID de la candidature à partir de l'URL
    const [candidature, setCandidature] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchCandidatureDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/get_candidature_details.php?id=${id}`);
                setCandidature(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la candidature :', error);
            }
        };

        fetchCandidatureDetails();
    }, [id, apiBaseUrl]);

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
                    <div 
                        dangerouslySetInnerHTML={{ __html: candidature.remarques }} 
                    />
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
