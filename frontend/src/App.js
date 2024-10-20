import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import CandidaturesListe from './Components/lcandidatures_liste/lcandidatures_liste';
import AjouterCandidature from './Components/AjouterCandidature/AjouterCandidature';
import EditCandidature from './Components/EditCandidature/EditCandidature';
import CandidatureDetails from './Components/CandidatureDetails/CandidatureDetails';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/Login/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route index element={<PrivateRoute element={<CandidaturesListe />} />} />
            <Route path="candidatures" element={<PrivateRoute element={<CandidaturesListe />} />} />
            <Route path="ajouter-candidature" element={<PrivateRoute element={<AjouterCandidature />} />} />
            <Route path="edit-candidature/:id" element={<PrivateRoute element={<EditCandidature />} />} />
            <Route path="candidature-details/:id" element={<PrivateRoute element={<CandidatureDetails />} />} />
            <Route path="*" element={<PrivateRoute element={<CandidaturesListe />} />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
