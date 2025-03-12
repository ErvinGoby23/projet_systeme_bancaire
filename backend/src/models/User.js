const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(nom, prenom, email, password, telephone, verificationToken) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.getConnection().execute(
                "INSERT INTO User (nom, prenom, email, password, role, telephone, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [nom, prenom, email, hashedPassword, 'client', telephone, verificationToken]
            );
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    static async findByEmail(email) {
        try {
            const [rows] = await db.getConnection().execute(
                "SELECT * FROM User WHERE email = ?",
                [email]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async verifyEmail(token) {
        try {
            const [result] = await db.getConnection().execute(
                "UPDATE User SET verified = TRUE, verification_token = NULL WHERE verification_token = ?",
                [token]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Ajout de la gestion du resetToken
    static async setResetToken(email, resetToken) {
        try {
            await db.getConnection().execute(
                "UPDATE User SET reset_token = ? WHERE email = ?",
                [resetToken, email]
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async findByResetToken(resetToken) {
        try {
            const [rows] = await db.getConnection().execute(
                "SELECT * FROM User WHERE reset_token = ?",
                [resetToken]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updatePassword(email, hashedPassword) {
        try {
            await db.getConnection().execute(
                "UPDATE User SET password = ? WHERE email = ?",
                [hashedPassword, email]
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async clearResetToken(email) {
        try {
            await db.getConnection().execute(
                "UPDATE User SET reset_token = NULL WHERE email = ?",
                [email]
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = User;
