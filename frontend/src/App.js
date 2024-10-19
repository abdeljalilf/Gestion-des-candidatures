import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import CandidaturesListe from './Components/lcandidatures_liste/lcandidatures_liste';
import AjouterCandidature from './Components/AjouterCandidature/AjouterCandidature';
import EditCandidature from './Components/EditCandidature/EditCandidature'; // Importer EditCandidature
import CandidatureDetails from './Components/CandidatureDetails/CandidatureDetails'; // Importer CandidatureDetails

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="candidatures" element={<CandidaturesListe />} />
            <Route path="/ajouter-candidature" element={<AjouterCandidature />} />
            <Route path="/edit-candidature/:id" element={<EditCandidature />} /> {/* Nouvelle route pour l'édition */}
            <Route path="/candidature-details/:id" element={<CandidatureDetails />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
