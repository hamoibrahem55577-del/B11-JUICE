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


// ==============================
// PRODUCTS - SUPABASE
// ==============================

let adminProducts = [];


// ==============================
// LOAD PRODUCTS FROM SUPABASE
// ==============================

async function loadProducts() {

    const container = document.getElementById(
        "admin-products-container"
    );

    try {

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error("Supabase products error:", error);

            if (container) {
                container.innerHTML = `
                    <p style="text-align:center;color:#ff6b6b;">
                        ❌ حدث خطأ أثناء تحميل المنتجات
                    </p>
                `;
            }

            return;
        }

        adminProducts = (data || []).map(function(product) {

            return {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                oldPrice: Number(product.old_price) || 0,
                image: product.image || "",
                badge: product.badge || "",
                stock: product.stock || "متوفر ✅"
            };

        });


        // =====================================
        // MIGRATE OLD LOCAL PRODUCTS - ONCE
        // =====================================

        if (adminProducts.length === 0) {

            const oldProducts =
                JSON.parse(
                    localStorage.getItem("adminProducts")
                );

            if (
                Array.isArray(oldProducts) &&
                oldProducts.length > 0
            ) {

                console.log(
                    "وجدنا منتجات قديمة، جاري نقلها إلى Supabase..."
                );

                const productsToInsert =
                    oldProducts.map(function(product) {

                        return {
                            name: product.name,
                            price: Number(product.price) || 0,
                            old_price:
                                Number(product.oldPrice) || 0,
                            image: product.image || "",
                            badge: product.badge || "",
                            stock:
                                product.stock || "متوفر ✅"
                        };

                    });


                const {
                    data: migratedData,
                    error: migrateError
                } = await supabaseClient
                    .from("products")
                    .insert(productsToInsert)
                    .select();


                if (migrateError) {

                    console.error(
                        "Migration error:",
                        migrateError
                    );

                    alert(
                        "⚠️ المنتجات القديمة موجودة، لكن لم يتم نقلها إلى Supabase."
                    );

                } else {

                    console.log(
                        "تم نقل المنتجات القديمة بنجاح ✅"
                    );

                    adminProducts =
                        (migratedData || []).map(
                            function(product) {

                                return {
                                    id: product.id,
                                    name: product.name,
                                    price:
                                        Number(product.price),
                                    oldPrice:
                                        Number(product.old_price) || 0,
                                    image:
                                        product.image || "",
                                    badge:
                                        product.badge || "",
                                    stock:
                                        product.stock ||
                                        "متوفر ✅"
                                };

                            }
                        );

                    // حذف النسخة القديمة المحلية
                    localStorage.removeItem(
                        "adminProducts"
                    );

                }

            }

        }


        displayAdminProducts();
        updateDashboard();

        console.log(
            "تم تحميل المنتجات من Supabase ✅"
        );

    } catch (error) {

        console.error(
            "Unexpected products error:",
            error
        );

    }

}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayAdminProducts() {

    const container = document.getElementById(
        "admin-products-container"
    );

    if (!container) {
        console.log("container مش موجود");
        return;
    }


    if (adminProducts.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#aaa;
                width:100%;
            ">
                لا توجد منتجات حاليًا 📦
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    adminProducts.forEach(function(product, index) {

        container.innerHTML += `

            <div class="admin-product">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="price">
                    ${product.price} جنيه
                </div>

                ${
                    product.oldPrice > 0
                    ?
                    `
                    <div style="
                        text-decoration:line-through;
                        color:#999;
                    ">
                        ${product.oldPrice} جنيه
                    </div>
                    `
                    :
                    ""
                }

                <div class="stock">
                    ${escapeHTML(product.stock)}
                </div>

                <div>
                    ${escapeHTML(product.badge)}
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


    console.log(
        "المنتجات ظهرت بنجاح"
    );

}


// ==============================
// ESCAPE HTML
// ==============================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==============================
// ADD PRODUCT
// ==============================

function openAddProduct() {

    if (!isAdmin()) {

        alert("⚠️ غير مسموح لك");

        window.location.href =
            "admin-login.html";

        return;
    }


    const modal =
        document.getElementById("product-modal");


    if (!modal) {
        return;
    }


    document.getElementById(
        "modal-title"
    ).innerText = "إضافة منتج";


    document.getElementById(
        "product-name"
    ).value = "";


    document.getElementById(
        "product-price"
    ).value = "";


    document.getElementById(
        "product-old-price"
    ).value = "";


    document.getElementById(
        "product-image"
    ).value = "";


    document.getElementById(
        "product-badge"
    ).value = "";


    document.getElementById(
        "product-stock"
    ).value = "متوفر ✅";


    modal.dataset.editIndex = "";


    modal.style.display = "flex";

}


// ==============================
// EDIT PRODUCT
// ==============================

function editProduct(index) {

    if (!isAdmin()) {

        alert("⚠️ غير مسموح لك");

        window.location.href =
            "admin-login.html";

        return;
    }


    const product =
        adminProducts[index];


    if (!product) {
        return;
    }


    const modal =
        document.getElementById("product-modal");


    if (!modal) {
        return;
    }


    document.getElementById(
        "modal-title"
    ).innerText = "تعديل المنتج";


    document.getElementById(
        "product-name"
    ).value = product.name;


    document.getElementById(
        "product-price"
    ).value = product.price;


    document.getElementById(
        "product-old-price"
    ).value = product.oldPrice;


    document.getElementById(
        "product-image"
    ).value = product.image;


    document.getElementById(
        "product-badge"
    ).value = product.badge;


    document.getElementById(
        "product-stock"
    ).value = product.stock;


    modal.dataset.editIndex = index;


    modal.style.display = "flex";

}


// ==============================
// DELETE PRODUCT
// ==============================

async function deleteProduct(index) {

    if (!protectAdminAction()) {
        return;
    }


    const product =
        adminProducts[index];


    if (!product) {
        return;
    }


    if (
        !confirm(
            "هل أنت متأكد من حذف " +
            product.name +
            " ؟"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from("products")
            .delete()
            .eq("id", product.id);


        if (error) {

            console.error(
                "Delete product error:",
                error
            );

            alert(
                "❌ حدث خطأ أثناء حذف المنتج"
            );

            return;
        }


        adminProducts.splice(index, 1);


        displayAdminProducts();


        updateDashboard();


        alert(
            "تم حذف المنتج بنجاح ✅"
        );


    } catch (error) {

        console.error(error);

        alert(
            "❌ حدث خطأ غير متوقع"
        );

    }

}


// ==============================
// CLOSE PRODUCT MODAL
// ==============================

function closeProductModal() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==============================
// SAVE PRODUCT
// ==============================

async function saveProduct() {

    if (!protectAdminAction()) {
        return;
    }


    const name =
        document.getElementById(
            "product-name"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "product-price"
            ).value
        );


    const oldPrice =
        Number(
            document.getElementById(
                "product-old-price"
            ).value
        ) || 0;


    const image =
        document.getElementById(
            "product-image"
        ).value.trim();


    const badge =
        document.getElementById(
            "product-badge"
        ).value.trim();


    const stock =
        document.getElementById(
            "product-stock"
        ).value;


    if (
        name === "" ||
        price <= 0 ||
        image === ""
    ) {

        alert(
            "من فضلك املأ اسم المنتج والسعر والصورة"
        );

        return;
    }


    const modal =
        document.getElementById(
            "product-modal"
        );


    const editIndex =
        modal.dataset.editIndex;


    try {

        // ==========================
        // UPDATE PRODUCT
        // ==========================

        if (editIndex !== "") {

            const product =
                adminProducts[
                    Number(editIndex)
                ];


            if (!product) {
                return;
            }


            const {
                data,
                error
            } = await supabaseClient
                .from("products")
                .update({
                    name: name,
                    price: price,
                    old_price: oldPrice,
                    image: image,
                    badge: badge,
                    stock: stock
                })
                .eq("id", product.id)
                .select()
                .single();


            if (error) {

                console.error(
                    "Update product error:",
                    error
                );

                alert(
                    "❌ حدث خطأ أثناء تعديل المنتج"
                );

                return;
            }


            adminProducts[
                Number(editIndex)
            ] = {

                id: data.id,
                name: data.name,
                price: Number(data.price),
                oldPrice:
                    Number(data.old_price) || 0,
                image: data.image || "",
                badge: data.badge || "",
                stock:
                    data.stock ||
                    "متوفر ✅"

            };

        }

        // ==========================
        // ADD PRODUCT
        // ==========================

        else {

            const {
                data,
                error
            } = await supabaseClient
                .from("products")
                .insert({

                    name: name,
                    price: price,
                    old_price: oldPrice,
                    image: image,
                    badge: badge,
                    stock: stock

                })
                .select()
                .single();


            if (error) {

                console.error(
                    "Insert product error:",
                    error
                );

                alert(
                    "❌ حدث خطأ أثناء إضافة المنتج"
                );

                return;
            }


            adminProducts.push({

                id: data.id,
                name: data.name,
                price: Number(data.price),
                oldPrice:
                    Number(data.old_price) || 0,
                image: data.image || "",
                badge: data.badge || "",
                stock:
                    data.stock ||
                    "متوفر ✅"

            });

        }


        displayAdminProducts();


        updateDashboard();


        closeProductModal();


        alert(
            "تم حفظ المنتج بنجاح ✅"
        );


    } catch (error) {

        console.error(
            "Save product error:",
            error
        );

        alert(
            "❌ حدث خطأ غير متوقع أثناء حفظ المنتج"
        );

    }

}


// ==============================
// ADMIN LOGOUT
// ==============================

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    localStorage.removeItem(
        "adminLoggedIn"
    );

    localStorage.removeItem(
        "adminEmail"
    );


    window.location.href =
        "admin-login.html";

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
        document.getElementById(
            "orders-container"
        );


    if (!container) {
        return;
    }


    const orders = getOrders();


    if (orders.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#aaa;
            ">
                لا توجد طلبات حاليًا 📦
            </p>
        `;


        updateDashboard();


        return;
    }


    container.innerHTML = "";


    orders
        .slice()
        .reverse()
        .forEach(function(order) {

            let productsHTML = "";


            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(product) {

                        productsHTML += `
                            <div class="order-product">
                                ${product.name}
                                × ${product.quantity}
                                = ${product.total} جنيه
                            </div>
                        `;

                    }
                );

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
                            onclick="
                                updateOrderStatus(
                                    ${order.id},
                                    'تم التأكيد ✅'
                                )
                            "
                        >
                            تأكيد الطلب
                        </button>


                        <button
                            class="ship-order"
                            onclick="
                                updateOrderStatus(
                                    ${order.id},
                                    'تم الشحن 🚚'
                                )
                            "
                        >
                            تم الشحن 🚚
                        </button>


                        <button
                            class="deliver-order"
                            onclick="
                                updateOrderStatus(
                                    ${order.id},
                                    'تم التسليم 🎉'
                                )
                            "
                        >
                            تم التسليم 🎉
                        </button>


                        <button
                            class="delete-order"
                            onclick="
                                deleteOrder(${order.id})
                            "
                        >
                            حذف الطلب 🗑️
                        </button>

                    </div>

                </div>

            `;

        });


    updateDashboard();

}


// ==============================
// FILTER ORDERS
// ==============================

function displayFilteredOrders(orders) {

    const container =
        document.getElementById(
            "orders-container"
        );


    if (!container) {
        return;
    }


    if (orders.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#aaa;
            ">
                لا توجد نتائج 🔎
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    orders
        .slice()
        .reverse()
        .forEach(function(order) {

            let productsHTML = "";


            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(product) {

                        productsHTML += `
                            <div class="order-product">
                                ${product.name}
                                × ${product.quantity}
                                = ${product.total} جنيه
                            </div>
                        `;

                    }
                );

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

                </div>

            `;

        });

}


// ==============================
// ORDER SEARCH
// ==============================

const orderSearch =
    document.getElementById(
        "order-search"
    );


if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function() {

            const value =
                orderSearch.value
                    .trim()
                    .toLowerCase();


            const orders =
                getOrders();


            const filteredOrders =
                orders.filter(
                    function(order) {

                        const name =
                            (
                                order.customerName ||
                                ""
                            ).toLowerCase();


                        const phone =
                            (
                                order.phone ||
                                ""
                            ).toLowerCase();


                        return (
                            name.includes(value) ||
                            phone.includes(value)
                        );

                    }
                );


            displayFilteredOrders(
                filteredOrders
            );

        }
    );

}


