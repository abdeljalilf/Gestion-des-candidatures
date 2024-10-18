CREATE DATABASE candidatures_db;
USE candidatures_db;

CREATE TABLE candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entreprise_id INT,               -- Référence à la table 'entreprises'
    poste VARCHAR(255),
    date_de_candidature DATE,
    statut VARCHAR(50),              -- Statut de la candidature (ex: "en attente", "acceptée")
    remarques TEXT,
    rappel DATE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
);

CREATE TABLE entreprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    adresse VARCHAR(255),
    contact VARCHAR(255),          -- Informations de contact (email, téléphone, etc.)
    secteur VARCHAR(255)           -- Secteur d'activité de l'entreprise
);

INSERT INTO entreprises (nom, adresse, contact, secteur) VALUES
('Entreprise A', '123 Rue A, Ville A', 'contact@entrepriseA.com', 'Informatique'),
('Entreprise B', '456 Rue B, Ville B', 'contact@entrepriseB.com', 'Consulting');

INSERT INTO candidatures (entreprise_id, poste, statut, remarques, rappel) VALUES
(1, 'Développeur Web', 'en attente', 'Entretien prévu la semaine prochaine', '2024-10-30'),
(2, 'Consultant', 'acceptée', 'Contrat signé', NULL);
