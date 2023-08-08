/* Elementos HTML DOM */
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");
let container = document.getElementById("cart");
let cartCounter = document.getElementById("cart-counter");



/* Carrito de compras */
let carrito = [];
let carritoJSON = JSON.parse(localStorage.getItem('carrito'));

if (carritoJSON) {
    carritoJSON.forEach(course => {
        carrito.push(course);
    })
} else {
    carritoJSON = [];
}



/* Cambio en la interfaz dependiendo si el carrito está vacío o no */
function renderCartPage() {

    updateJSONCart();

    if (carritoJSON.length === 0) {

        console.log("estoy vacío");

        //Vaciamos el contenedor
        container.innerHTML = "";
        cartCounter.style.display = "none";

        //Creamos la interfaz
        let divContainer = document.createElement("div");
        divContainer.classList.add("empty-cart", "m-0-auto");

        let divIcon = document.createElement("div");
        divIcon.classList.add("icon-container", "mb-32", "mt-64", "m-0-auto");
        divIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
        <path stroke="#a6b5ed" stroke-linecap="round" stroke-width="2"
            d="m7 8.65 2.8.56a2 2 0 0 1 1.597 1.762l.363 3.628m0 0 1.829 15.238a2 2 0 0 0 1.985 1.762h18.443a3.5 3.5 0 0 0 3.396-2.651l2.873-11.491a2.3 2.3 0 0 0-2.232-2.858H11.76Z" />
        <path stroke="#a6b5ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.9 26.5h6.8" />
        <path fill="#a6b5ed"
            d="M20.6 37.55a2.55 2.55 0 1 1-5.1 0 2.55 2.55 0 0 1 5.1 0ZM35.9 37.55a2.55 2.55 0 1 1-5.1 0 2.55 2.55 0 0 1 5.1 0Z" />
        </svg>`

        let h2 = document.createElement("h2");
        h2.classList.add("h2", "mb-16");
        h2.textContent = "¡Ups! Parece que todavía no agregaste nada";

        let p = document.createElement("p");
        p.classList.add("paragraph", "mb-32");
        p.textContent = "Date una vuelta por nuestro catálogo y elegí tus cursos favoritos.";

        let a = document.createElement("a");
        a.classList.add("main-cta", "m-0-auto", "mb-100");
        a.setAttribute("href", "courses.html");
        a.innerHTML = ` <p>Explorar</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
            <path fill="#fff"
                d="M28.11 15.264a.9.9 0 1 0-1.273 1.272l6.557 6.558H12.9a.9.9 0 1 0 0 1.8h20.493l-6.556 6.556a.9.9 0 0 0 1.272 1.273l8.094-8.093a.9.9 0 0 0 0-1.273l-8.094-8.093Z" />
        </svg>`;

        divContainer.appendChild(divIcon);
        divContainer.appendChild(h2);
        divContainer.appendChild(p);
        divContainer.appendChild(a);

        container.appendChild(divContainer);

        actualizarContadorCarrito();

    } else {

        console.log("no estoy vacío");

        //Vaciamos el contenedor
        container.innerHTML = "";

        //Creamos la interfaz
        let divContainer = document.createElement("div");
        divContainer.classList.add("cart-container");

        let divCartCourses = document.createElement("div");
        divCartCourses.classList.add("cart-courses");

        let divSummary = document.createElement("div");
        divSummary.classList.add("cart-summary");

        let ul = document.createElement("ul");
        ul.classList.add("cart-container-cards", "mb-56");
        ul.setAttribute("id", "cart-container");

        let p = document.createElement("p");
        p.textContent = "Vaciar carrito";
        p.setAttribute("id", "empty-cart");
        p.addEventListener("click", emptyCart);

        let h2 = document.createElement("h2");
        h2.classList.add("h2", "pb-32", "separador");
        h2.textContent = "Resumen";

        let divSubtotal = document.createElement("div");
        divSubtotal.classList.add("pb-32", "pt-32", "separador");

        let divTotal = document.createElement("div");
        divTotal.classList.add("total", "flex-total", "pt-32", "pb-32");

        let a = document.createElement("a");
        a.classList.add("main-cta");
        a.setAttribute("href", "checkout.html");
        a.innerHTML = `<p>Comprar ahora</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48"
            fill="none">
            <path fill="#fff"
                d="M28.11 15.264a.9.9 0 1 0-1.273 1.272l6.557 6.558H12.9a.9.9 0 1 0 0 1.8h20.493l-6.556 6.556a.9.9 0 0 0 1.272 1.273l8.094-8.093a.9.9 0 0 0 0-1.273l-8.094-8.093Z" />
        </svg>`;

        let divSubtotalPrice = document.createElement("div");
        divSubtotalPrice.classList.add("subtotal", "flex-total", "mb-8");

        let divSubtotalDiscount = document.createElement("div");
        divSubtotalDiscount.classList.add("subtotal", "flex-total");
        divSubtotalDiscount.innerHTML = `<p>Descuentos</p><p>$0</p>`;

        let pSubtotal = document.createElement("p");
        pSubtotal.textContent = "Subtotal";

        let pSubtotalPrice = document.createElement("p");
        pSubtotalPrice.textContent = "$0";
        pSubtotalPrice.setAttribute("id", "subtotal");

        let pTotal = document.createElement("p");
        pTotal.textContent = "Total a pagar";

        let pTotalPrice = document.createElement("p");
        pTotalPrice.textContent = "$0";
        pTotalPrice.setAttribute("id", "total");

        divContainer.appendChild(divCartCourses);
        divContainer.appendChild(divSummary);

        divCartCourses.appendChild(ul);
        divCartCourses.appendChild(p);

        divSummary.appendChild(h2);
        divSummary.appendChild(divSubtotal);
        divSummary.appendChild(divTotal);
        divSummary.appendChild(a);

        divSubtotal.appendChild(divSubtotalPrice);
        divSubtotal.appendChild(divSubtotalDiscount);

        divSubtotalPrice.appendChild(pSubtotal);
        divSubtotalPrice.appendChild(pSubtotalPrice);

        divTotal.appendChild(pTotal);
        divTotal.appendChild(pTotalPrice);

        container.appendChild(divContainer);

        //Renderizamos el resto del contenido dinámico
        renderCart();
        renderCartCount();
        renderCartTotal();
        actualizarContadorCarrito();

    }
}

renderCartPage();



/* Función para renderizar los cursos en carrito */
function renderCart() {

    updateJSONCart();

    carritoJSON.forEach(course => {

        //Creamos una card por cada curso
        let courseCard = document.createElement("li");

        let img = document.createElement("img");
        img.classList.add("cart-card-img");
        img.setAttribute("src", `${course.cover}`);
        img.setAttribute("alt", `${course.namer}`);

        let cardInfo = document.createElement("div");
        cardInfo.classList.add("cart-card-info");

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "48");
        svg.setAttribute("height", "48");
        svg.setAttribute("viewBox", "0 0 48 48");
        svg.setAttribute("fill", "none");
        svg.setAttribute("id", `delete-${course.id}`);
        svg.classList.add("svg-medium", "delete-cart-button");
        svg.innerHTML = `<path stroke="#4b5b77" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M36 15.973c-4.44-.44-8.907-.666-13.36-.666-2.64 0-5.28.133-7.92.4l-2.72.266m7.333-1.346.294-1.747c.213-1.267.373-2.213 2.626-2.213h3.494c2.253 0 2.426 1 2.626 2.226l.294 1.734m4.466 5.56-.866 13.426c-.147 2.094-.267 3.72-3.987 3.72h-8.56c-3.72 0-3.84-1.626-3.987-3.72l-.866-13.426M21.773 30h4.44m-5.546-5.333h6.666" />`;
        svg.addEventListener("click", deleteCourse);

        let divInfo = document.createElement("div");

        let pPrice = document.createElement("p");
        pPrice.textContent = `$${course.price.toLocaleString('de-DE')}`;

        let h2 = document.createElement("h2");
        h2.textContent = `${course.name}`;

        let pTeacher = document.createElement("p");
        pTeacher.textContent = `Por ${course.teacher_name}`;

        courseCard.appendChild(img);
        courseCard.appendChild(cardInfo);
        courseCard.appendChild(svg);

        cardInfo.appendChild(divInfo);
        cardInfo.appendChild(pPrice);

        divInfo.appendChild(h2);
        divInfo.appendChild(pTeacher);

        //Las agregamos al contenedor
        let cartContainer = document.getElementById("cart-container");
        cartContainer.appendChild(courseCard)

    });

}



