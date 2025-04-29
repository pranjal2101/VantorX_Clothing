document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success || data.status === "ok") {
                sessionStorage.setItem("role", data.role);
                sessionStorage.setItem("username", data.username);

                if (data.role === "admin") {
                    window.location.href = "adminDash.html";
                } else {
                    window.location.href = "index.html"; // Redirect user to website
                }
            } else {
                document.getElementById("error").textContent =
                    data.message || "Invalid credentials.";
            }
        });
    }
});