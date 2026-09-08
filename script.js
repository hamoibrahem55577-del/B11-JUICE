// =====================================================
// B11 JUICE - MAIN SCRIPT
// =====================================================


// =====================================================
// STORAGE HELPERS
// =====================================================

function getStorageJSON(key, defaultValue) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return defaultValue;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Storage Error:", key, error);

        return defaultValue;
    }
}


function saveStorageJSON(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error("Save Storage Error:", key, error);
    }
}


// =====================================================
// STORE SETTINGS
// =====================================================

const STORE_WHATSAPP = "201214744008";


// =====================================================
// PRODUCTS
// =====================================================

let products = getStorageJSON(
    "adminProducts",
    []
);


if (!Array.isArray(products)) {
    products = [];
}


// =====================================================
// NORMALIZE PRODUCTS
// =====================================================

function normalizeProducts() {

    let changed = false;


    products = products.map(function(product, index) {

        if (!product || typeof product !== "object") {
            changed = true;

            return null;
        }


        // ID
        if (
            product.id === undefined ||
            product.id === null ||
            product.id === ""
        ) {

            product.id =
                "product_" +
                Date.now() +
                "_" +
                index;

            changed = true;

        } else {

            const newId =
                String(product.id);

            if (product.id !== newId) {

                product.id = newId;

                changed = true;
            }
        }


        // Name
        product.name =
            String(product.name || "");


        // Price
        product.price =
            Number(product.price) || 0;


        // Old Price
        product.oldPrice =
            Number(product.oldPrice) || 0;


        // Image
        product.image =
            String(product.image || "");


        // Badge
        product.badge =
            String(product.badge || "");


        // Stock
        product.stock =
            String(
                product.stock ||
                "متوفر ✅"
            );


        return product;

    });


    products =
        products.filter(function(product) {

            return product !== null;

        });


    if (changed) {

        saveStorageJSON(
            "adminProducts",
            products
        );

    }

}


normalizeProducts();


// =====================================================
// GET PRODUCT BY ID
// =====================================================

function getProductById(productId) {

    const id =
        String(productId);


    return products.find(function(product) {

        return String(product.id) === id;

    });

}


// =====================================================
// GET PRODUCT BY NAME
// =====================================================

function getProductByName(productName) {

    return products.find(function(product) {

        return (
            String(product.name) ===
            String(productName)
        );

    });

}


// =====================================================
// USER SYSTEM
// =====================================================

function getCurrentUser() {

    return getStorageJSON(
        "currentUser",
        null
    );

}


// =====================================================
// USER IDENTIFIER
// =====================================================

function getUserIdentifier() {

    const user =
        getCurrentUser();


    if (user && user.phone) {

        return String(
            user.phone
        );

    }


    let guestId =
        localStorage.getItem(
            "guestId"
        );


    if (!guestId) {

        guestId =
            "guest_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10);


        localStorage.setItem(
            "guestId",
            guestId
        );

    }


    return guestId;

}


// =====================================================
// CART KEY
// =====================================================

function getCartKey() {

    return (
        "cart_" +
        getUserIdentifier()
    );

}


// =====================================================
// GET CART
// =====================================================

function getCart() {

    const cartData =
        getStorageJSON(
            getCartKey(),
            []
        );


    if (!Array.isArray(cartData)) {

        return [];

    }


    return cartData
        .map(function(item) {

            return {

                productId:
                    String(
                        item.productId
                    ),

                quantity:
                    Number(
                        item.quantity
                    ) || 1

            };

        })
        .filter(function(item) {

            return (
                item.productId !== "" &&
                item.quantity > 0
            );

        });

}


// =====================================================
// CART
// =====================================================

let cart =
    getCart();


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    saveStorageJSON(
        getCartKey(),
        cart
    );

}


// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {
        return;
    }


    let totalQuantity = 0;


    cart.forEach(function(item) {

        totalQuantity +=
            Number(item.quantity) || 0;

    });


    cartCount.innerText =
        totalQuantity;

}


// =====================================================
// RATINGS
// =====================================================

let ratings =
    getStorageJSON(
        "ratings",
        {}
    );


if (
    !ratings ||
    typeof ratings !== "object" ||
    Array.isArray(ratings)
) {

    ratings = {};

}


