/* ==========================================================================
   1. INICIALIZACIÓN DE SWIPER (CARRUSEL DE PRODUCTOS)
   ========================================================================== */
const swiper = new Swiper('.miCarrusel', {
    loop: true,               /* Hace que el catálogo sea infinito */
    centeredSlides: true,      /* Obliga a que el producto actual se muestre ENMEDIO */
    sliceByGroup: 1,
    grabCursor: true,          /* Cambia el mouse a una manito para arrastrar */
    
    // Configura cuántas tarjetas se ven según el tamaño de pantalla
    breakpoints: {
        320: { slidesPerView: 1.3, spaceBetween: 20 },  // Celular
        768: { slidesPerView: 2, spaceBetween: 30 },    // Tablet
        1024: { slidesPerView: 3, spaceBetween: 40 }   // Computadora
    },
    
    // Activa las flechas laterales
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

/* ==========================================================================
   1.2 INICIALIZACIÓN DEL CARRUSEL DE PATRONES (CON CENTRADO DINÁMICO)
   ========================================================================== */
const carruselPatrones = new Swiper('.carruselPatrones', {
    loop: false,               
    sliceByGroup: 1,
    grabCursor: true,
    
    /* 🪄 LA MAGIA DEL CENTRADO: 
       Si añades más patrones en el futuro, Swiper los manejará fluido. 
       Mientras sean menos de 3, estas dos líneas los mantendrán en el centro exacto */
    watchOverflow: true,       
    centerInsufficientSlides: true, 
    
    // Configura cuántas tarjetas se ven según la pantalla
    breakpoints: {
        320: { slidesPerView: 1.1, spaceBetween: 15 }, // Celular
        768: { slidesPerView: 2, spaceBetween: 25 },   // Tablet
        1024: { slidesPerView: 3, spaceBetween: 30 }  // Computadora
    },
    
    // Flechas específicas para esta sección
    navigation: {
        nextEl: '.next-patron',
        prevEl: '.prev-patron',
    },
});

/* ==========================================================================
   2. NAVBAR INTERACTIVA (COMPORTAMIENTO STICKY AL HACER SCROLL)
   ========================================================================== */
let ultimoScrollTop = 0;
const miHeader = document.querySelector("header");

window.addEventListener("scroll", function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Evita errores con el rebote elástico de pantallas móviles
    if (scrollTop < 0) {
        scrollTop = 0;
    }

    if (scrollTop > ultimoScrollTop && scrollTop > 150) {
        // Si vas hacia ABAJO y ya bajaste más de 150px, esconde el menú
        miHeader.classList.add("scroll-abajo");
    } else {
        // Si vas hacia ARRIBA, vuelve a mostrar el menú de inmediato
        miHeader.classList.remove("scroll-abajo");
    }
    
    ultimoScrollTop = scrollTop;
});