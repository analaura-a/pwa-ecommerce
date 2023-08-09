/* Elementos HTML DOM */
let todosCategory = document.getElementById('explorar');
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");
let containerCourses = document.getElementById('container-courses');
let containerNoCourses = document.getElementById('no-courses');



/* Carrito de compras */
let carrito = [];
let carritoJSON = JSON.parse(localStorage.getItem('carrito'));

if (carritoJSON) {
    carritoJSON.forEach(course => {
        carrito.push(course);
    })
}



/* Base de datos */
let db;
let dbInitialized = localStorage.getItem('dbInitialized'); //Estado de la base de datos

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

        // Renderizamos los cursos comprados
        renderPurchasedCourses();

        // Almacenamos en localStorage que la base de datos se inicializó
        localStorage.setItem('dbInitialized', true);
    }

};

createDatabase();



/* Función para renderizar los cursos comprados */
function renderPurchasedCourses() {

    //Iniciamos la transacción de lectura de la base de datos
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');
    let purchasedIndex = objectStore.index("purchased");

    let request = purchasedIndex.getAll("true");

    request.onsuccess = function (event) {

        let array = event.target.result;

        if (array.length === 0) {

            //Creamos la interfaz del empty state
            let divContainer = document.createElement("div");
            divContainer.classList.add("empty-cart", "m-0-auto");

            let divIcon = document.createElement("div");
            divIcon.classList.add("icon-container", "mb-32", "mt-64", "m-0-auto");
            divIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewbox="0 0 48 48" fill="none">
            <path fill="#a6b5ed" fill-rule="evenodd" d="m27.067 10.758.003.002 7.982 5.237a4.974 4.974 0 0 1 2.23 4.709V28a.75.75 0 0 1-1.5 0v-4.223c-.22.21-.463.405-.73.58l-1.795 1.178v6.156c0 1.032-.394 2.059-.994 2.893-.6.834-1.448 1.533-2.425 1.858l-4.261 1.416c-.47.151-1.044.216-1.582.216-.537 0-1.108-.064-1.575-.217l-.003-.001-4.253-1.413c-.977-.326-1.825-1.025-2.426-1.859-.6-.834-.994-1.86-.994-2.893l.013-6.162-1.793-1.17c-3.027-1.976-3.027-6.4 0-8.376l8.024-5.239h.001c.87-.571 1.975-.833 3.04-.832 1.064.002 2.17.268 3.038.846Zm8.73 9.101a.753.753 0 0 0-.014.141v.619a3.467 3.467 0 0 1-1.554 2.485l-7.987 5.24c-.57.375-1.373.587-2.215.587-.842 0-1.644-.212-2.215-.587l-8.028-5.241c-2.12-1.384-2.12-4.48 0-5.864l8.026-5.24.002-.002c.571-.375 1.372-.586 2.214-.585.841.002 1.641.216 2.212.596l.004.003 7.987 5.24a3.469 3.469 0 0 1 1.567 2.608Zm-8.731 9.738 4.691-3.078v5.172c0 .66-.259 1.387-.712 2.017-.453.629-1.058 1.103-1.681 1.311l-4.25 1.412c-.276.088-.681.143-1.119.143-.438 0-.84-.055-1.107-.142h-.001l-4.25-1.413-2.384-7.872.002-.64 4.733 3.09.001.001c.87.571 1.974.833 3.038.833 1.064 0 2.17-.262 3.039-.834Zm-10.813-2.45 2.385 7.872c-.623-.207-1.23-.682-1.682-1.311-.453-.63-.712-1.356-.712-2.016l.01-4.545Z" clip-rule="evenodd" />
            </svg>`

            let h2 = document.createElement("h2");
            h2.classList.add("h2", "mb-16");
            h2.textContent = "Parece que todavía no compraste ningún curso";

            let p = document.createElement("p");
            p.classList.add("paragraph", "mb-32");
            p.textContent = "Date una vuelta por nuestro catálogo y animate a sumar nuevas habilidades a tu perfil profesional.";

            let a = document.createElement("a");
            a.classList.add("main-cta", "m-0-auto", "mb-100");
            a.setAttribute("href", "courses.html");
            a.innerHTML = ` <p>Explorar catálogo</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewbox="0 0 48 48" fill="none">
            <path fill="#fff"
                d="M28.11 15.264a.9.9 0 1 0-1.273 1.272l6.557 6.558H12.9a.9.9 0 1 0 0 1.8h20.493l-6.556 6.556a.9.9 0 0 0 1.272 1.273l8.094-8.093a.9.9 0 0 0 0-1.273l-8.094-8.093Z" />
        </svg>`;

            divContainer.appendChild(divIcon);
            divContainer.appendChild(h2);
            divContainer.appendChild(p);
            divContainer.appendChild(a);

            containerNoCourses.appendChild(divContainer);


        } else {

            array.forEach((course) => {

                //Creamos una card por cada curso
                let divCourseCard = document.createElement("li");
                divCourseCard.classList.add("course-card");

                let a = document.createElement("a");
                a.classList.add("anchor-detail");
                a.setAttribute("href", "detail.html");

                let divImg = document.createElement("div");
                divImg.classList.add("card-img");

                let divContent = document.createElement("div");
                divContent.classList.add("card-content");

                let img = document.createElement("img");
                img.setAttribute("src", `${course.cover}`);
                img.setAttribute("alt", `${course.name}`);

                let pCategory = document.createElement("p");
                pCategory.classList.add("card-content-category", "mb-8");
                pCategory.textContent = `${course.category}`;

                let h3 = document.createElement("h3");
                h3.classList.add("h3", "mb-4");
                h3.textContent = `${course.name}`;

                let pDescription = document.createElement("p");
                pDescription.classList.add("card-content-paragraph", "mb-12");
                pDescription.textContent = `${course.short_description}`;

                let pPrice = document.createElement("p");
                pPrice.classList.add("card-content-price");
                pPrice.textContent = `$${course.price.toLocaleString('de-DE')}`;

                divCourseCard.appendChild(a);

                a.appendChild(divImg);
                a.appendChild(divContent);

                divImg.appendChild(img);

                divContent.appendChild(pCategory);
                divContent.appendChild(h3);
                divContent.appendChild(pDescription);
                divContent.appendChild(pPrice);

                //Las agregamos al contenedor
                containerCourses.appendChild(divCourseCard);

                //Agregamos un evento para obtener su ID
                divCourseCard.addEventListener("click", () => {
                    localStorage.setItem('chosenCourse', course.id);
                });

            });

        }

    };

    request.onerror = function (event) {
        let errorMessage = document.createElement("h2");
        errorMessage.textContent = "Ocurrió un error intentando mostrar los cursos comprados. Inténtelo de nuevo más tarde."
        containerCourses.appendChild(errorMessage);

        console.log(event);
    };

}



todosCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Todos");
});



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