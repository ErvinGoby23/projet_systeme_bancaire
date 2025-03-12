import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const navigate = useNavigate();

    // Fonction pour récupérer l'utilisateur
    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
            setUtilisateur(response.data.session);
            console.log("✅ Utilisateur récupéré :", response.data.session); // LOG ✅
        } catch (error) {
            setUtilisateur(null);
            console.log("⚪ Aucun utilisateur connecté"); // LOG ⚪
        }
    };

    useEffect(() => {
        fetchUser(); // Charge l'utilisateur au démarrage
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem("token");
            console.log("✅ Déconnexion réussie"); // LOG ✅
            setUtilisateur(null);
            navigate('/');
        } catch (error) {
            console.log("❌ Erreur lors de la déconnexion", error); // LOG ❌
        }
    };

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Link to="/">Accueil</Link> 
            {utilisateur ? (
                <>
                    <span style={{ marginLeft: "10px" }}>Bienvenue, {utilisateur.nom} {utilisateur.prenom} 👋</span>
                    <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Déconnexion</button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ marginLeft: "10px" }}>Connexion</Link>
                    <Link to="/register" style={{ marginLeft: "10px" }}>Inscription</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
