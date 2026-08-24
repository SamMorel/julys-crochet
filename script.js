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
    if (!contenedor) return;

    try {
        const respuesta = await fetch('stock.json');
        const productos = await respuesta.json();
        const destacados = productos.slice(0, 4);

        destacados.forEach((producto, index) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'stock-preview-card';
            tarjeta.innerHTML = `
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" data-producto-index="${index}" data-origen="preview">
                <h3>${producto.nombre}</h3>
                <p class="precio">L. ${producto.precio}</p>
            `;
            contenedor.appendChild(tarjeta);
        });

        window.stockPreviewData = destacados; // Guarda los datos para que el lightbox los use
    } catch (error) {
        console.error('No se pudo cargar la vista previa del stock:', error);
    }
}

/* ==========================================================================
   4. LISTA COMPLETA DE STOCK CON DETALLES DESPLEGABLES (SOLO EN stock.html)
   ========================================================================== */
async function cargarListaStock() {
    const contenedor = document.getElementById('lista-stock');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('stock.json');
        const productos = await respuesta.json();

        productos.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'item-stock';

            let detalles = '';
            if (producto.talla) detalles += `<p><strong>Talla:</strong> ${producto.talla}</p>`;
            if (producto.medidas) detalles += `<p><strong>Medidas:</strong> ${producto.medidas}</p>`;
            if (producto.color) detalles += `<p><strong>Color:</strong> ${producto.color}</p>`;
            if (producto.material) detalles += `<p><strong>Material:</strong> ${producto.material}</p>`;
            detalles += `<p><strong>Cantidad disponible:</strong> ${producto.cantidad ?? 0}</p>`;

            item.innerHTML = `
                <div class="item-stock-cabecera">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}" data-producto-index="${index}" data-origen="lista">
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

            item.querySelector('.item-stock-cabecera').addEventListener('click', (evento) => {
                if (evento.target.tagName !== 'IMG') item.classList.toggle('abierto');
            });

            contenedor.appendChild(item);
        });

        window.stockListaData = productos; // Guarda los datos para que el lightbox los use
    } catch (error) {
        console.error('No se pudo cargar la lista de stock:', error);
    }
}

/* ==========================================================================
   5. LIGHTBOX CON CARRUSEL DE FOTOS (INDEX Y STOCK)
   ========================================================================== */
function activarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const contador = document.getElementById('lightbox-contador');
    const cerrar = document.querySelector('.lightbox-cerrar');
    const btnAnterior = document.querySelector('.lightbox-anterior');
    const btnSiguiente = document.querySelector('.lightbox-siguiente');

    let fotosActuales = [];
    let indiceActual = 0;

    function mostrarFoto() {
        lightboxImg.src = fotosActuales[indiceActual];
        const hayVarias = fotosActuales.length > 1;
        btnAnterior.style.display = hayVarias ? 'flex' : 'none';
        btnSiguiente.style.display = hayVarias ? 'flex' : 'none';
        contador.style.display = hayVarias ? 'block' : 'none';
        contador.textContent = `${indiceActual + 1} / ${fotosActuales.length}`;
    }

    document.querySelectorAll('.stock-preview-card img, .item-stock-cabecera img').forEach(img => {
        img.addEventListener('click', (evento) => {
            evento.stopPropagation();
            const origen = img.dataset.origen;
            const idx = img.dataset.productoIndex;
            const datos = origen === 'preview' ? window.stockPreviewData : window.stockListaData;

            fotosActuales = datos[idx].imagenes;
            indiceActual = 0;
            mostrarFoto();
            lightbox.classList.add('activo');
        });
    });

    btnAnterior.addEventListener('click', () => {
        indiceActual = (indiceActual - 1 + fotosActuales.length) % fotosActuales.length;
        mostrarFoto();
    });

    btnSiguiente.addEventListener('click', () => {
        indiceActual = (indiceActual + 1) % fotosActuales.length;
        mostrarFoto();
    });

    cerrar.addEventListener('click', () => lightbox.classList.remove('activo'));
    lightbox.addEventListener('click', (evento) => {
        if (evento.target === lightbox) lightbox.classList.remove('activo');
    });

    // Permite navegar con las flechas del teclado
    document.addEventListener('keydown', (evento) => {
        if (!lightbox.classList.contains('activo')) return;
        if (evento.key === 'ArrowLeft') btnAnterior.click();
        if (evento.key === 'ArrowRight') btnSiguiente.click();
        if (evento.key === 'Escape') lightbox.classList.remove('activo');
    });
}

async function iniciarStock() {
    await cargarStockPreview();
    await cargarListaStock();
    activarLightbox();
}

iniciarStock();

/* ==========================================================================
   6. ANIMACIÓN DE REVELADO AL HACER SCROLL (TODAS LAS PÁGINAS)
   ========================================================================== */
function activarScrollReveal() {
    const elementos = document.querySelectorAll('.reveal, .reveal-cascada');
    if (elementos.length === 0) return;

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target); // Solo se anima una vez
            }
        });
    }, {
        threshold: 0.15 // Se activa cuando el 15% del elemento ya es visible
    });

    elementos.forEach(el => observador.observe(el));
}

activarScrollReveal();