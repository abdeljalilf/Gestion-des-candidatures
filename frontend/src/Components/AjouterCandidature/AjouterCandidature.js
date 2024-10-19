import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import ReactQuill from 'react-quill'; // Importer React Quill
import 'react-quill/dist/quill.snow.css'; // Importer le style de Quill
import './AjouterCandidature.css'; // Assurez-vous de créer ce fichier CSS pour le style

const AjouterCandidature = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState('');
    const [nouvelleEntreprise, setNouvelleEntreprise] = useState('');
    const [adresse, setAdresse] = useState('');
    const [contact, setContact] = useState('');
    const [secteur, setSecteur] = useState('');
    const [poste, setPoste] = useState('');
    const [dateDeCandidature, setDateDeCandidature] = useState('');
    const [statut, setStatut] = useState('');
    const [remarques, setRemarques] = useState('');
    const [rappel, setRappel] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/get_entreprises.php`);
                setEntreprises(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des entreprises :', error);
            }
        };

        fetchEntreprises();
    }, [apiBaseUrl]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let entrepriseId = selectedEntreprise;

        // Ajout de la candidature
        try {
            const response = await axios.post(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/add_candidature.php`, {
                entreprise_id: entrepriseId,
                nom_nouvelle_entreprise: nouvelleEntreprise,
                adresse,
                contact,
                secteur,
                poste,
                date_de_candidature: dateDeCandidature,
                statut,
                remarques,
                rappel,
            });

            if (response.data.error) {
                alert('Erreur : ' + response.data.error);
            } else {
                alert('Candidature ajoutée avec succès !');
                resetForm();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la candidature :', error);
        }
    };

    const resetForm = () => {
        setSelectedEntreprise('');
        setNouvelleEntreprise('');
        setAdresse('');
        setContact('');
        setSecteur('');
        setPoste('');
        setDateDeCandidature('');
        setStatut('');
        setRemarques(''); // Réinitialiser les remarques
        setRappel('');
        setSearchTerm(''); // Réinitialiser le champ de recherche
    };

    const filteredEntreprises = entreprises.filter(entreprise =>
        entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form className="ajouter-candidature-form" onSubmit={handleSubmit}>
            <h2>Ajouter une Candidature</h2>
            <div className="form-group">
                <label htmlFor="entreprise">Sélectionnez une entreprise ou entrez une nouvelle entreprise:</label>
                <datalist id="entreprises">
                    <option value="Autre entreprise" />
                    {filteredEntreprises.map((entreprise) => (
                        <option key={entreprise.id} value={entreprise.nom} />
                    ))}
                </datalist>
                <input
                    list="entreprises"
                    onChange={(e) => {
                        const entrepriseNom = e.target.value;
                        if (entrepriseNom === "Autre entreprise") {
                            setSelectedEntreprise(''); // Réinitialiser l'entreprise sélectionnée
                            setNouvelleEntreprise(''); // Réinitialiser la nouvelle entreprise
                        } else {
                            const selected = entreprises.find(entreprise => entreprise.nom === entrepriseNom);
                            if (selected) {
                                setSelectedEntreprise(selected.id);
                                setNouvelleEntreprise(''); // Réinitialiser la nouvelle entreprise
                                setAdresse(selected.adresse); // Remplir l'adresse de l'entreprise sélectionnée
                                setContact(selected.contact); // Remplir le contact de l'entreprise sélectionnée
                                setSecteur(selected.secteur); // Remplir le secteur de l'entreprise sélectionnée
                            } else {
                                setSelectedEntreprise('');
                                setNouvelleEntreprise(entrepriseNom); // Saisir comme nouvelle entreprise
                                setAdresse(''); // Réinitialiser l'adresse
                                setContact(''); // Réinitialiser le contact
                                setSecteur(''); // Réinitialiser le secteur
                            }
                        }
                    }}
                />
            </div>
            {selectedEntreprise === '' && (
                <div className="form-group">
                    <input
                        type="text"
                        id="nouvelle-entreprise"
                        value={nouvelleEntreprise}
                        onChange={(e) => setNouvelleEntreprise(e.target.value)}
                        placeholder="Nom de la nouvelle entreprise"
                        style={{ display: selectedEntreprise === '' && nouvelleEntreprise === "" ? "block" : "none" }} // Afficher seulement si Autre entreprise est choisi
                    />
                </div>
            )}
            {selectedEntreprise === '' && (
                <>
                    <div className="form-group">
                        <label htmlFor="adresse">Adresse:</label>
                        <input
                            type="text"
                            id="adresse"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                            placeholder="Adresse de l'entreprise"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Contact:</label>
                        <input
                            type="text"
                            id="contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Contact (email, téléphone)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="secteur">Secteur:</label>
                        <input
                            type="text"
                            id="secteur"
                            value={secteur}
                            onChange={(e) => setSecteur(e.target.value)}
                            placeholder="Secteur d'activité"
                            required
                        />
                    </div>
                </>
            )}
            <div className="form-group">
                <label htmlFor="poste">Poste:</label>
                <input
                    type="text"
                    id="poste"
                    value={poste}
                    onChange={(e) => setPoste(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="dateDeCandidature">Date de Candidature:</label>
                <input
                    type="date"
                    id="dateDeCandidature"
                    value={dateDeCandidature}
                    onChange={(e) => setDateDeCandidature(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="statut">Statut:</label>
                <input
                    type="text"
                    id="statut"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="remarques">Remarques:</label>
                <ReactQuill 
                    id="remarques"
                    value={remarques}
                    onChange={setRemarques}
                    placeholder="Ajoutez des remarques ici..."
                />
            </div>
            <div className="form-group">
                <label htmlFor="rappel">Rappel:</label>
                <input
                    type="date"
                    id="rappel"
                    value={rappel}
                    onChange={(e) => setRappel(e.target.value)}
                />
            </div>
            <button type="submit" className="submit-button">Ajouter Candidature</button>
        </form>
    );
};

export default AjouterCandidature;
