import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCandidature = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidature, setCandidature] = useState({
        entreprise_id: '',
        entreprise_nom: '', // Nom de l'entreprise
        adresse: '',        // Adresse de l'entreprise
        contact: '',        // Contact de l'entreprise
        secteur: '',        // Secteur de l'entreprise
        poste: '',
        date_de_candidature: '',
        statut: '',
        remarques: '',
        rappel: ''
    });
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    // Récupérer les données de la candidature et de l'entreprise depuis l'API
    useEffect(() => {
        const fetchCandidature = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/candidature_to_edit.php?id=${id}`);
                // Pré-remplir le formulaire avec les données récupérées
                setCandidature({
                    entreprise_id: response.data.entreprise_id,
                    entreprise_nom: response.data.entreprise_nom,   // Nom de l'entreprise
                    adresse: response.data.adresse,                // Adresse de l'entreprise
                    contact: response.data.contact,                // Contact de l'entreprise
                    secteur: response.data.secteur,                // Secteur de l'entreprise
                    poste: response.data.poste,
                    date_de_candidature: response.data.date_de_candidature,
                    statut: response.data.statut,
                    remarques: response.data.remarques,
                    rappel: response.data.rappel
                });
            } catch (error) {
                console.error('Erreur lors de la récupération de la candidature :', error);
            }
        };

        fetchCandidature();
    }, [id, apiBaseUrl]);

    // Gestion de la soumission du formulaire
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/edit_candidature.php`, {
                id: id, // ID de la candidature
                entreprise_id: candidature.entreprise_id,
                entreprise_nom: candidature.entreprise_nom,   // Nom de l'entreprise
                adresse: candidature.adresse,                // Adresse de l'entreprise
                contact: candidature.contact,                // Contact de l'entreprise
                secteur: candidature.secteur,                // Secteur de l'entreprise
                poste: candidature.poste,
                date_de_candidature: candidature.date_de_candidature,
                statut: candidature.statut,
                remarques: candidature.remarques,
                rappel: candidature.rappel
            });
            alert('Candidature mise à jour avec succès.');
            navigate('/candidatures'); // Rediriger vers la page d'accueil après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la candidature :', error);
        }
    };

    // Gestion du changement de valeur des champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidature(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Éditer Candidature</h2>
            {candidature ? (
                <form onSubmit={handleUpdate}>
                    <label>
                        Nom de l'entreprise:
                        <input
                            type="text"
                            name="entreprise_nom"
                            value={candidature.entreprise_nom}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Adresse de l'entreprise:
                        <input
                            type="text"
                            name="adresse"
                            value={candidature.adresse}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Contact de l'entreprise:
                        <input
                            type="text"
                            name="contact"
                            value={candidature.contact}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Secteur de l'entreprise:
                        <input
                            type="text"
                            name="secteur"
                            value={candidature.secteur}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Poste:
                        <input
                            type="text"
                            name="poste"
                            value={candidature.poste}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Date de Candidature:
                        <input
                            type="date"
                            name="date_de_candidature"
                            value={candidature.date_de_candidature}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Statut:
                        <input
                            type="text"
                            name="statut"
                            value={candidature.statut}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Remarques:
                        <input
                            type="text"
                            name="remarques"
                            value={candidature.remarques}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Rappel:
                        <input
                            type="date"
                            name="rappel"
                            value={candidature.rappel}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" >Mettre à jour</button>
                    <button type="button" onClick={() => navigate('/candidatures')}>Annuler</button>
                </form>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default EditCandidature;
