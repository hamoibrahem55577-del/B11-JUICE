// ==============================
// AUTH PROTECTION
// ==============================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

}


// ==============================
// REQUIRE LOGIN
// ==============================

function requireLogin() {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        alert("⚠️ لازم تسجل دخول الأول");

        window.location.href = "user-login.html";

        return false;
    }

    return true;
}


// ==============================
// FILL CHECKOUT USER DATA
// ==============================

function fillCheckoutUser() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const nameInput =
        document.getElementById("customer-name");

    const phoneInput =
        document.getElementById("customer-phone");


    if (nameInput) {

        nameInput.value =
            currentUser.name || "";

    }


    if (phoneInput) {

        phoneInput.value =
            currentUser.phone || "";

    }

}