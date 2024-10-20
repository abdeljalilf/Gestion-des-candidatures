import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Assurez-vous d'importer les styles pour ReactQuill
import './EditCandidature.css';

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
        rappel: ''
    });
    const [remarques, setRemarques] = useState(''); // Remarques avec éditeur de texte
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchCandidature = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/candidature_to_edit.php?id=${id}`);
                setCandidature({
                    entreprise_id: response.data.entreprise_id,
                    entreprise_nom: response.data.entreprise_nom,
                    adresse: response.data.adresse,
                    contact: response.data.contact,
                    secteur: response.data.secteur,
                    poste: response.data.poste,
                    date_de_candidature: response.data.date_de_candidature,
                    statut: response.data.statut,
                    rappel: response.data.rappel
                });
                setRemarques(response.data.remarques); // Récupérer et définir les remarques
            } catch (error) {
                console.error('Erreur lors de la récupération de la candidature :', error);
            }
        };

        fetchCandidature();
    }, [id, apiBaseUrl]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/edit_candidature.php`, {
                id: id,
                entreprise_id: candidature.entreprise_id,
                entreprise_nom: candidature.entreprise_nom,
                adresse: candidature.adresse,
                contact: candidature.contact,
                secteur: candidature.secteur,
                poste: candidature.poste,
                date_de_candidature: candidature.date_de_candidature,
                statut: candidature.statut,
                remarques: remarques, // Envoi des remarques avec formatage
                rappel: candidature.rappel
            });
            alert('Candidature mise à jour avec succès.');
            navigate('/candidatures');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la candidature :', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidature(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="edit-candidature-container">
            <h2 className="edit-candidature-title">Éditer Candidature</h2>
            {candidature ? (
                <form className="edit-candidature-form" onSubmit={handleUpdate}>
                    <label className="edit-candidature-label">
                        Nom de l'entreprise:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="entreprise_nom"
                            value={candidature.entreprise_nom}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Adresse de l'entreprise:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="adresse"
                            value={candidature.adresse}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Contact de l'entreprise:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="contact"
                            value={candidature.contact}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Secteur de l'entreprise:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="secteur"
                            value={candidature.secteur}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Poste:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="poste"
                            value={candidature.poste}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Date de Candidature:
                        <input
                            className="edit-candidature-input"
                            type="date"
                            name="date_de_candidature"
                            value={candidature.date_de_candidature}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="edit-candidature-label">
                        Statut:
                        <input
                            className="edit-candidature-input"
                            type="text"
                            name="statut"
                            value={candidature.statut}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="form-group">
                        <label htmlFor="remarques">Remarques:</label>
                        <ReactQuill 
                            id="remarques"
                            value={remarques}
                            onChange={setRemarques}
                            placeholder="Ajoutez des remarques ici..."
                        />
                    </div>
                    <label className="edit-candidature-label">
                        Rappel:
                        <input
                            className="edit-candidature-input"
                            type="date"
                            name="rappel"
                            value={candidature.rappel}
                            onChange={handleChange}
                        />
                    </label>
                    <button className="edit-candidature-button edit-candidature-submit" type="submit">Mettre à jour</button>
                    <button className="edit-candidature-button edit-candidature-cancel" type="button" onClick={() => navigate('/candidatures')}>Annuler</button>
                </form>
            ) : (
                <p className="edit-candidature-loading">Chargement...</p>
            )}
        </div>
    );
};

export default EditCandidature;
