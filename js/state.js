/* Elementos HTML DOM */
let container = document.getElementById("container-state");
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");



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



/* Estado de la compra */
let state = localStorage.getItem('state');
console.log(state);



/* Función para renderizar la pantalla de confirmación */
function renderMessage() {

    if (state == "success") {

        //Vaciamos el contenedor
        container.innerHTML = "";

        //Vista de "éxito"
        let divIcon = document.createElement("div");
        divIcon.classList.add("icon-container", "mb-32", "mt-64", "m-0-auto");
        divIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
        <path fill="#3E58FF" d="M21.888 28.273a1.5 1.5 0 1 0-2.122 2.121l2.122-2.121Zm.94 3.06-1.061 1.061a1.5 1.5 0 0 0 2.078.041l-1.018-1.102Zm5.35-2.897a1.5 1.5 0 0 0-2.035-2.205l2.035 2.204Zm-7.37-16.71a1.5 1.5 0 1 0-2.123-2.119l2.124 2.119Zm-6.95 2.721a1.5 1.5 0 1 0 2.124 2.119l-2.124-2.118Zm15.457-4.84a1.5 1.5 0 0 0-2.124 2.119l2.124-2.119Zm2.702 6.959a1.5 1.5 0 1 0 2.125-2.118l-2.125 2.118Zm-17.87 4.526a1.5 1.5 0 0 0-2.96.483l2.96-.483Zm.4 11.761-1.48.242v.002l1.48-.244Zm18.546.16-1.473-.282 1.473.282Zm3.714-11.397a1.5 1.5 0 0 0-2.947-.565l2.947.565Zm-17.04 8.778 2 2 2.12-2.121-2-2-2.12 2.121Zm4.078 2.041 4.333-4-2.035-2.204-4.333 4 2.035 2.204Zm-5.16-22.828-4.827 4.84 2.124 2.119 4.827-4.84-2.125-2.119Zm8.506 2.119 4.826 4.84 2.125-2.118-4.827-4.84-2.124 2.118Zm-15.024 6.74c0-.494.068-.76.12-.89.043-.103.073-.117.08-.121.028-.02.118-.068.345-.104.23-.038.522-.051.915-.051v-3c-.774 0-1.966.017-2.93.662-1.125.754-1.53 2.025-1.53 3.505h3Zm1.46-1.166h20.746v-3H13.627v3Zm20.746 0c.393 0 .684.013.915.05.227.037.317.086.346.105.006.004.036.018.079.122.053.129.12.395.12.89h3c0-1.48-.405-2.751-1.53-3.505-.963-.645-2.156-.662-2.93-.662v3Zm1.46 1.167c0 .621-.074.94-.13 1.082-.04.102-.044.061.016.026.017-.01-.04.03-.301.049-.281.02-.564.01-1.045.01v3c.34 0 .837.013 1.265-.018.448-.033 1.028-.123 1.58-.441 1.264-.73 1.615-2.138 1.615-3.708h-3Zm-1.46 1.166H13.627v3h20.746v-3Zm-20.746 0c-.481 0-.764.012-1.045-.01-.26-.018-.318-.057-.301-.048.06.035.055.076.016-.026-.056-.143-.13-.46-.13-1.082h-3c0 1.57.351 2.979 1.616 3.708.552.318 1.132.408 1.58.44.427.032.924.018 1.264.018v-3Zm-2.44 1.942 1.88 11.52 2.96-.483-1.88-11.52-2.96.483Zm1.88 11.522c.228 1.383.655 2.886 1.776 4.02 1.162 1.178 2.82 1.716 4.97 1.716v-3c-1.663 0-2.425-.408-2.836-.824-.453-.458-.752-1.195-.95-2.4l-2.96.488Zm6.746 5.736h8.04v-3h-8.04v3Zm8.04 0c2.262 0 3.942-.491 5.08-1.684 1.075-1.125 1.4-2.633 1.634-3.854l-2.947-.564c-.246 1.286-.467 1.939-.857 2.347-.325.34-1.024.755-2.91.755v3Zm6.714-5.537 2.24-11.68-2.947-.565-2.24 11.68 2.947.565Z" /></svg>`;

        let h2 = document.createElement("h2");
        h2.classList.add("h2", "mb-16");
        h2.textContent = "¡Tu compra se realizó con éxito!";

        let p = document.createElement("p");
        p.classList.add("paragraph", "mb-32");
        p.innerHTML = `Revisá tu mail para ver el comprobante de compra y empezá ahora mismo a
        aprender en la sección <a href="mycourses.html" class="bold">Mis cursos</a>.`;

        let a = document.createElement("a");
        a.classList.add("main-cta", "m-0-auto", "mb-100");
        a.setAttribute("href", "courses.html")
        a.innerHTML = `<p>Seguir comprando</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
            <path fill="#fff" d="M28.11 15.264a.9.9 0 1 0-1.273 1.272l6.557 6.558H12.9a.9.9 0 1 0 0 1.8h20.493l-6.556 6.556a.9.9 0 0 0 1.272 1.273l8.094-8.093a.9.9 0 0 0 0-1.273l-8.094-8.093Z" />
        </svg>`;

        container.appendChild(divIcon);
        container.appendChild(h2);
        container.appendChild(p);
        container.appendChild(a);


    } else if (state == "error") {

        //Vaciamos el contenedor
        container.innerHTML = "";

        //Vista de "éxito"
        let divIcon = document.createElement("div");
        divIcon.classList.add("icon-container", "mb-32", "mt-64", "m-0-auto");
        divIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
        <path stroke="#3E58FF" stroke-linecap="round" stroke-width="3" d="m25.854 31.147-3.667-3.667m3.626.04-3.666 3.667m-2.4-20.52-4.827 4.84m13.333-4.84 4.827 4.84m-20.413 5.826 1.88 11.52c.426 2.587 1.453 4.48 5.266 4.48h8.04c4.147 0 4.76-1.813 5.24-4.32l2.24-11.68m-24.666-2.866c0-2.467 1.32-2.667 2.96-2.667h20.746c1.64 0 2.96.2 2.96 2.667 0 2.867-1.32 2.667-2.96 2.667H13.627c-1.64 0-2.96.2-2.96-2.667Z" />
        </svg>`;

        let h2 = document.createElement("h2");
        h2.classList.add("h2", "mb-16");
        h2.textContent = "¡Oh, no! La compra no se pudo completar";

        let p = document.createElement("p");
        p.classList.add("paragraph", "mb-32");
        p.innerHTML = `Ocurrió un error mientras se intentaba realizar la transacción.<br>Por favor, inténtelo de nuevo más tarde.`;

        let a = document.createElement("a");
        a.classList.add("main-cta", "m-0-auto", "mb-100");
        a.setAttribute("href", "cart.html")
        a.innerHTML = `<p>Volver al carrito</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
            <path fill="#fff" d="M28.11 15.264a.9.9 0 1 0-1.273 1.272l6.557 6.558H12.9a.9.9 0 1 0 0 1.8h20.493l-6.556 6.556a.9.9 0 0 0 1.272 1.273l8.094-8.093a.9.9 0 0 0 0-1.273l-8.094-8.093Z" />
        </svg>`;

        container.appendChild(divIcon);
        container.appendChild(h2);
        container.appendChild(p);
        container.appendChild(a);

    }

}

renderMessage();



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