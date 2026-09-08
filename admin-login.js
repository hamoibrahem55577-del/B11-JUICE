// ========================================
// ADMIN LOGIN
// ========================================

function adminLogin() {

    const usernameInput =
        document.getElementById("admin-username");

    const passwordInput =
        document.getElementById("admin-password");

    const error =
        document.getElementById("login-error");

    const loginButton =
        document.getElementById("login-button");


    // التأكد من وجود العناصر
    if (
        !usernameInput ||
        !passwordInput ||
        !error ||
        !loginButton
    ) {
        return;
    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // مسح رسالة الخطأ القديمة
    error.textContent = "";


    // ========================================
    // التحقق من البيانات
    // ========================================

    if (username === "" || password === "") {

        error.textContent =
            "❌ من فضلك املأ جميع البيانات";

        return;
    }


    // ========================================
    // بيانات الأدمن المؤقتة
    // ========================================

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "1234";


    // ========================================
    // LOGIN
    // ========================================

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        // حفظ حالة تسجيل الدخول
        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        // حفظ اسم الأدمن
        localStorage.setItem(
            "adminUsername",
            username
        );


        // تعطيل الزر مؤقتًا
        loginButton.disabled = true;

        loginButton.textContent =
            "جاري الدخول...";


        // الانتقال للوحة التحكم
        setTimeout(function () {

            window.location.href =
                "admin.html";

        }, 300);


    } else {

        // بيانات خاطئة
        error.textContent =
            "❌ اسم المستخدم أو كلمة المرور غير صحيحة";


        // مسح كلمة المرور
        passwordInput.value = "";

        passwordInput.focus();

    }

}


// ========================================
// LOGIN BUTTON
// ========================================

const loginButton =
    document.getElementById("login-button");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        adminLogin
    );

}


// ========================================
// ENTER KEY
// ========================================

const usernameInput =
    document.getElementById("admin-username");

const passwordInput =
    document.getElementById("admin-password");


if (usernameInput) {

    usernameInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                adminLogin();

            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                adminLogin();

            }

        }
    );

}


// ========================================
// CLEAR ERROR WHILE TYPING
// ========================================

if (usernameInput) {

    usernameInput.addEventListener(
        "input",
        function () {

            const error =
                document.getElementById("login-error");

            if (error) {
                error.textContent = "";
            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        function () {

            const error =
                document.getElementById("login-error");

            if (error) {
                error.textContent = "";
            }

        }
    );

}