import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Assurez-vous d'importer le fichier CSS

const Login = () => {
    const [formType, setFormType] = useState('login'); // 'login', 'register', 'forgotPassword'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // État pour le message d'erreur
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Attempting to log in:", { email, password });
        try {
            const response = await axios.post(`${apiBaseUrl}/Gestion_des_candidatures/backend/Login/login.php`, {
                email,
                password,
            });
            console.log("Login response:", response.data);
            if (response.data.success) {
                const { session_id, user_email } = response.data; // Récupérer l'email de l'utilisateur
                localStorage.setItem('session_id', session_id);
                localStorage.setItem('user_email', user_email);
                console.log("Redirection vers /candidatures"); // Ajoutez ce log
                navigate('/candidatures'); // Redirige vers la liste des candidatures
            } else {
                setErrorMessage(response.data.message); // Affichez le message d'erreur
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setErrorMessage('Erreur lors de la connexion, veuillez réessayer.');
        }
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas !");
            return;
        }
        try {
            const response = await axios.post(`${apiBaseUrl}/Gestion_des_candidatures/backend/Login/register.php`, {
                email,
                password,
            });
            if (response.data.success) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setFormType('login'); // Switch to login form
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setErrorMessage('Erreur lors de l\'inscription, veuillez réessayer.');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/Gestion_des_candidatures/backend/Login/forgot-password.php`, { email });
            if (response.data.success) {
                alert('Un email de récupération a été envoyé à votre adresse.');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du mot de passe:', error);
            setErrorMessage('Erreur lors de la récupération du mot de passe, veuillez réessayer.');
        }
    };

    return (
        <div className="login-container">
            <h2>{formType === 'login' ? 'Connexion' : formType === 'register' ? 'Créer un compte' : 'Mot de passe oublié'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Afficher le message d'erreur */}
            {formType === 'login' && (
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Mot de passe:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Se connecter</button>
                    <p onClick={() => setFormType('forgotPassword')} className="link">Mot de passe oublié ?</p>
                    <p onClick={() => setFormType('register')} className="link">Créer un compte</p>
                </form>
            )}
            {formType === 'register' && (
                <form onSubmit={handleRegister}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Mot de passe:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Confirmer le mot de passe:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Créer un compte</button>
                    <p onClick={() => setFormType('login')} className="link">Déjà un compte ? Se connecter</p>
                </form>
            )}
            {formType === 'forgotPassword' && (
                <form onSubmit={handleForgotPassword}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Envoyer l'email de récupération</button>
                    <p onClick={() => setFormType('login')} className="link">Retour à la connexion</p>
                </form>
            )}
        </div>
    );
};

export default Login;
