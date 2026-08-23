/* ==========================================================================
   1. INICIALIZACIÓN DE SWIPER (CARRUSEL DE PRODUCTOS)
   ========================================================================== */
if (document.querySelector('.miCarrusel')) {
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
}

/* ==========================================================================
   1.2 INICIALIZACIÓN DEL CARRUSEL DE PATRONES (CON CENTRADO DINÁMICO)
   ========================================================================== */
if (document.querySelector('.carruselPatrones')) {
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
}

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

/* ==========================================================================
   3. VISTA PREVIA DE STOCK (SOLO EN INDEX.HTML)
   ========================================================================== */
async function cargarStockPreview() {
    const contenedor = document.getElementById('stock-preview-container');
    if (!contenedor) return; // Si no existe en esta página, no hace nada

    try {
        const respuesta = await fetch('stock.json');
        const productos = await respuesta.json();
        const destacados = productos.slice(0, 3); // Muestra máximo 3 en el index

        destacados.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'stock-preview-card';
            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">L. ${producto.precio}</p>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('No se pudo cargar la vista previa del stock:', error);
    }
}

/* ==========================================================================
   4. LISTA COMPLETA DE STOCK CON DETALLES DESPLEGABLES (SOLO EN stock.html)
   ========================================================================== */
async function cargarListaStock() {
    const contenedor = document.getElementById('lista-stock');
    if (!contenedor) return; // Si no existe en esta página, no hace nada

    try {
        const respuesta = await fetch('stock.json');
        const productos = await respuesta.json();

        productos.forEach(producto => {
            const item = document.createElement('div');
            item.className = 'item-stock';

            // Arma los detalles solo con los campos que el producto realmente tiene
            let detalles = '';
            if (producto.talla) detalles += `<p><strong>Talla:</strong> ${producto.talla}</p>`;
            if (producto.medidas) detalles += `<p><strong>Medidas:</strong> ${producto.medidas}</p>`;
            if (producto.color) detalles += `<p><strong>Color:</strong> ${producto.color}</p>`;
            if (producto.material) detalles += `<p><strong>Material:</strong> ${producto.material}</p>`;
            detalles += `<p><strong>Cantidad disponible:</strong> ${producto.cantidad ?? 0}</p>`;

            item.innerHTML = `
                <div class="item-stock-cabecera">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="item-stock-info">
                        <h3>${producto.nombre}</h3>
                        <p class="precio">L. ${producto.precio}</p>
                    </div>
                    <span class="badge-disponibilidad ${producto.disponible ? 'badge-disponible' : 'badge-agotado'}">
                        ${producto.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                </div>
                <div class="item-stock-detalle">
                    ${detalles}
                </div>
            `;

            // Al hacer clic en la cabecera, se abre/cierra el detalle
            item.querySelector('.item-stock-cabecera').addEventListener('click', () => {
                item.classList.toggle('abierto');
            });

            contenedor.appendChild(item);
        });
    } catch (error) {
        console.error('No se pudo cargar la lista de stock:', error);
    }
}

/* ==========================================================================
   5. LIGHTBOX: AMPLIAR IMAGEN AL HACER CLIC (INDEX Y STOCK)
   ========================================================================== */
function activarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const cerrar = document.querySelector('.lightbox-cerrar');

    // Detecta clics en CUALQUIER imagen de producto (vista previa o lista completa)
    document.querySelectorAll('.stock-preview-card img, .item-stock-cabecera img').forEach(img => {
        img.addEventListener('click', (evento) => {
            evento.stopPropagation(); // Evita que también se abra/cierre el detalle del producto
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('activo');
        });
    });

    cerrar.addEventListener('click', () => lightbox.classList.remove('activo'));
    lightbox.addEventListener('click', (evento) => {
        if (evento.target === lightbox) lightbox.classList.remove('activo'); // Cierra si haces clic fuera de la imagen
    });
}

async function iniciarStock() {
    await cargarStockPreview();
    await cargarListaStock();
    activarLightbox(); // Se activa solo cuando ya existen las imágenes en la página
}

iniciarStock();