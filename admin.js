
// ==============================
// ADMIN SECURITY CHECK
// ==============================

function isAdmin() {

    return localStorage.getItem("adminLoggedIn") === "true";

}


function protectAdminAction() {

    if (!isAdmin()) {

        alert("⚠️ غير مسموح لك بتنفيذ هذا الإجراء");

        window.location.href = "admin-login.html";

        return false;
    }

    return true;
}



let adminProducts = JSON.parse(localStorage.getItem("adminProducts"));

if (!Array.isArray(adminProducts)) {
    adminProducts = [
        {
            name: "Gaming Mouse",
            price: 500,
            oldPrice: 700,
            image: "mouse.jpg.png",
            badge: "الأكثر مبيعاً 🔥",
            stock: "متوفر ✅"
        },
        {
            name: "Gaming Keyboard",
            price: 800,
            oldPrice: 1000,
            image: "keyboard.jpg.png",
            badge: "جديد ✨",
            stock: "متوفر ✅"
        },
        {
            name: "Gaming Headset",
            price: 1000,
            oldPrice: 1300,
            image: "headset.jpg.png",
            badge: "مميز ⭐",
            stock: "متوفر ✅"
        }
    ];

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );
}

function displayAdminProducts() {
    const container = document.getElementById(
        "admin-products-container"
    );

    if (!container) {
        console.log("container مش موجود");
        return;
    }

    container.innerHTML = "";

    adminProducts.forEach(function(product, index) {
        container.innerHTML += `
            <div class="admin-product">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <div class="price">
                    ${product.price} جنيه
                </div>

                <div class="stock">
                    ${product.stock}
                </div>

                <div>
                    ${product.badge}
                </div>

                <div class="admin-actions">

                    <button
                        class="edit-btn"
                        onclick="editProduct(${index})"
                    >
                        ✏️ تعديل
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${index})"
                    >
                        🗑️ حذف
                    </button>

                </div>

            </div>
        `;
    });

    console.log("المنتجات ظهرت بنجاح");
}

function openAddProduct() {


    if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }


    const modal = document.getElementById("product-modal");

    if (!modal) {
        return;
    }

    document.getElementById("modal-title").innerText =
        "إضافة منتج";

    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-old-price").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-badge").value = "";
    document.getElementById("product-stock").value = "متوفر ✅";

    modal.dataset.editIndex = "";

    modal.style.display = "flex";
}

function editProduct(index) {



    if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }


    const product = adminProducts[index];

    if (!product) {
        return;
    }

    const modal = document.getElementById("product-modal");

    if (!modal) {
        return;
    }

    document.getElementById("modal-title").innerText =
        "تعديل المنتج";

    document.getElementById("product-name").value =
        product.name;

    document.getElementById("product-price").value =
        product.price;

    document.getElementById("product-old-price").value =
        product.oldPrice;

    document.getElementById("product-image").value =
        product.image;

    document.getElementById("product-badge").value =
        product.badge;

    document.getElementById("product-stock").value =
        product.stock;

    modal.dataset.editIndex = index;

    modal.style.display = "flex";
}

function deleteProduct(index) {

    if (!protectAdminAction()) {
        return;
    }

 if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }


    const product = adminProducts[index];

    if (!product) {
        return;
    }

    if (!confirm("هل أنت متأكد من حذف " + product.name + " ؟")) {
        return;
    }

    adminProducts.splice(index, 1);

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );

    displayAdminProducts();
}

function closeProductModal() {
    const modal = document.getElementById("product-modal");

    if (modal) {
        modal.style.display = "none";
    }
}

function saveProduct() {

    if (!protectAdminAction()) {
        return;
    }

 if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }


    const name = document.getElementById("product-name").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const oldPrice = Number(document.getElementById("product-old-price").value);
    const image = document.getElementById("product-image").value.trim();
    const badge = document.getElementById("product-badge").value.trim();
    const stock = document.getElementById("product-stock").value;

    if (name === "" || price <= 0 || image === "") {
        alert("من فضلك املأ اسم المنتج والسعر والصورة");
        return;
    }

    const product = {
        name: name,
        price: price,
        oldPrice: oldPrice,
        image: image,
        badge: badge,
        stock: stock
    };

    const modal = document.getElementById("product-modal");
    const editIndex = modal.dataset.editIndex;

    if (editIndex !== "") {
        adminProducts[Number(editIndex)] = product;
    } else {
        adminProducts.push(product);
    }

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );

    displayAdminProducts();
    closeProductModal();

    alert("تم حفظ المنتج بنجاح ✅");
}

