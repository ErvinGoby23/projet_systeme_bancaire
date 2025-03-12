import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de la demande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Mot de passe oublié</h2>
            <form onSubmit={handleForgotPassword}>
                <input 
                    type="email" 
                    placeholder="Votre email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Envoyer"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
