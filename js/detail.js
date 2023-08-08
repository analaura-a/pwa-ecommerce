/* Elementos HTML DOM */
let cover = document.getElementById("course-image");
let category = document.getElementById("course-category");
let name = document.getElementById("course-name");
let professorPhoto = document.getElementById("course-professor-photo");
let professorName = document.getElementById("course-professor-name");
let professorJob = document.getElementById("course-professor-job");
let about = document.getElementById("course-about");
let learnings = document.getElementById("course-learnings");
let price = document.getElementById("course-price");
let rating = document.getElementById("course-rating");
let students = document.getElementById("course-students");
let duration = document.getElementById("course-duration");
let level = document.getElementById("course-level");
let requirements = document.getElementById("course-requirements");
let subjects = document.getElementById("course-subjects");
let mainCTA = document.getElementById("mainCTA");
let mainCTAText = document.getElementById("main-cta-text");
let navCartCount = document.getElementById("cart-count");
let navCartTotal = document.getElementById("cart-total");
let notification = document.getElementById("notification");



/* Obtenemos el índice del curso a través de localStorage */
let courseIndex = parseInt(localStorage.getItem('chosenCourse'));



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

    };

    // Conexión exitosa con la base de datos
    DBOpenRequest.onsuccess = function (event) {

        console.log('Conexión exitosa con la base de datos');

        db = event.target.result;

        renderCourseInfo();
        renderCourseDetails();
        renderMainCTA();
        actualizarContadorCarrito();

    }

};

createDatabase();



/* Función para renderizar los datos del curso en la página de detalle */
function renderCourseInfo() {

    //Iniciamos la transacción
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');

    let request = objectStore.get(courseIndex);

    request.onsuccess = function (event) {

        let selectedCourse = event.target.result;
        console.log(selectedCourse);

        //Mostramos la información en la interfaz
        cover.style.background = `linear-gradient(180deg, rgba(42, 43, 46, 0.51) 73.31%, rgba(60, 61, 66, 0.37) 100%), url(${selectedCourse.cover})`;
        cover.style.backgroundRepeat = "no-repeat";
        cover.style.backgroundPosition = "center";
        cover.style.backgroundSize = "cover";

        category.textContent = selectedCourse.category;
        name.textContent = selectedCourse.name;
        professorPhoto.setAttribute("src", `${selectedCourse.teacher_photo}`);
        professorPhoto.setAttribute("alt", `${selectedCourse.teacher_name}`);
        professorName.textContent = selectedCourse.teacher_name;
        professorJob.textContent = selectedCourse.teacher_profession;
        about.innerHTML = selectedCourse.description;
        let courseLearnings = selectedCourse.learnings;
        courseLearnings.forEach(element => {
            learnings.innerHTML += `
            <li class="learning">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none"
                    viewbox="0 0 48 48">
                    <path stroke="#8BA5FF" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="3" d="m12 27.167 6 6.333 18-19" />
                </svg>
                <p class="paragraph">${element}</p>
            </li>`
        });

    }

    request.onerror = function (event) {
        console.log('Ocurrió un error intentando obtener los datos de este curso', event);
    }

    // Transacción completada
    // transaction.oncomplete = () => {
    //     console.log('Transaction [renderTasklist] completada con éxito');
    // };

    // Transacción con error
    // transaction.onerror = (e) => {
    //     console.log('Ocurrió un problema al realizar la transaction [renderTasklist]', e);

    //     mainTitle.textContent = 'Ocurrió un problema al intentar cargar esta lista...';
    // };

}



/* Función para renderizar los datos del curso en la página de detalle */
function renderCourseDetails() {

    //Iniciamos la transacción
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');

    let request = objectStore.get(courseIndex);

    request.onsuccess = function (event) {

        let selectedCourse = event.target.result;

        //Mostramos la información en la interfaz
        price.textContent = `$${selectedCourse.price.toLocaleString('de-DE')}`;
        rating.textContent = `${selectedCourse.rating} puntuación promedio.`;
        students.textContent = `${selectedCourse.students} personas lo tomaron.`;
        duration.textContent = `${selectedCourse.duration} horas de video bajo demanda.`;
        level.textContent = selectedCourse.level;
        requirements.textContent = selectedCourse.requirements;
        let courseSubjects = selectedCourse.subjects;

        courseSubjects.forEach(element => {
            subjects.innerHTML += `<li>${element}</li>`
        });

    }

    request.onerror = function (event) {
        console.log('Ocurrió un error intentando obtener los datos de este curso', event);
    }

    // Transacción completada
    // transaction.oncomplete = () => {
    //     console.log('Transaction [renderTasklist] completada con éxito');
    // };

    // Transacción con error
    // transaction.onerror = (e) => {
    //     console.log('Ocurrió un problema al realizar la transaction [renderTasklist]', e);

    //     mainTitle.textContent = 'Ocurrió un problema al intentar cargar esta lista...';
    // };

}



/* Funcionalidad del CTA dependiendo del estado del curso */
mainCTA.addEventListener("click", () => {

    //Identificamos al carrito
    let carritoJSON = JSON.parse(localStorage.getItem('carrito'));
    if (!carritoJSON) {
        carritoJSON = [];
    }

    //Si el curso ya está en el carrito...
    if (carritoJSON.some(course => course.id == courseIndex)) {

        console.log("Ya estoy en el carrito");
        location.href = "cart.html";

    } else {

        //Si el curso todavía no está en el carrito...
        console.log("No estoy en el carrito, voy a agregarme");
        addToCart();
    }

})



//Función para actualizar el texto del CTA
function renderMainCTA() {

    let carritoJSON = JSON.parse(localStorage.getItem('carrito'));
    if (!carritoJSON) {
        carritoJSON = [];
    }

    //Si el curso ya está en el carrito...
    if (carritoJSON.some(course => course.id == courseIndex)) {

        console.log("Este curso ya está en el carrito");
        mainCTAText.textContent = "Ir al carrito";

    } else {

        //Si el curso todavía está en el carrito...
        console.log("No estoy en el carrito aún");
        mainCTAText.textContent = "Agregar al carrito";

    }

}



/* Agregar al carrito */
function addToCart() {

    //Iniciamos la transacción
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');

    let request = objectStore.get(courseIndex);

    request.onsuccess = function (event) {

        let selectedCourse = event.target.result;
        console.log(selectedCourse);

        //Agregamos el curso al carrito en localStorage
        addToCartInLocalStorage(selectedCourse);

        //Actualizamos el CTA
        renderMainCTA();

        //Actualizamos el carrito en el nav
        actualizarContadorCarrito();

        //Notificamos al usuario
        notify();

    }

    request.onerror = function (event) {
        console.log('Ocurrió un error intentando agregar este curso al carrito', event);
    }
}



/* Agregar un curso al carrito en localStorage */
function addToCartInLocalStorage(course) {
    carrito.push(course);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}



/*Función para actualizar las cantidades del carrito en el nav*/
const actualizarContadorCarrito = function () {

    let cantidad = carrito.length;
    navCartCount.setAttribute("data-cart-count", cantidad);

    let total = carrito.reduce((acc, course) => acc + course.price, 0);
    console.log(total);
    navCartTotal.textContent = `$${total.toLocaleString('de-DE')}`;

}



/* Notificación */
function notify() {

    notification.classList.remove("none");
    setTimeout(() => {
        notification.classList.remove("hidden");
    }, 200);


    setTimeout(() => {
        notification.classList.add("hidden");

        setTimeout(() => {
            notification.classList.add("none");
        }, 200);

    }, 5000);

    //Dependiendo si se agregó al carrito o no, cambia el mensaje y el SVG.

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