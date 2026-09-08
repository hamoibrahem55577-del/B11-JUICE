// ==============================
// ACCOUNT PAGE
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // جلب المستخدم الحالي
    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    // لو مفيش مستخدم مسجل دخول
    if (!currentUser) {

        alert("من فضلك سجل الدخول أولاً 👤");

        window.location.href = "user-login.html";

        return;
    }


    // ==============================
    // عرض بيانات المستخدم
    // ==============================

    const nameElement =
        document.getElementById("account-name");

    const phoneElement =
        document.getElementById("account-phone");


    if (nameElement) {
        nameElement.innerText =
            currentUser.name || "-";
    }


    if (phoneElement) {
        phoneElement.innerText =
            currentUser.phone || "-";
    }


    // ==============================
    // جلب الطلبات
    // ==============================

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];


    // طلبات المستخدم فقط
   const myOrders = orders.filter(function (order) {

    if (!order || !order.phone) {
        return false;
    }

return String(order.userPhone) === String(currentUser.phone);
});


    // ==============================
    // عدد الطلبات
    // ==============================

    const ordersCount =
        document.getElementById("my-orders-count");


    if (ordersCount) {

        ordersCount.innerText =
            myOrders.length;

    }


    // ==============================
    // إجمالي المشتريات
    // ==============================

    let totalSales = 0;


    myOrders.forEach(function (order) {

        totalSales +=
            Number(order.total) || 0;

    });


    const totalSalesElement =
        document.getElementById("my-total-sales");


    if (totalSalesElement) {

        totalSalesElement.innerText =
            totalSales + " جنيه";

    }


    // ==============================
    // عرض الطلبات
    // ==============================

    const ordersContainer =
        document.getElementById("my-orders-container");


    if (!ordersContainer) {
        return;
    }


    if (myOrders.length === 0) {

        ordersContainer.innerHTML = `
            <p>
                لا توجد طلبات حتى الآن 🛒
            </p>
        `;

        return;
    }


    ordersContainer.innerHTML = "";


    myOrders.slice().reverse().forEach(function (order) {

        let productsHTML = "";


        if (Array.isArray(order.products)) {

            order.products.forEach(function (product) {

                productsHTML += `
                    <div class="my-order-product">

                        ${product.name}

                        × ${product.quantity}

                        = ${product.total} جنيه

                    </div>
                `;

            });

        }


        ordersContainer.innerHTML += `

            <div class="my-order-card">

                <h3>
                    📦 طلب #${order.id}
                </h3>


                <p>
                    🕒 ${order.date || ""}
                </p>


                <p>
                    📌 الحالة:
                    <strong>
                        ${order.status || "جديد"}
                    </strong>
                </p>


                <div>

                    <strong>
                        المنتجات:
                    </strong>

                    ${productsHTML}

                </div>


                <h3>
                    💰 الإجمالي:
                    ${order.total || 0}
                    جنيه
                </h3>

            </div>

        `;

    });

});