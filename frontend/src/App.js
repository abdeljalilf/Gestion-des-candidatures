import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import CandidaturesListe from './Components/lcandidatures_liste/lcandidatures_liste';
import AjouterCandidature from './Components/AjouterCandidature/AjouterCandidature';
import EditCandidature from './Components/EditCandidature/EditCandidature';
import CandidatureDetails from './Components/CandidatureDetails/CandidatureDetails';
import Login from './Components/Login/Login'; // Importer le composant Login
import { Outlet } from 'react-router-dom'; // Importer Outlet

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route index element={<CandidaturesListe />} /> {/* Route par défaut */}
            <Route path="candidatures" element={<CandidaturesListe />} />
            <Route path="ajouter-candidature" element={<AjouterCandidature />} />
            <Route path="edit-candidature/:id" element={<EditCandidature />} />
            <Route path="candidature-details/:id" element={<CandidatureDetails />} />
            <Route path="/login" element={<Login />} /> {/* Route pour la page de connexion */}
            <Route path="*" element={<CandidaturesListe />} /> {/* Redirect en cas d'URL non trouvée */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
