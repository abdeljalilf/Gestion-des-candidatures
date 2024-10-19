// frontend/src/Components/CandidaturesListe.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './lcandidatures_liste.css';

const CandidaturesListe = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const session_id = localStorage.getItem('session_id'); // Récupérer l'ID de session


    useEffect(() => {
        const fetchCandidatures = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/get_candidatures.php`,
                    {
                        headers: {
                            Authorization: session_id // Envoie le session_id dans l'Authorization
                        }
                    });
                setCandidatures(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Erreur lors de la récupération des candidatures :', error);
            }
        };
        fetchCandidatures();
    }, [apiBaseUrl]);

    const filteredCandidatures = candidatures.filter((candidature) =>
        candidature.entreprise.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?');
        if (!confirmation) return;

        try {
            await axios.delete(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/delete_candidature.php`, {
                data: { id },
            });
            setCandidatures(candidatures.filter((candidature) => candidature.id !== id));
            alert('Candidature supprimée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de la candidature :', error);
        }
    };

    return (
        <div className="candidatures-liste">
            <h2>Liste des Candidatures</h2>
            <input
                type="text"
                placeholder="Rechercher par entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <table className="candidatures-table">
                <thead>
                    <tr>
                        <th>Entreprise</th>
                        <th>Poste</th>
                        <th>Date de Candidature</th>
                        <th>Statut</th>
                        <th>Rappel</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidatures.length > 0 ? (
                        filteredCandidatures.map((candidature) => (
                            <tr key={candidature.id}>
                                <td>{candidature.entreprise}</td>
                                <td>{candidature.poste}</td>
                                <td>{candidature.date_de_candidature || 'Non spécifiée'}</td>
                                <td>{candidature.statut}</td>
                                <td>{candidature.rappel || 'Pas de rappel'}</td>
                                <td className="actions">
                                    <Link to={`/edit-candidature/${candidature.id}`}>
                                        <button>Éditer</button>
                                    </Link>
                                    <Link to={`/candidature-details/${candidature.id}`}>
                                        <button>détails</button>
                                    </Link>
                                    <button onClick={() => handleDelete(candidature.id)}>Supprimer</button>
                                    
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Aucune candidature trouvée.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CandidaturesListe;