// =====================================================
// FAVORITES KEY
// =====================================================

function getFavoritesKey() {

    return (
        "favorites_" +
        getUserIdentifier()
    );

}


// =====================================================
// GET FAVORITES
// =====================================================

function getFavorites() {

    const data =
        getStorageJSON(
            getFavoritesKey(),
            []
        );


    if (!Array.isArray(data)) {

        return [];

    }


    return data.map(function(id) {

        return String(id);

    });

}


// =====================================================
// FAVORITES
// =====================================================

let favorites =
    getFavorites();


// =====================================================
// REFRESH FAVORITES
// =====================================================

function refreshFavorites() {

    favorites =
        getFavorites();

}

// =====================================================
// GET FAVORITES - CLEAN INVALID PRODUCTS
// =====================================================

function getFavorites() {

    const data =
        getStorageJSON(
            getFavoritesKey(),
            []
        );


    if (!Array.isArray(data)) {

        return [];

    }


    // تحويل الـ IDs إلى String
    let validFavorites =
        data.map(function(id) {

            return String(id);

        });


    // إزالة التكرار
    validFavorites =
        [...new Set(validFavorites)];


    // الاحتفاظ بالمنتجات الموجودة فقط
    validFavorites =
        validFavorites.filter(function(id) {

            return Boolean(
                getProductById(id)
            );

        });


    // حفظ القائمة النظيفة
    saveStorageJSON(
        getFavoritesKey(),
        validFavorites
    );


    return validFavorites;

}

// =====================================================
// ADD / REMOVE FAVORITE
// =====================================================

function addToFavorite(productId) {

    productId =
        String(productId);


    refreshFavorites();


    const product =
        getProductById(
            productId
        );


    if (!product) {

        alert(
            "⚠️ المنتج غير موجود"
        );

        return;

    }


    const index =
        favorites.indexOf(
            productId
        );


    if (index === -1) {

        favorites.push(
            productId
        );


        alert(
            "اتضاف للمفضلة ❤️"
        );

    } else {

        favorites.splice(
            index,
            1
        );


        alert(
            "اتشال من المفضلة 💔"
        );

    }


    saveStorageJSON(
        getFavoritesKey(),
        favorites
    );


    updateFavoriteCount();


    displayProducts(
        products
    );


    displayFavorites();

}


// =====================================================
// PRODUCTS CONTAINER
// =====================================================