displayAdminProducts();


function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
}


// ==============================
// ORDERS
// ==============================

function getOrders() {

    return JSON.parse(
        localStorage.getItem("orders")
    ) || [];

}


// ==============================
// DISPLAY ORDERS
// ==============================

function displayOrders() {

    const container =
        document.getElementById("orders-container");

    if (!container) {
        return;
    }

    const orders = getOrders();

    if (orders.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;color:#aaa;">
                لا توجد طلبات حاليًا 📦
            </p>
        `;

        updateDashboard();
        return;
    }

    container.innerHTML = "";

    orders.slice().reverse().forEach(function(order) {

        let productsHTML = "";

        if (Array.isArray(order.products)) {

            order.products.forEach(function(product) {

                productsHTML += `
                    <div class="order-product">
                        ${product.name}
                        × ${product.quantity}
                        = ${product.total} جنيه
                    </div>
                `;

            });

        }

        container.innerHTML += `
            <div class="order-card">

                <div class="order-header">

                    <h3>
                        📦 طلب #${order.id}
                    </h3>

                    <span class="order-status">
                        ${order.status || "جديد"}
                    </span>

                </div>

                <div class="order-info">

                    👤 الاسم:
                    ${order.customerName || ""}

                    <br>

                    📱 الهاتف:
                    ${order.phone || ""}

                    <br>

                    📍 العنوان:
                    ${order.address || ""}

                    <br>

                    📝 الملاحظات:
                    ${order.note || "لا يوجد"}

                    <br>

                    🕒 التاريخ:
                    ${order.date || ""}

                </div>

                <div class="order-products">

                    <strong>
                        المنتجات:
                    </strong>

                    ${productsHTML}

                </div>

                <div class="order-total">

                    الإجمالي:
                    ${order.total || 0}
                    جنيه 💰

                </div>

                <div class="order-actions">

                    <button
                        class="confirm-order"
                        onclick="updateOrderStatus(${order.id}, 'تم التأكيد ✅')"
                    >
                        تأكيد الطلب
                    </button>

                    <button
                        class="ship-order"
                        onclick="updateOrderStatus(${order.id}, 'تم الشحن 🚚')"
                    >
                        تم الشحن 🚚
                    </button>

                    <button
                        class="deliver-order"
                        onclick="updateOrderStatus(${order.id}, 'تم التسليم 🎉')"
                    >
                        تم التسليم 🎉
                    </button>

                    <button
                        class="delete-order"
                        onclick="deleteOrder(${order.id})"
                    >
                        حذف الطلب 🗑️
                    </button>

                </div>

            </div>
        `;

    });

    updateDashboard();
}


function displayFilteredOrders(orders) {

    const container =
        document.getElementById("orders-container");

    if (!container) {
        return;
    }

    if (orders.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;color:#aaa;">
                لا توجد نتائج 🔎
            </p>
        `;

        return;
    }

    container.innerHTML = "";

    orders.slice().reverse().forEach(function(order) {

        let productsHTML = "";

        if (Array.isArray(order.products)) {

            order.products.forEach(function(product) {

                productsHTML += `
                    <div class="order-product">
                        ${product.name}
                        × ${product.quantity}
                        = ${product.total} جنيه
                    </div>
                `;

            });

        }

        container.innerHTML += `
            <div class="order-card">

                <div class="order-header">

                    <h3>📦 طلب #${order.id}</h3>

                    <span class="order-status">
                        ${order.status || "جديد"}
                    </span>

                </div>

                <div class="order-info">

                    👤 الاسم:
                    ${order.customerName || ""}

                    <br>

                    📱 الهاتف:
                    ${order.phone || ""}

                    <br>

                    📍 العنوان:
                    ${order.address || ""}

                    <br>

                    📝 الملاحظات:
                    ${order.note || "لا يوجد"}

                    <br>

                    🕒 التاريخ:
                    ${order.date || ""}

                </div>

                <div class="order-products">

                    <strong>المنتجات:</strong>

                    ${productsHTML}

                </div>

                <div class="order-total">

                    الإجمالي:
                    ${order.total || 0}
                    جنيه 💰

                </div>

            </div>
        `;

    });

}