// ==============================
// NEW ORDER NOTIFICATION
// ==============================

let lastOrdersCount =
    getOrders().length;


function checkNewOrders() {

    const orders =
        getOrders();


    if (
        orders.length >
        lastOrdersCount
    ) {

        const newOrders =
            orders.length -
            lastOrdersCount;


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


setInterval(
    checkNewOrders,
    3000
);


// ==============================
// UPDATE ORDER STATUS
// ==============================

function updateOrderStatus(
    orderId,
    newStatus
) {

    if (!protectAdminAction()) {
        return;
    }


    const orders =
        getOrders();


    const order =
        orders.find(
            function(item) {

                return item.id === orderId;

            }
        );


    if (!order) {
        return;
    }


    order.status =
        newStatus;


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


    if (
        !confirm(
            "هل أنت متأكد من حذف الطلب؟"
        )
    ) {
        return;
    }


    let orders =
        getOrders();


    orders =
        orders.filter(
            function(order) {

                return order.id !== orderId;

            }
        );


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

    const orders =
        getOrders();


    const totalOrders =
        orders.length;


    const newOrders =
        orders.filter(
            function(order) {

                return (
                    !order.status ||
                    order.status === "جديد"
                );

            }
        ).length;


    let totalSales = 0;


    orders.forEach(
        function(order) {

            totalSales +=
                Number(order.total) || 0;

        }
    );


    const totalOrdersElement =
        document.getElementById(
            "total-orders"
        );


    const newOrdersElement =
        document.getElementById(
            "new-orders"
        );


    const totalSalesElement =
        document.getElementById(
            "total-sales"
        );


    const totalProductsElement =
        document.getElementById(
            "total-products"
        );


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
            totalSales +
            " جنيه";

    }


    if (totalProductsElement) {

        totalProductsElement.innerText =
            adminProducts.length;

    }

}


// ==============================
// HIGHLIGHT NEW ORDERS
// ==============================

function highlightNewOrders() {

    const orders =
        getOrders();


    const newOrdersCard =
        document.getElementById(
            "new-orders"
        );


    if (!newOrdersCard) {
        return;
    }


    const newOrders =
        orders.filter(
            function(order) {

                return (
                    !order.status ||
                    order.status === "جديد"
                );

            }
        ).length;


    if (newOrders > 0) {

        newOrdersCard.style.color =
            "red";


        newOrdersCard.style.fontWeight =
            "bold";


        newOrdersCard.style.animation =
            "pulseOrder 1s infinite";

    } else {

        newOrdersCard.style.color =
            "";


        newOrdersCard.style.animation =
            "";

    }

}


// ==============================
// START ADMIN
// ==============================

loadProducts();

displayOrders();

updateDashboard();


setInterval(
    function() {

        updateDashboard();

        highlightNewOrders();

    },
    3000
);