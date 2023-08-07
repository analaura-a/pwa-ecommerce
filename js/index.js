/* Elementos HTML DOM */
const containerTrending = document.getElementById('container-trending');
const uxCategory = document.getElementById('ux-category');
const uxCounter = document.getElementById('ux-counter');
const frontendCategory = document.getElementById('frontend-category');
const frontendCounter = document.getElementById('frontend-counter');
const backendCategory = document.getElementById('backend-category');
const backendCounter = document.getElementById('backend-counter');
const dataCategory = document.getElementById('data-category');
const dataCounter = document.getElementById('data-counter');
const todosCategory = document.getElementById('explorar');



/* FETCH */
async function fetchCourses() {
    try {
        let response = await fetch("../json/courses.json");
        let data = await response.json();
        return data;
    } catch (error) {
        console.log('Ocurrió un error al intentar obtener la información del JSON', error);
    }
}



/* IndexedDB */
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

    };

    // Conexión exitosa con la base de datos
    DBOpenRequest.onsuccess = function (event) {

        console.log('Conexión exitosa con la base de datos');

        db = event.target.result;

        // Verificamos si la base de datos ya se ha inicializado
        if (!dbInitialized) {

            // Si aún no lo hizo, agregamos la información en el JSON a nuestra base de datos indexedDB
            fetchCourses()
                .then((data) => {
                    JSONtoDatabase(data);

                    // Renderizamos los cursos populares
                    renderTrendingCourses();

                    // Renderizamos los contadores de los cursos
                    renderCounterCategories();
                })
                .catch((error) => console.log('Ocurrió un error intentando obtener el JSON de las listas', error));
        };

        // Renderizamos los cursos populares
        renderTrendingCourses();

        // Renderizamos los contadores de los cursos
        renderCounterCategories();

        // Almacenamos en localStorage que la base de datos se inicializó
        localStorage.setItem('dbInitialized', true);
    }



};

createDatabase();



/* Agregar los cursos en el JSON a indexedDB */
function JSONtoDatabase(data) {

    const transaction = db.transaction(['courses'], 'readwrite');
    let objectStore = transaction.objectStore('courses');

    data.forEach((course) => {

        let courseJSON = {
            "name": course.name,
            "category": course.category,
            "cover": course.cover,
            "price": course.price,
            "short_description": course.short_description,
            "teacher_name": course.teacher_name,
            "teacher_profession": course.teacher_profession,
            "teacher_photo": course.teacher_photo,
            "description": course.description,
            "learnings": course.learnings,
            "rating": course.rating,
            "students": course.students,
            "duration": course.duration,
            "level": course.level,
            "requirements": course.requirements,
            "subjects": course.subjects,
            "trending": course.trending
        }

        let request = objectStore.add(courseJSON);

        request.onsuccess = function () {
            console.log('Se agregaron con éxito los cursos en el JSON a la base de datos');
        };

        request.onerror = function (event) {
            console.log('Ocurrió un error intentando agregar los cursos en el JSON a la base de datos', event);
        };

    });

    // Transacción completada
    transaction.oncomplete = () => {
        console.log('Transaction [JSONtoDatabase] completada con éxito');
    };

    // Transacción con error
    transaction.onerror = (e) => {
        console.log('Ocurrió un problema al realizar la transaction [JSONtoDatabase]', e);
    };

}



/* Renderizar cursos populares */
function renderTrendingCourses() {

    //Iniciamos la transacción de lectura de la base de datos
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');
    let trendingIndex = objectStore.index("trending");

    let request = trendingIndex.getAll("true");

    request.onsuccess = function (event) {

        let array = event.target.result;

        array.forEach((course) => {

            //Creamos una card por cada curso
            let divCourseCard = document.createElement("div");
            divCourseCard.classList.add("course-card");

            let cardContent = `
                <a href="html/detail.html" class="anchor-detail">
                    <div class="card-img">
                        <img src="${course.cover}" alt="">
                    </div>
                    <div class="card-content">
                        <p class="card-content-category mb-8">${course.category}</p>
                        <h3 class="h3 mb-4">${course.name}</h3>
                        <p class="card-content-paragraph mb-12">${course.short_description}</p>
                        <p class="card-content-price">$${course.price.toLocaleString('de-DE')}</p>
                    </div>
                </a>`;

            divCourseCard.innerHTML = cardContent;

            //Las agregamos al contenedor
            containerTrending.appendChild(divCourseCard);

            //Agregamos un evento para obtener su ID
            divCourseCard.addEventListener("click", () => {
                localStorage.setItem('chosenCourse', course.id);
            });

        });


    };

    request.onerror = function (event) {
        console.log('Ocurrió un error intentando mostrar los cursos en tendencia', event);
    };

};



/* Renderizar contadores de curso por categoría */
function renderCounterCategories() {

    //Iniciamos la transacción de lectura de la base de datos
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');
    let categoryIndex = objectStore.index("category");

    //Contador cursos de UX
    let requestUX = categoryIndex.count("UX/UI");

    requestUX.onsuccess = function (event) {
        let count = event.target.result;
        uxCounter.textContent = `${count} cursos.`;
    };

    requestUX.onerror = function () {
        uxCounter.textContent = "0 cursos.";
    };

    //Contador cursos de Frontend
    let requestFrontend = categoryIndex.count("Frontend");

    requestFrontend.onsuccess = function (event) {
        let count = event.target.result;
        frontendCounter.textContent = `${count} cursos.`;
    };

    requestFrontend.onerror = function () {
        frontendCounter.textContent = "0 cursos.";
    };

    //Contador cursos de Backend
    let requestBackend = categoryIndex.count("Backend");

    requestBackend.onsuccess = function (event) {
        let count = event.target.result;
        backendCounter.textContent = `${count} cursos.`;
    };

    requestBackend.onerror = function () {
        backendCounter.textContent = "0 cursos.";
    };

    //Contador cursos de Data
    let requestData = categoryIndex.count("Data");

    requestData.onsuccess = function (event) {
        let count = event.target.result;
        dataCounter.textContent = `${count} cursos.`;
    };

    requestBackend.onerror = function () {
        dataCounter.textContent = "0 cursos.";
    };

};


/* Eventos para detectar la categoría seleccionada */
uxCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "UX/UI");
});

frontendCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Frontend");
});

backendCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Backend");
});

dataCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Data");
});

todosCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Todos");
});



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