const orderSearch = document.getElementById("order-search");

if (orderSearch) {

    orderSearch.addEventListener("input", function() {

        const value =
            orderSearch.value.trim().toLowerCase();

        const orders = getOrders();

        const filteredOrders = orders.filter(function(order) {

            const name =
                (order.customerName || "").toLowerCase();

            const phone =
                (order.phone || "").toLowerCase();

            return (
                name.includes(value) ||
                phone.includes(value)
            );

        });

        displayFilteredOrders(filteredOrders);

    });

}


// ==============================
// NEW ORDER NOTIFICATION
// ==============================

let lastOrdersCount =
    getOrders().length;


function checkNewOrders() {

    let orders = getOrders();

    if (orders.length > lastOrdersCount) {

        let newOrders =
            orders.length - lastOrdersCount;

        alert(
            "🔔 وصل " +
            newOrders +
            " طلب جديد!"
        );

        displayOrders();
    }

    lastOrdersCount =
        orders.length;
}


// فحص الطلبات كل 3 ثواني
setInterval(
    checkNewOrders,
    3000
);

// ==============================
// UPDATE ORDER STATUS
// ==============================

function updateOrderStatus(orderId, newStatus) {

    if (!protectAdminAction()) {
        return;
    }

   if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }



    const orders = getOrders();

    const order = orders.find(function(item) {

        return item.id === orderId;

    });

    if (!order) {
        return;
    }

    order.status = newStatus;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    displayOrders();

}


// ==============================
// DELETE ORDER
// ==============================

function deleteOrder(orderId) {

    if (!protectAdminAction()) {
        return;
    }

 if (!isAdmin()) {
        alert("⚠️ غير مسموح لك");
        window.location.href = "admin-login.html";
        return;
    }


    if (!confirm("هل أنت متأكد من حذف الطلب؟")) {
        return;
    }

    let orders = getOrders();

    orders = orders.filter(function(order) {

        return order.id !== orderId;

    });

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    displayOrders();

}


// ==============================
// DASHBOARD
// ==============================

function updateDashboard() {

    const orders = getOrders();

    const totalOrders = orders.length;

    const newOrders = orders.filter(function(order) {

        return !order.status ||
               order.status === "جديد";

    }).length;


    let totalSales = 0;

    orders.forEach(function(order) {

        totalSales += Number(order.total) || 0;

    });


    const totalOrdersElement =
        document.getElementById("total-orders");

    const newOrdersElement =
        document.getElementById("new-orders");

    const totalSalesElement =
        document.getElementById("total-sales");

    const totalProductsElement =
        document.getElementById("total-products");


    if (totalOrdersElement) {

        totalOrdersElement.innerText =
            totalOrders;

    }


    if (newOrdersElement) {

        newOrdersElement.innerText =
            newOrders;

    }


    if (totalSalesElement) {

        totalSalesElement.innerText =
            totalSales + " جنيه";

    }


    if (totalProductsElement) {

        totalProductsElement.innerText =
            adminProducts.length;

    }

}


// ==============================
// START ADMIN
// ==============================

displayOrders();
updateDashboard();

function highlightNewOrders() {

    const orders = getOrders();

    const newOrdersCard =
        document.getElementById("new-orders");

    if (!newOrdersCard) {
        return;
    }

    const newOrders = orders.filter(function(order) {

        return !order.status ||
               order.status === "جديد";

    }).length;

    if (newOrders > 0) {

        newOrdersCard.style.color = "red";
        newOrdersCard.style.fontWeight = "bold";
        newOrdersCard.style.animation =
            "pulseOrder 1s infinite";

    } else {

        newOrdersCard.style.color = "";
        newOrdersCard.style.animation = "";

    }
}

setInterval(function() {

    updateDashboard();
    highlightNewOrders();

}, 3000);