/* Función para actualizar el contador del carrito */
function renderCartCount() {

    updateJSONCart();

    if (carritoJSON.length == 1) {
        cartCounter.textContent = `${carritoJSON.length} item`
    } else {
        cartCounter.textContent = `${carritoJSON.length} items`
    }

}



/* Función para renderizar el resumen de compra */
function renderCartTotal() {

    updateJSONCart();

    let subtotal = document.getElementById("subtotal");
    let total = document.getElementById("total");

    let results = carritoJSON.reduce((acc, course) => acc + course.price, 0);

    subtotal.textContent = `$${results.toLocaleString('de-DE')}`;
    total.textContent = `$${results.toLocaleString('de-DE')}`;

}



/* Función para actualizar el carrito en el JSON */
function updateJSONCart() {
    carritoJSON = JSON.parse(localStorage.getItem('carrito'));
}



/* Función para borrar un curso en particular del carrito */
function deleteCourse(e) {

    updateJSONCart();

    //Identificamos el curso
    let idButton = e.currentTarget.id;
    let index = carritoJSON.findIndex(course => `delete-${course.id}` === idButton);

    //Lo eliminamos del carrito
    carritoJSON.splice(index, 1);

    //Guardamos este carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carritoJSON));

    //Actualizamos la interfaz
    renderCartPage();

}



/* Función para vaciar el carrito */
function emptyCart() {

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));

    //Actualizamos la interfaz
    renderCartPage();

}



/*Función para actualizar las cantidades del carrito en el nav*/
function actualizarContadorCarrito() {

    updateJSONCart();

    let cantidad = carritoJSON.length;
    navCartCount.setAttribute("data-cart-count", cantidad);

    let total = carritoJSON.reduce((acc, course) => acc + course.price, 0);
    navCartTotal.textContent = `$${total.toLocaleString('de-DE')}`;

}



/* Menú mobile */
const nav = document.getElementById('primary-navigation');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', () => {
    const visibility = nav.getAttribute('data-visible');

    if (visibility === 'false') {
        nav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else {
        nav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
})