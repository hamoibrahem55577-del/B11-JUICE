function requireAdmin() {

    const adminLoggedIn =
        localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {

        window.location.replace("admin-login.html");

        return false;
    }

    return true;
}

if (!requireAdmin()) {

    document.body.innerHTML = "";

}