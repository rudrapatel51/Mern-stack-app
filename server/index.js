import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import StudentModel from './models/Student.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/test');

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    StudentModel.create({ name, email, password })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    StudentModel.findOne({ email })
        .then(user => {
            if (user && user.password === password) {
                const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: "2h" });
                const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: "2h" });

                res.cookie("accessToken", accessToken, { maxAge: 2 * 60 * 60 * 1000 }); // 2 hours in milliseconds
                res.cookie("refreshToken", refreshToken,
                    { maxAge: 3000000, httpOnly: true, secure: true, sameSite: "strict" });
                return res.json({ Login: true });
            } else {
                return res.json({ Login: false, Message: "Invalid credentials" });
            }
        })
        .catch(err => res.json(err));
});

const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        if (renewToken(req, res)) {
            next();
        } else {
            return res.json({ valid: false, message: "No access token provided" });
        }
    } else {
        jwt.verify(accessToken, 'jwt-access-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" });
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};

const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return false;
    } else {
        jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if (err) {
                res.clearCookie("refreshToken");
                return res.json({ valid: false, message: "Invalid Refresh Token" });
            } else {
                const accessToken = jwt.sign({ email: decoded.email }, "jwt-access-token-secret-key", { expiresIn: "2h" });
                res.cookie("accessToken", accessToken, { maxAge: 2 * 60 * 60 * 1000 });
                return true;
            }
        });
    }
};

app.get('/user', verifyUser, (req, res) => {
    const email = req.email;
    StudentModel.findOne({ email })
        .then(user => {
            if (user) {
                return res.json({ valid: true, user });
            } else {
                return res.json({ valid: false, message: "User not found" });
            }
        })
        .catch(err => res.json(err));
});

app.post('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
});




app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
