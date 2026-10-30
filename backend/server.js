
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err.message);
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", userSchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    category: String,
    content: String,
    date: {
        type: String,
        default: () => new Date().toLocaleDateString()
    }
});

const Blog = mongoose.model("Blog", blogSchema);

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to My Blog Backend!",
        status: "Server is running successfully"
    });
});

// Register API
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});

// Create Blog API
app.post("/api/blogs", async (req, res) => {
    try {
        const { title, category, content } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Please fill in all blog fields."
            });
        }

        const blog = await Blog.create({
            title: title.trim(),
            category,
            content: content.trim()
        });

        res.status(201).json({
            message: "Blog published successfully!",
            blog: {
                id: blog._id,
                title: blog.title,
                category: blog.category,
                content: blog.content,
                date: blog.date
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Blog creation failed.",
            error: error.message
        });
    }
});

// Get All Blogs API
app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ _id: -1 });

        res.json({
            blogs: blogs.map(blog => ({
                id: blog._id,
                title: blog.title,
                category: blog.category,
                content: blog.content,
                date: blog.date
            }))
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not fetch blogs."
        });
    }
});

// Get Individual Blog API
app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json({
            blog: {
                id: blog._id,
                title: blog.title,
                category: blog.category,
                content: blog.content,
                date: blog.date
            }
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid blog ID."
        });
    }
});

// Unknown Routes
app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.path}`
    });
});
