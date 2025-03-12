import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token: resetToken } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', { resetToken, newPassword });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de la réinitialisation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleResetPassword}>
                <input 
                    type="password" 
                    placeholder="Nouveau mot de passe" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Réinitialiser"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
