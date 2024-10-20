import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AjouterCandidature.css';

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
    
        // Vérification de la valeur de rappel
        const rappelValue = rappel || null; // Ou une valeur par défaut
    // Vérifiez les valeurs avant l'envoi
    console.log({
        entreprise_id: entrepriseId,
        nom_nouvelle_entreprise: nouvelleEntreprise,
        adresse,
        contact,
        secteur,
        poste,
        date_de_candidature: dateDeCandidature,
        statut,
        remarques,
        rappel: rappelValue,
    });
        try {
            const response = await axios.post(`${apiBaseUrl}/Gestion_des_candidatures/backend/routes/add_candidature.php`, {
                entreprise_id: entrepriseId,
                nom_nouvelle_entreprise: nouvelleEntreprise,
                adresse, // Incluez l'adresse
                contact, // Incluez le contact
                secteur, // Incluez le secteur
                poste,
                date_de_candidature: dateDeCandidature,
                statut,
                remarques,
                rappel: rappelValue, // Envoie la valeur vérifiée
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
        setRemarques('');
        setRappel('');
        setSearchTerm('');
    };

    const filteredEntreprises = entreprises.filter(entreprise =>
        entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Configuration des modules de ReactQuill
    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }], // Ajout de la couleur de texte et de l'arrière-plan
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],  // Ajout du contrôle de la taille du texte
            ['link', 'image'],
            ['clean']                                         
        ],
    };

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
                            setSelectedEntreprise('');
                            setNouvelleEntreprise('');
                        } else {
                            const selected = entreprises.find(entreprise => entreprise.nom === entrepriseNom);
                            if (selected) {
                                setSelectedEntreprise(selected.id);
                                setNouvelleEntreprise('');
                                setAdresse(selected.adresse);
                                setContact(selected.contact);
                                setSecteur(selected.secteur);
                            } else {
                                setSelectedEntreprise('');
                                setNouvelleEntreprise(entrepriseNom);
                                setAdresse('');
                                setContact('');
                                setSecteur('');
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
                    required // Ajoutez cette ligne
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
                    modules={modules}  // Ajout des modules
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
