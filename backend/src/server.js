require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.setupSecurity();
        this.setupMiddlewares();
        this.setupRoutes();
        this.start();
    }

    setupSecurity() {
        this.app.disable('x-powered-by');
        this.app.use(xss());
        this.app.use(hpp());

        const authLimiter = rateLimit({
            windowMs: 2 * 60 * 1000,
            max: 5,
        });
        this.app.use('/api/auth/login', authLimiter);

        const generalLimiter = rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 100,
        });
        this.app.use(generalLimiter);
    }

    setupMiddlewares() {
        this.app.use(cors({
            origin: ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "https://trusted-cdn.com"],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            },
            referrerPolicy: { policy: "strict-origin-when-cross-origin" },
            frameguard: { action: "deny" }
        }));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        this.app.use(session({
            secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            }
        }));
    }

    setupRoutes() {
        this.app.use('/api/auth', authRoutes);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(` Serveur sécurisé en ligne sur http://localhost:${this.port}`);
        });
    }
}

new Server();
