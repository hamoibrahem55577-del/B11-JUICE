// =====================================
// SUPABASE ADMIN LOGIN
// =====================================

async function adminLogin() {

    const usernameInput = document.getElementById("admin-username");
    const passwordInput = document.getElementById("admin-password");
    const errorElement = document.getElementById("login-error");
    const loginButton = document.getElementById("login-button");

    if (!usernameInput || !passwordInput || !errorElement || !loginButton) {
        return;
    }

    const email = usernameInput.value.trim();
    const password = passwordInput.value;

    errorElement.textContent = "";

    // التأكد من البيانات
    if (email === "" || password === "") {
        errorElement.textContent = "❌ من فضلك املأ الإيميل وكلمة المرور";
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "جاري تسجيل الدخول...";

    try {

        const result = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        const loginError = result.error;
        const data = result.data;

        if (loginError) {
            console.error("Supabase Login Error:", loginError);
            throw loginError;
        }

        if (!data || !data.user) {
            throw new Error("لم يتم العثور على المستخدم");
        }

        // تسجيل الدخول بنجاح
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", data.user.email);

        loginButton.textContent = "تم الدخول ✅";

        window.location.href = "admin.html";

    } catch (loginError) {

        console.error("Login failed:", loginError);

        errorElement.textContent =
            "❌ الإيميل أو كلمة المرور غير صحيحة";

        // هنا مش هنمسح الباسورد
        passwordInput.focus();

        loginButton.disabled = false;
        loginButton.textContent = "🔐 تسجيل الدخول";
    }
}


// =====================================
// LOGIN BUTTON
// =====================================

const loginButton = document.getElementById("login-button");

if (loginButton) {
    loginButton.addEventListener("click", adminLogin);
}


// =====================================
// ENTER KEY
// =====================================

const usernameInput = document.getElementById("admin-username");
const passwordInput = document.getElementById("admin-password");

if (usernameInput) {

    usernameInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            adminLogin();
        }

    });

}


if (passwordInput) {

    passwordInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            adminLogin();
        }

    });

}


// =====================================
// CLEAR ERROR WHILE TYPING
// =====================================

if (usernameInput) {

    usernameInput.addEventListener("input", function () {

        const errorElement =
            document.getElementById("login-error");

        if (errorElement) {
            errorElement.textContent = "";
        }

    });

}


if (passwordInput) {

    passwordInput.addEventListener("input", function () {

        const errorElement =
            document.getElementById("login-error");

        if (errorElement) {
            errorElement.textContent = "";
        }

    });

}