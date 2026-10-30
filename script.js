
/* =========================================
   MYBLOG - COMPLETE JAVASCRIPT
   Login, Register, Create Blog, Dashboard
========================================= */

const API_URL = "http://localhost:3000";

/* Welcome message */
function showMessage() {
    alert("Welcome to my first blog!");
}

/* =========================================
   HELPER: DISPLAY MESSAGES
========================================= */

function showStatus(element, text, color = "red") {
    if (!element) return;

    element.textContent = text;
    element.style.color = color;
}

/* =========================================
   HELPER: SAFE JSON RESPONSE
========================================= */

async function readResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        throw new Error(
            "Server returned an invalid response. Check server.js and API routes."
        );
    }

    return await response.json();
}

/* =========================================
   LOGIN FORM
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        if (!email || !password) {
            showStatus(message, "Please fill in all fields.");
            return;
        }

        try {
            showStatus(message, "Logging in...", "blue");

            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(result.message || "Login failed.");
            }

            if (result.user) {
                localStorage.setItem(
                    "myBlogUser",
                    JSON.stringify(result.user)
                );
            }

            showStatus(
                message,
                result.message || "Login successful!",
                "green"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            console.error("Login error:", error);

            showStatus(
                message,
                error.message === "Failed to fetch"
                    ? "Cannot connect to backend. Make sure server.js is running."
                    : error.message
            );
        }
    });
}

/* =========================================
   REGISTER FORM
========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (!name || !email || !password || !confirmPassword) {
            showStatus(message, "Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus(message, "Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            showStatus(
                message,
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            showStatus(message, "Passwords do not match.");
            return;
        }

        try {
            showStatus(message, "Creating your account...", "blue");

            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message || "Registration failed."
                );
            }

            showStatus(
                message,
                result.message || "Registration successful!",
                "green"
            );

            registerForm.reset();

        } catch (error) {
            console.error("Registration error:", error);

            showStatus(
                message,
                error.message === "Failed to fetch"
                    ? "Cannot connect to backend. Make sure server.js is running."
                    : error.message
            );
        }
    });
}

/* =========================================
   CREATE BLOG FORM
========================================= */

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
    createBlogForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value.trim();

        const message = document.getElementById("createMessage");

        if (!title || !category || !content) {
            showStatus(message, "Please fill in all blog fields.");
            return;
        }

        try {
            showStatus(message, "Publishing your blog...", "blue");

            const response = await fetch(`${API_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content
                })
            });

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message || "Could not publish your blog."
                );
            }

            showStatus(
                message,
                result.message || "Blog published successfully!",
                "green"
            );

            createBlogForm.reset();

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            console.error("Create blog error:", error);

            showStatus(
                message,
                error.message === "Failed to fetch"
                    ? "Cannot connect to backend. Make sure server.js is running."
                    : error.message
            );
        }
    });
}

/* =========================================
   DASHBOARD - DISPLAY BLOG POSTS
========================================= */

const dashboardPosts = document.getElementById("dashboardPosts");

if (dashboardPosts) {
    loadDashboard();
}

async function loadDashboard() {
    const totalPosts = document.getElementById("totalPosts");
    const noPosts = document.getElementById("noPosts");

    dashboardPosts.replaceChildren();

    if (noPosts) {
        noPosts.hidden = true;
    }

    if (totalPosts) {
        totalPosts.textContent = "0";
    }

    try {
        const response = await fetch(`${API_URL}/api/blogs`);
        const result = await readResponse(response);

        if (!response.ok) {
            throw new Error(result.message || "Could not load blogs.");
        }

        const blogs = Array.isArray(result.blogs) ? result.blogs : [];

        if (totalPosts) {
            totalPosts.textContent = blogs.length;
        }

        if (noPosts) {
            noPosts.hidden = blogs.length > 0;
        }

        if (blogs.length === 0) {
            return;
        }

        blogs.forEach(function (blog) {
            const card = document.createElement("article");
            card.className = "dashboard-blog-card";

            const category = document.createElement("span");
            category.className = "blog-category";
            category.textContent = blog.category || "General";

            const title = document.createElement("h3");
            title.textContent = blog.title || "Untitled";

            const content = document.createElement("p");
            content.textContent = blog.content || "";

            const date = document.createElement("span");
            date.className = "blog-date";
            date.textContent =
                "Published: " + (blog.date || "Unknown");

            card.append(category, title, content, date);
            dashboardPosts.appendChild(card);
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to backend. Make sure server.js is running."
                : error.message;

        errorMessage.style.color = "red";
        dashboardPosts.appendChild(errorMessage);
    }
}
