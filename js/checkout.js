/* Elementos HTML DOM */
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");
let coursesContainer = document.getElementById("courses-container");
let total = document.getElementById("totalCheckout");
let subtotal = document.getElementById("subtotal");
let totalInput = document.getElementById("total-compra");
let formCheckout = document.getElementById("form-checkout");



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



/* Base de datos */
let db;
function createDatabase() {

    const DBOpenRequest = indexedDB.open('conceptoApp', 1);

    // Error al conectar con la base de datos
    DBOpenRequest.onerror = function (event) {

        console.log('Algo salió mal en la conexión con la base de datos', event);

    };

    // Creación o actualización de la base de datos
    DBOpenRequest.onupgradeneeded = function (event) {

        db = event.target.result;

        // ObjectStore de los cursos
        const objectStoreList = db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
        objectStoreList.createIndex('category', 'category', { unique: false });
        objectStoreList.createIndex('trending', 'trending', { unique: false });
        objectStoreList.createIndex('purchased', 'purchased', { unique: false });

    };

    // Conexión exitosa con la base de datos
    DBOpenRequest.onsuccess = function (event) {

        console.log('Conexión exitosa con la base de datos');

        db = event.target.result;



    }

};

createDatabase();



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



/* Función para vaciar el carrito */
function emptyCart() {

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));

}



/* Evento al enviar el form */
formCheckout.addEventListener("submit", (e) => {

    e.preventDefault();

    console.log("Enviado");

    //Iniciamos la transacción
    const transaction = db.transaction(['courses'], 'readwrite');
    let objectStore = transaction.objectStore('courses');

    //Por cada uno de los cursos en el carrito...
    carritoJSON.forEach((course) => {

        let getRequest = objectStore.get(course.id);

        getRequest.onsuccess = function (event) {

            let course = event.target.result;

            //Actualizamos su estado a "comprado"
            course.purchased = "true";

            let updateRequest = objectStore.put(course);

            updateRequest.onsuccess = function () {
                //Vaciamos el carrito
                emptyCart();
            }

            updateRequest.onerror = function () {
                //No vaciamos el carrito
            }

        }

        // Transacción completada
        transaction.oncomplete = () => {

            //Redirigimos a la página de confirmación
            localStorage.setItem("state", "success");
            location.href = "state.html";

        };

        // Transacción con error
        transaction.onerror = () => {

            //Redirigimos a la página de confirmación
            localStorage.setItem("state", "error");
            location.href = "state.html";

        };

    })

})



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