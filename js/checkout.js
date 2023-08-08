/* Elementos HTML DOM */
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");
let coursesContainer = document.getElementById("courses-container");
let total = document.getElementById("totalCheckout");
let subtotal = document.getElementById("subtotal");
let totalInput = document.getElementById("total-compra");



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



/* Renderizar resumen de compra */
function renderOrderSummary() {

    carritoJSON.forEach(course => {

        let courseInCart = document.createElement("li");

        let img = document.createElement("img");
        img.classList.add("cart-card-img");
        img.setAttribute("src", `${course.cover}`);
        img.setAttribute("alt", `${course.name}`);


        let divInfo = document.createElement("div");
        divInfo.classList.add("cart-card-info");

        let divInfoCourse = document.createElement("div");

        let pPrice = document.createElement("p");
        pPrice.textContent = `$${course.price.toLocaleString('de-DE')}`;

        let h2 = document.createElement("h2");
        h2.textContent = `${course.name}`;

        let pTeacher = document.createElement("p");
        pTeacher.textContent = `Por ${course.teacher_name}`;

        courseInCart.appendChild(img);
        courseInCart.appendChild(divInfo);

        divInfo.appendChild(divInfoCourse);
        divInfo.appendChild(pPrice);

        divInfoCourse.appendChild(h2);
        divInfoCourse.appendChild(pTeacher);

        coursesContainer.appendChild(courseInCart);

    });

}

renderOrderSummary();



/* Función para mostrar el total */
function renderTotal() {

    let results = carritoJSON.reduce((acc, course) => acc + course.price, 0);

    total.textContent = `$${results.toLocaleString('de-DE')}`;
    subtotal.textContent = `$${results.toLocaleString('de-DE')}`;
    totalInput.setAttribute("value", `Pagar $${results.toLocaleString('de-DE')}`);

}

renderTotal();



/*Función para actualizar las cantidades del carrito en el nav*/
const actualizarContadorCarrito = function () {

    let cantidad = carrito.length;
    navCartCount.setAttribute("data-cart-count", cantidad);

    let total = carrito.reduce((acc, course) => acc + course.price, 0);
    navCartTotal.textContent = `$${total.toLocaleString('de-DE')}`;

}
actualizarContadorCarrito();



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