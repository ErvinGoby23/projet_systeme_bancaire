import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Bienvenue sur notre plateforme bancaire</h1>
            <Link to="/login">
                <button>Se connecter</button>
            </Link>
        </div>
    );
};

export default Home;