let container =
    document.getElementById(
        "products-container"
    );


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(productsList) {

    if (!container) {
        return;
    }


    refreshFavorites();


    container.innerHTML =
        "";


    if (
        !Array.isArray(productsList) ||
        productsList.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-products">

                <div class="empty-icon">
                    🧃
                </div>

                <h3>
                    لا توجد منتجات حاليًا
                </h3>

                <p>
                    تابعنا علشان تعرف أحدث العصائر 💜
                </p>

            </div>

        `;

        return;

    }


    productsList.forEach(function(product) {

        const isFavorite =
            favorites.includes(
                String(product.id)
            );


        const isOutOfStock =
            product.stock ===
            "غير متوفر ❌";


        container.innerHTML += `

            <div
                class="product"
                onclick="
                    openProduct('${product.id}')
                "
            >

                <div class="badge">

                    ${product.badge || ""}

                </div>


                <div class="stock">

                    ${
                        product.stock ||
                        "متوفر ✅"
                    }

                </div>


                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <h3>

                    ${product.name}

                </h3>


                <p>

                    عصير B11 JUICE فريش وبجودة عالية 🧃

                </p>


                <div class="price">

                    ${
                        product.oldPrice > 0
                        ? `

                            <del>

                                ${product.oldPrice}
                                جنيه

                            </del>

                        `
                        : ""
                    }


                    <strong>

                        ${product.price}
                        جنيه

                    </strong>

                </div>


                <div class="rating">

                    <button
                        type="button"
                        class="favorite"
                        onclick="
                            event.stopPropagation();
                            addToFavorite('${product.id}')
                        "
                    >

                        ${
                            isFavorite
                            ? "💚"
                            : "❤️"
                        }

                    </button>


                    ${createStars(product)}

                </div>


                <button
                    type="button"
                    ${
                        isOutOfStock
                        ? "disabled"
                        : ""
                    }

                    onclick="
                        event.stopPropagation();
                        addToCart('${product.id}')
                    "
                >

                    ${
                        isOutOfStock
                        ? "غير متوفر ❌"
                        : "أضف للسلة 🛒"
                    }

                </button>

            </div>

        `;

    });

}


// =====================================================
// INITIAL PRODUCTS
// =====================================================

if (container) {

    displayProducts(
        products
    );

}


// =====================================================
// SEARCH
// =====================================================

let search =
    document.getElementById(
        "search"
    );


if (search) {

    search.addEventListener(
        "input",
        function() {

            const value =
                search.value
                    .toLowerCase()
                    .trim();


            const filteredProducts =
                products.filter(
                    function(product) {

                        return String(
                            product.name || ""
                        )
                        .toLowerCase()
                        .includes(value);

                    }
                );


            displayProducts(
                filteredProducts
            );

        }
    );

}


// =====================================================
// FILTER
// =====================================================

function filterProducts(category) {

    if (category === "all") {

        displayProducts(
            products
        );

        return;

    }


    const filteredProducts =
        products.filter(
            function(product) {

                return String(
                    product.name || ""
                )
                .includes(category);

            }
        );


    displayProducts(
        filteredProducts
    );

}


// =====================================================
// SORT
// =====================================================

function sortProducts(type) {

    const sortedProducts =
        [...products];


    if (type === "low") {

        sortedProducts.sort(
            function(a, b) {

                return (
                    Number(a.price) -
                    Number(b.price)
                );

            }
        );

    }


    if (type === "high") {

        sortedProducts.sort(
            function(a, b) {

                return (
                    Number(b.price) -
                    Number(a.price)
                );

            }
        );

    }


    displayProducts(
        sortedProducts
    );

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    productId =
        String(productId);


    const product =
        getProductById(
            productId
        );


    if (!product) {

        alert(
            "⚠️ المنتج غير موجود"
        );

        return;

    }


    if (
        product.stock ===
        "غير متوفر ❌"
    ) {

        alert(
            "⚠️ المنتج غير متوفر حاليًا"
        );

        return;

    }


    const existingProduct =
        cart.find(
            function(item) {

                return (
                    String(item.productId) ===
                    productId
                );

            }
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            productId:
                productId,

            quantity:
                1

        });

    }


    saveCart();


    updateCartCount();


    alert(
        product.name +
        " اتضاف للسلة 🛒"
    );

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(productId) {

    productId =
        String(productId);


    cart =
        cart.filter(
            function(item) {

                return (
                    String(item.productId) !==
                    productId
                );

            }
        );


    saveCart();


    updateCartCount();


    displayCart();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
    productId,
    change
) {

    productId =
        String(productId);


    const item =
        cart.find(
            function(cartItem) {

                return (
                    String(
                        cartItem.productId
                    ) ===
                    productId
                );

            }
        );


    if (!item) {
        return;
    }


    item.quantity +=
        Number(change);


    if (
        item.quantity <=
        0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    saveCart();


    updateCartCount();


    displayCart();

}


// =====================================================
// CART CONTAINER
// =====================================================

let cartItems =
    document.getElementById(
        "cart-items"
    );


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    if (!cartItems) {
        return;
    }


    // تنظيف المنتجات المحذوفة من الأدمن
    cart =
        cart.filter(
            function(cartItem) {

                return Boolean(
                    getProductById(
                        cartItem.productId
                    )
                );

            }
        );


    saveCart();


    updateCartCount();


    cartItems.innerHTML =
        "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    السلة فارغة
                </h3>

                <p>
                    ابدأ بإضافة العصائر اللي بتحبها 💜
                </p>

                <a href="products.html">
                    تصفح المنتجات 🧃
                </a>

            </div>

        `;

        return;

    }


    let total =
        0;


    cart.forEach(function(cartItem) {

        const product =
            getProductById(
                cartItem.productId
            );


        if (!product) {
            return;
        }


        const quantity =
            Number(
                cartItem.quantity
            ) || 1;


        const productTotal =
            Number(product.price) *
            quantity;


        total +=
            productTotal;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <strong>
                        ${product.price}
                        جنيه
                    </strong>


                    <div class="quantity">

                        <button
                            type="button"
                            onclick="
                                changeQuantity(
                                    '${product.id}',
                                    -1
                                )
                            "
                        >
                            −
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            onclick="
                                changeQuantity(
                                    '${product.id}',
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>


                    <p>

                        الإجمالي:

                        <strong>
                            ${productTotal}
                            جنيه
                        </strong>

                    </p>

                </div>


                <button
                    type="button"
                    class="remove-cart"
                    onclick="
                        removeFromCart(
                            '${product.id}'
                        )
                    "
                >

                    حذف ❌

                </button>

            </div>

        `;

    });


    cartItems.innerHTML += `

        <div class="cart-total">

            <span>
                الإجمالي
            </span>


            <strong>
                ${total} جنيه 💰
            </strong>

        </div>

    `;

}


// =====================================================
// CHECKOUT
// =====================================================

function checkout() {

    sendOrder();

}


// =====================================================
// SEND ORDER
// =====================================================

function sendOrder() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        alert(
            "⚠️ لازم تسجل دخول الأول علشان تقدر تعمل طلب"
        );


        window.location.href =
            "user-login.html";


        return;

    }


    if (cart.length === 0) {

        alert(
            "السلة فارغة 🛒"
        );

        return;

    }


    const addressElement =
        document.getElementById(
            "customer-address"
        );


    const noteElement =
        document.getElementById(
            "customer-note"
        );


    const address =
        addressElement
        ? addressElement.value.trim()
        : "";


    const note =
        noteElement
        ? noteElement.value.trim()
        : "";


    const name =
        String(
            currentUser.name || ""
        ).trim();


    const phone =
        String(
            currentUser.phone || ""
        ).trim();


    if (
        name === "" ||
        phone === "" ||
        address === ""
    ) {

        alert(
            "⚠️ من فضلك املأ الاسم والهاتف والعنوان"
        );

        return;

    }


    const orderSendingKey =
        "orderSending";


    if (
        sessionStorage.getItem(
            orderSendingKey
        ) === "true"
    ) {

        alert(
            "⚠️ جاري تسجيل الطلب، من فضلك انتظر"
        );

        return;

    }


    sessionStorage.setItem(
        orderSendingKey,
        "true"
    );


    let orderProducts =
        [];


    let total =
        0;


    for (
        const cartItem of cart
    ) {

        const product =
            getProductById(
                cartItem.productId
            );


        if (!product) {

            alert(
                "⚠️ يوجد منتج في السلة لم يعد موجودًا"
            );


            sessionStorage.removeItem(
                orderSendingKey
            );


            return;

        }


        if (
            product.stock ===
            "غير متوفر ❌"
        ) {

            alert(
                "⚠️ المنتج " +
                product.name +
                " غير متوفر حاليًا"
            );


            sessionStorage.removeItem(
                orderSendingKey
            );


            return;

        }


        const quantity =
            Number(
                cartItem.quantity
            );


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            alert(
                "⚠️ كمية المنتج " +
                product.name +
                " غير صحيحة"
            );


            sessionStorage.removeItem(
                orderSendingKey
            );


            return;

        }


        const price =
            Number(
                product.price
            );


        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {

            alert(
                "⚠️ سعر المنتج " +
                product.name +
                " غير صحيح"
            );


            sessionStorage.removeItem(
                orderSendingKey
            );


            return;

        }


        const productTotal =
            price *
            quantity;


        total +=
            productTotal;


        orderProducts.push({

            productId:
                String(product.id),

            name:
                product.name,

            price:
                price,

            quantity:
                quantity,

            total:
                productTotal

        });

    }


    if (
        orderProducts.length === 0
    ) {

        alert(
            "⚠️ لم يتم العثور على منتجات صالحة في السلة"
        );


        sessionStorage.removeItem(
            orderSendingKey
        );


        return;

    }


    // =================================================
    // CREATE ORDER
    // =================================================

    const order = {

        id:
            Date.now(),

        userPhone:
            phone,

        customerName:
            name,

        phone:
            phone,

        address:
            address,

        note:
            note,

        products:
            orderProducts,

        total:
            total,

        status:
            "جديد",

        date:
            new Date().toLocaleString(
                "ar-EG"
            )

    };


    // =================================================
    // SAVE ORDER
    // =================================================

    let orders =
        getStorageJSON(
            "orders",
            []
        );


    if (!Array.isArray(orders)) {

        orders = [];

    }


    orders.push(
        order
    );


    saveStorageJSON(
        "orders",
        orders
    );


    // =================================================
    // WHATSAPP MESSAGE
    // =================================================

    let message =
        "طلب جديد من B11 JUICE 🧃%0A%0A";


    message +=
        "رقم الطلب: " +
        encodeURIComponent(
            order.id
        ) +
        "%0A";


    message +=
        "الاسم: " +
        encodeURIComponent(
            name
        ) +
        "%0A";


    message +=
        "رقم الهاتف: " +
        encodeURIComponent(
            phone
        ) +
        "%0A";


    message +=
        "العنوان: " +
        encodeURIComponent(
            address
        ) +
        "%0A";


    message +=
        "ملاحظات: " +
        encodeURIComponent(
            note || "لا يوجد"
        ) +
        "%0A%0A";


    message +=
        "المنتجات:%0A";


    orderProducts.forEach(
        function(product) {

            message +=
                "- " +
                encodeURIComponent(
                    product.name
                ) +
                " (x" +
                product.quantity +
                ")" +
                " = " +
                product.total +
                " جنيه%0A";

        }
    );


    message +=
        "%0Aالإجمالي: " +
        total +
        " جنيه";


    // =================================================
    // OPEN WHATSAPP
    // =================================================

    const whatsappURL =
        "https://wa.me/" +
        STORE_WHATSAPP +
        "?text=" +
        message;


    window.open(
        whatsappURL,
        "_blank"
    );


    // =================================================
    // CLEAR CART
    // =================================================

    cart =
        [];


    saveCart();


    updateCartCount();


    displayCart();


    // =================================================
    // RESET FORM
    // =================================================

    if (addressElement) {

        addressElement.value =
            "";

    }


    if (noteElement) {

        noteElement.value =
            "";

    }


    sessionStorage.removeItem(
        orderSendingKey
    );


    alert(
        "تم تسجيل الطلب بنجاح ✅"
    );

}


// =====================================================
// PRODUCT DETAILS
// =====================================================

let productDetails =
    document.getElementById(
        "product-details"
    );


if (productDetails) {

    const selectedProductId =
        localStorage.getItem(
            "selectedProduct"
        );


    const product =
        getProductById(
            selectedProductId
        );


    if (product) {

        productDetails.innerHTML = `

            <div class="single-product">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div class="single-info">

                    <h1>
                        ${product.name}
                    </h1>


                    <div class="rating">

                        ${createStars(product)}

                    </div>


                    <p>
                        عصير B11 JUICE فريش
                        ومناسب للاستمتاع في أي وقت 🧃
                    </p>


                    ${
                        product.oldPrice > 0
                        ? `

                            <del>
                                ${product.oldPrice}
                                جنيه
                            </del>

                        `
                        : ""
                    }


                    <h2>
                        ${product.price}
                        جنيه
                    </h2>


                    <button
                        type="button"
                        ${
                            product.stock ===
                            "غير متوفر ❌"
                            ? "disabled"
                            : ""
                        }

                        onclick="
                            addToCart(
                                '${product.id}'
                            )
                        "
                    >

                        ${
                            product.stock ===
                            "غير متوفر ❌"
                            ? "غير متوفر ❌"
                            : "أضف للسلة 🛒"
                        }

                    </button>

                </div>

            </div>

        `;

    } else {

        productDetails.innerHTML = `

            <div class="empty-products">

                <h3>
                    ⚠️ المنتج غير موجود
                </h3>

                <a href="products.html">
                    العودة للمنتجات
                </a>

            </div>

        `;

    }

}


// =====================================================
// OPEN PRODUCT
// =====================================================

function openProduct(productId) {

    const product =
        getProductById(
            productId
        );


    if (!product) {
        return;
    }


    localStorage.setItem(
        "selectedProduct",
        String(product.id)
    );


    window.location.href =
        "product.html";

}


// =====================================================
// PRODUCT STARS
// =====================================================

function createStars(product) {

    let stars =
        "";


    const userRating =
        Number(
            ratings[product.id]
        ) || 0;


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (i <= userRating) {

            stars += `

                <span
                    onclick="
                        event.stopPropagation();
                        rateProduct(
                            '${product.id}',
                            ${i}
                        )
                    "
                >
                    ★
                </span>

            `;

        } else {

            stars += `

                <span
                    onclick="
                        event.stopPropagation();
                        rateProduct(
                            '${product.id}',
                            ${i}
                        )
                    "
                >
                    ☆
                </span>

            `;

        }

    }


    return stars;

}


// =====================================================
// RATE PRODUCT
// =====================================================

function rateProduct(
    productId,
    rating
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {
        return;
    }


    const selectedRating =
        Number(rating);


    if (
        !Number.isInteger(
            selectedRating
        ) ||
        selectedRating < 1 ||
        selectedRating > 5
    ) {

        return;

    }


    ratings[
        String(productId)
    ] =
        selectedRating;


    saveStorageJSON(
        "ratings",
        ratings
    );


    displayProducts(
        products
    );


    displayFavorites();

}


// =====================================================
// FAVORITES CONTAINER
// =====================================================

let favoritesContainer =
    document.getElementById(
        "favorites-container"
    );


// =====================================================
// DISPLAY FAVORITES
// =====================================================

function displayFavorites() {

    if (!favoritesContainer) {
        return;
    }


    refreshFavorites();


    favoritesContainer.innerHTML =
        "";


    if (
        favorites.length === 0
    ) {

        favoritesContainer.innerHTML = `

            <div class="empty-favorites">

                <div class="empty-icon">
                    ❤️
                </div>

                <h3>
                    لا يوجد منتجات في المفضلة
                </h3>

                <p>
                    اضغط على ❤️ عند أي عصير لإضافته هنا.
                </p>

                <a href="products.html">
                    تصفح العصائر 🧃
                </a>

            </div>

        `;

        return;

    }


    favorites.forEach(
        function(productId) {

            const product =
                getProductById(
                    productId
                );


            if (!product) {
                return;
            }


            const isOutOfStock =
                product.stock ===
                "غير متوفر ❌";


            favoritesContainer.innerHTML += `

                <div
                    class="product"
                    onclick="
                        openProduct(
                            '${product.id}'
                        )
                    "
                >

                    <div class="badge">
                        ${product.badge || ""}
                    </div>


                    <div class="stock">
                        ${product.stock || "متوفر ✅"}
                    </div>


                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >


                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        عصير B11 JUICE فريش 🧃
                    </p>


                    <div class="price">

                        ${
                            product.oldPrice > 0
                            ? `

                                <del>
                                    ${product.oldPrice}
                                    جنيه
                                </del>

                            `
                            : ""
                        }


                        <strong>
                            ${product.price}
                            جنيه
                        </strong>

                    </div>


                    <div class="rating">

                        ${createStars(product)}

                    </div>


                    <button
                        type="button"
                        ${
                            isOutOfStock
                            ? "disabled"
                            : ""
                        }

                        onclick="
                            event.stopPropagation();
                            addToCart(
                                '${product.id}'
                            )
                        "
                    >

                        ${
                            isOutOfStock
                            ? "غير متوفر ❌"
                            : "أضف للسلة 🛒"
                        }

                    </button>


                    <button
                        type="button"
                        onclick="
                            event.stopPropagation();
                            addToFavorite(
                                '${product.id}'
                            )
                        "
                    >

                        💔 إزالة من المفضلة

                    </button>

                </div>

            `;

        }
    );

}


// =====================================================
// USER AREA
// =====================================================

function updateUserArea() {

    const userArea =
        document.getElementById(
            "user-area"
        );


    if (!userArea) {
        return;
    }


    const user =
        getCurrentUser();


    if (user) {

        userArea.innerHTML = `

            <span class="user-name">

                👤 أهلاً
                ${user.name}

            </span>

        `;

    } else {

        userArea.innerHTML = `

            <a href="user-login.html">

                👤 تسجيل الدخول

            </a>

        `;

    }

}


// =====================================================
// LOGOUT
// =====================================================

function userLogout() {

    saveCart();


    localStorage.removeItem(
        "currentUser"
    );


    cart =
        getCart();


    favorites =
        getFavorites();


    updateUserArea();


    updateCartCount();


    updateFavoriteCount();


    displayCart();


    displayFavorites();


    alert(
        "تم تسجيل الخروج بنجاح 👋"
    );


    window.location.href =
        "user-login.html";

}


// =====================================================
// LOGIN
// =====================================================

function userLogin() {

    const phoneInput =
        document.getElementById(
            "user-phone"
        );


    const passwordInput =
        document.getElementById(
            "user-password"
        );


    const error =
        document.getElementById(
            "user-login-error"
        );


    if (
        !phoneInput ||
        !passwordInput ||
        !error
    ) {

        return;

    }


    const phone =
        phoneInput.value.trim();


    const password =
        passwordInput.value;


    if (
        phone === "" ||
        password === ""
    ) {

        error.innerText =
            "❌ من فضلك املأ جميع البيانات";

        return;

    }


    const users =
        getStorageJSON(
            "users",
            []
        );


    if (!Array.isArray(users)) {

        error.innerText =
            "❌ لا توجد حسابات مسجلة";

        return;

    }


    const user =
        users.find(
            function(item) {

                return (
                    String(item.phone) ===
                    String(phone) &&

                    item.password ===
                    password
                );

            }
        );


    if (!user) {

        error.innerText =
            "❌ رقم الهاتف أو كلمة المرور غير صحيحة";

        return;

    }


    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    cart =
        getCart();


    favorites =
        getFavorites();


    window.location.href =
        "index.html";

}


// =====================================================
// REGISTER
// =====================================================

function registerUser() {

    const nameInput =
        document.getElementById(
            "register-name"
        );


    const phoneInput =
        document.getElementById(
            "register-phone"
        );


    const passwordInput =
        document.getElementById(
            "register-password"
        );


    const confirmPasswordInput =
        document.getElementById(
            "register-password-confirm"
        );


    const error =
        document.getElementById(
            "register-error"
        );


    if (
        !nameInput ||
        !phoneInput ||
        !passwordInput ||
        !confirmPasswordInput ||
        !error
    ) {

        return;

    }


    const name =
        nameInput.value.trim();


    const phone =
        phoneInput.value.trim();


    const password =
        passwordInput.value;


    const confirmPassword =
        confirmPasswordInput.value;


    if (
        name === "" ||
        phone === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        error.innerText =
            "❌ من فضلك املأ جميع البيانات";

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        error.innerText =
            "❌ كلمتا المرور غير متطابقتين";

        return;

    }


    if (
        password.length < 4
    ) {

        error.innerText =
            "❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل";

        return;

    }


    let users =
        getStorageJSON(
            "users",
            []
        );


    if (!Array.isArray(users)) {

        users = [];

    }


    const existingUser =
        users.find(
            function(user) {

                return (
                    String(user.phone) ===
                    String(phone)
                );

            }
        );


    if (existingUser) {

        error.innerText =
            "❌ رقم الهاتف مسجل بالفعل";

        return;

    }


    const newUser = {

        name:
            name,

        phone:
            phone,

        password:
            password

    };


    users.push(
        newUser
    );


    saveStorageJSON(
        "users",
        users
    );


    localStorage.setItem(
        "currentUser",
        JSON.stringify(
            newUser
        )
    );


    cart =
        getCart();


    favorites =
        getFavorites();


    window.location.href =
        "index.html";

}


// =====================================================
// UPDATE EVERYTHING
// =====================================================

function updateEverything() {

    products =
        getStorageJSON(
            "adminProducts",
            []
        );


    if (!Array.isArray(products)) {

        products = [];

    }


    normalizeProducts();


    cart =
        getCart();


    favorites =
        getFavorites();


    updateUserArea();


    updateCartCount();


    updateFavoriteCount();
  

    // ========================================
// UPDATE FAVORITE COUNT
// ========================================

function updateFavoriteCount() {

    const favoriteCount =
        document.getElementById("favorite-count");

    if (!favoriteCount) {
        return;
    }

    const currentFavorites = getFavorites();

    favoriteCount.textContent =
        currentFavorites.length;
}

    displayCart();


    displayFavorites();


    if (container) {

        displayProducts(
            products
        );

    }

}


// =====================================================
// START SYSTEM
// =====================================================

updateEverything();