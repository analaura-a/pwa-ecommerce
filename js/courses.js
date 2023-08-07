/* Elementos HTML DOM */
let containerCourses = document.getElementById('container-courses');
let todosCategory = document.getElementById('explorar');
let filters = document.querySelectorAll('.filter');
let filterTodos = document.getElementById('filter-todos');
let filterUx = document.getElementById('filter-ux_ui');
let filterFrontend = document.getElementById('filter-frontend');
let filterBackend = document.getElementById('filter-backend');
let filterData = document.getElementById('filter-data');




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

                    // Renderizamos los cursos         
                    renderCourses();

                })
                .catch((error) => console.log('Ocurrió un error intentando obtener el JSON de las listas', error));
        };

        // Renderizamos los cursos 
        renderCourses();

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



/* Verificamos la categoría elegida por el usuario */
let chosenCategory = localStorage.getItem('chosenCategory');

if (!chosenCategory) {
    localStorage.setItem('chosenCategory', "Todos");
} else {
    console.log(chosenCategory);
}

function loadSelectedCategory() {

    let chosenCategoryID = localStorage.getItem('chosenCategory').toLocaleLowerCase().replace('/', '_');

    let chosenFilter = document.getElementById(`filter-${chosenCategoryID}`);
    chosenFilter.classList.add("filter-active");

}

loadSelectedCategory();



/* Renderizar los cursos elegidos */
function renderCourses() {

    vaciarContainer();

    //Iniciamos la transacción de lectura de la base de datos
    const transaction = db.transaction(['courses'], 'readonly');
    let objectStore = transaction.objectStore('courses');
    let categoryIndex = objectStore.index("category");


    if (chosenCategory === "Todos") {

        let request = objectStore.getAll();

        request.onsuccess = function (event) {

            let array = event.target.result;

            array.forEach((course) => {

                //Creamos una card por cada curso
                let divCourseCard = document.createElement("div");
                divCourseCard.classList.add("course-card");

                let cardContent = `
                <a href="detail.html" class="anchor-detail">
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
                containerCourses.appendChild(divCourseCard);

                //Agregamos un evento para obtener su ID
                divCourseCard.addEventListener("click", () => {
                    localStorage.setItem('chosenCourse', course.id);
                });

            });


        };

        request.onerror = function (event) {
            console.log('Ocurrió un error intentando mostrar los cursos', event);
        };

    } else {

        let request = categoryIndex.getAll(chosenCategory);

        request.onsuccess = function (event) {

            let array = event.target.result;

            array.forEach((course) => {

                //Creamos una card por cada curso
                let divCourseCard = document.createElement("div");
                divCourseCard.classList.add("course-card");

                let cardContent = `
                <a href="detail.html" class="anchor-detail">
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
                containerCourses.appendChild(divCourseCard);

                //Agregamos un evento para obtener su ID
                divCourseCard.addEventListener("click", () => {
                    localStorage.setItem('chosenCourse', course.id);
                });

            });


        };

        request.onerror = function (event) {
            console.log('Ocurrió un error intentando mostrar los cursos', event);
        };

    }


};



/* Eventos para detectar la categoría seleccionada */
todosCategory.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Todos");
});

filterTodos.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Todos");
    chosenCategory = localStorage.getItem('chosenCategory');
    renderCourses();
});

filterUx.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "UX/UI");
    chosenCategory = localStorage.getItem('chosenCategory');
    renderCourses();
});

filterFrontend.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Frontend");
    chosenCategory = localStorage.getItem('chosenCategory');
    renderCourses();
});

filterBackend.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Backend");
    chosenCategory = localStorage.getItem('chosenCategory');
    renderCourses();
});

filterData.addEventListener("click", () => {
    localStorage.setItem('chosenCategory', "Data");
    chosenCategory = localStorage.getItem('chosenCategory');
    renderCourses();
});

/* Evento para cambiar la interfaz */
filters.forEach(boton => {

    boton.addEventListener("click", (e) => {

        filters.forEach(boton => {
            boton.classList.remove("filter-active");
            console.log('boton')
        });

        e.currentTarget.classList.add("filter-active");

    });

});



/* Función para vaciar el contenedor */
let vaciarContainer = function () {
    containerCourses.innerHTML = "";
};



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