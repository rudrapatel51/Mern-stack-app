import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import StudentModel from './models/Student.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js'
import bcrypt from 'bcrypt';


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

                res.cookie("accessToken", accessToken, { maxAge: 2 * 60 * 60 * 1000 }); 
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

app.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ login: false, message: 'Invalid admin credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ login: false, message: 'Invalid admin credentials' });
        }
        const adminToken = jwt.sign({ username: admin.username }, 'jwt-admin-token-secret-key', { expiresIn: '2h' });
        res.cookie('adminToken', adminToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000 }); 
        return res.json({ login: true, adminToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const verifyAdmin = (req, res, next) => {
    // Attempt to retrieve the admin token from cookies or Authorization header
    const adminToken = req.cookies.adminToken || req.headers['authorization']?.split(' ')[1];

    if (!adminToken) {
        return res.status(401).json({ valid: false, message: "No admin token provided" });
    }

    // Verify the admin token
    jwt.verify(adminToken, 'jwt-admin-token-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: "Invalid admin token" });
        } else {
            // Attach the decoded username to the request object
            req.admin = decoded.username;
            next(); // Proceed to the next middleware or route handler
        }
    });
};



app.post('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
});

app.post('/products', async (req, res) => {
    const { name, description, price ,category ,imageUrl } = req.body;
  
    try {
      const newProduct = new Product({ name, description, price ,category ,imageUrl});
      await newProduct.save();
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
