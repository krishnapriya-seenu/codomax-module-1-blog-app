
function showMessage() {
    alert("Welcome to my first blog!");
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        if (email.trim() === "" || password.trim() === "") {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
        } else {
            message.textContent =
                "Form validated! Login authentication is not connected yet.";
            message.style.color = "green";
        }
    });
}


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (name === "" || email === "" ||
            password === "" || confirmPassword === "") {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        message.textContent =
            "Form validated! Account creation is not connected to a backend yet.";
        message.style.color = "green";
    });
}


/* Create Blog: Save a new story */

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
    createBlogForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value.trim();
        const message = document.getElementById("createMessage");

        if (!title || !category || !content) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        let blogs = [];

        try {
            blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];
            if (!Array.isArray(blogs)) blogs = [];
        } catch {
            blogs = [];
        }

        blogs.push({
            id: Date.now(),
            title: title,
            category: category,
            content: content,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("myBlogs", JSON.stringify(blogs));

        message.textContent = "Blog published successfully!";
        message.style.color = "green";

        createBlogForm.reset();

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 700);
    });
}


/* Dashboard: Display saved stories */

const dashboardPosts = document.getElementById("dashboardPosts");

if (dashboardPosts) {
    let blogs = [];

    try {
        blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];
        if (!Array.isArray(blogs)) blogs = [];
    } catch {
        blogs = [];
    }

    document.getElementById("totalPosts").textContent = blogs.length;

    const noPosts = document.getElementById("noPosts");

    noPosts.hidden = blogs.length > 0;

    blogs.slice().reverse().forEach(function(blog) {
        const card = document.createElement("article");
        card.className = "dashboard-blog-card";

        const category = document.createElement("span");
        category.className = "blog-category";
        category.textContent = blog.category;

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const content = document.createElement("p");
        content.textContent = blog.content;

        const date = document.createElement("span");
        date.className = "blog-date";
        date.textContent = "Published: " + blog.date;

        card.append(category, title, content, date);
        dashboardPosts.appendChild(card);
    });
}
