document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad de Navegación Principal (Mostrar/Ocultar Módulos de Sección) ---

    const navItems = document.querySelectorAll('.imperial-nav .nav-item');
    const modules = document.querySelectorAll('.content-area .module');

    const showModule = (targetId) => {
        // Ocultar todos los módulos
        modules.forEach(module => {
            module.classList.remove('active');
        });

        // Mostrar el módulo objetivo
        const targetModule = document.querySelector(targetId);
        if (targetModule) {
            targetModule.classList.add('active');

            // Opcional: Scroll suave al inicio del módulo
             window.scrollTo({
                  top: document.querySelector('.imperial-nav').offsetHeight, // Scroll justo debajo de la nav fija
                  behavior: 'smooth'
             });

            // Si el módulo es el Códice, asegurar que el primer Eco esté activo (si no hay hash específico)
            if (targetId === '#codice-omega') {
                 // Pequeño retraso para asegurar que el módulo se muestre antes de intentar activar el eco
                 setTimeout(() => {
                     const firstEcoItem = document.querySelector('#codice-omega .sub-nav-item');
                      // Check if there's no specific eco hash in the URL or if the target eco wasn't found by initial hash check
                     if (firstEcoItem && !window.location.hash.includes('#eco-')) {
                          // Simulate click on the first Eco if no specific Eco was requested via hash
                         firstEcoItem.click();
                     } else if (window.location.hash.includes('#eco-')) {
                         // If an eco hash exists, ensure the panel scrolls to top after content is shown
                         const readingPanel = document.querySelector('#codice-omega .reading-panel');
                         if (readingPanel) {
                              readingPanel.scrollTo({ top: 0, behavior: 'smooth' });
                         }
                     }
                 }, 50); // Retraso mínimo
            }
        }
    };

    // Asignar eventos a los enlaces de navegación principal
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir la acción por defecto del enlace

            const targetId = item.getAttribute('href'); // Obtener el #id (ej: #codice-omega)

            // Remover clase 'active' de todos los ítems de nav
            navItems.forEach(nav => nav.classList.remove('active'));
            // Añadir clase 'active' al ítem clickeado
            item.classList.add('active');

            // Mostrar el módulo correspondiente
            showModule(targetId);

            // Opcional: Actualizar el hash de la URL sin causar un salto completo
            // history.pushState(null, '', targetId); // Simple hash update without popstate handling
        });
    });


     // --- Funcionalidad de Sub-Navegación del Códice Omega (Mostrar/Ocultar Contenido de Eco) ---

    // Asegurarse de que estos selectores solo busquen DENTRO del módulo codice-omega
    const codiceSubNavItems = document.querySelectorAll('#codice-omega .codice-sub-nav .sub-nav-item');
    const ecoContents = document.querySelectorAll('#codice-omega .codice-content-area .eco-content');

    const showEcoContent = (targetId) => {
        // Ocultar todos los contenidos de Eco
        ecoContents.forEach(content => {
            content.classList.remove('active');
        });

        // Mostrar el contenido del Eco objetivo
        // El ID del contenido es targetId (ej: '#eco-i') + '-content'
        const targetEco = document.querySelector(targetId + '-content');
        if (targetEco) {
            targetEco.classList.add('active');

            // Scroll suave dentro del reading-panel al inicio del Eco
            const readingPanel = document.querySelector('#codice-omega .reading-panel');
            if (readingPanel) {
                 readingPanel.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                 });
            }
        }
    };

    // Asignar eventos a los enlaces de la sub-navegación del Códice
    codiceSubNavItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir la acción por defecto del enlace

            const targetId = item.getAttribute('href'); // Obtener el #id (ej: #eco-i)

            // Remover clase 'active' de todos los ítems de sub-nav
            codiceSubNavItems.forEach(subItem => subItem.classList.remove('active'));
            // Añadir clase 'active' al ítem clickeado
            item.classList.add('active');

            // Mostrar el contenido del Eco correspondiente
            showEcoContent(targetId);

            // Opcional: Actualizar el hash de la URL para permitir deep linking a Ecos
            // Combina el hash del módulo Códice con el hash del Eco
            // history.pushState(null, '', '#codice-omega' + targetId); // e.g. #codice-omega#eco-i
        });
    });


    // --- Lógica de Inicio: Mostrar el módulo correcto al cargar la página ---

    const handleInitialHash = () => {
        const initialHash = window.location.hash;
        let targetModuleId = '#inicio'; // Módulo por defecto

        // Comprobar si el hash actual coincide con un módulo principal
        // Usamos includes para permitir #codice-omega#eco-i
        const moduleHashes = Array.from(navItems).map(item => item.getAttribute('href'));
        const validModuleHash = moduleHashes.find(hash => initialHash.startsWith(hash) || initialHash.includes(hash));

        if (validModuleHash) {
             // Si el hash es como #codice-omega#eco-i, el targetModuleId es solo #codice-omega
            if (validModuleHash.startsWith('#codice-omega') && initialHash.includes('#eco-')) {
                 targetModuleId = '#codice-omega';
            } else {
                 targetModuleId = validModuleHash;
            }


            // Activar el enlace de navegación principal correspondiente
            const initialNavItem = document.querySelector(`.imperial-nav a[href="${targetModuleId}"]`);
            if (initialNavItem) {
                 navItems.forEach(nav => nav.classList.remove('active'));
                 initialNavItem.classList.add('active');
            }

             // Mostrar el módulo principal
             showModule(targetModuleId);

             // Si el módulo es el Códice, intentar activar el Eco específico si hay un sub-hash
             if (targetModuleId === '#codice-omega') {
                 // Esperar un breve momento para asegurar que el módulo Códice sea visible y sus elementos estén disponibles
                 setTimeout(() => {
                     const ecoHashMatch = initialHash.match(/#eco-[ivx]+/);
                     if (ecoHashMatch) {
                         const initialEcoHash = ecoHashMatch[0]; // Ej: #eco-ii
                         const initialEcoItem = document.querySelector(`#codice-omega .codice-sub-nav a[href="${initialEcoHash}"]`);
                         if (initialEcoItem) {
                             initialEcoItem.click(); // Simular click en el enlace del Eco
                         } else {
                             // Si el Eco hash no es válido, activar el primer Eco por defecto
                              const firstEcoItem = document.querySelector('#codice-omega .sub-nav-item');
                             if (firstEcoItem) {
                                firstEcoItem.click();
                             }
                         }
                     } else {
                          // Si no hay hash de Eco, activar el primer Eco por defecto
                         const firstEcoItem = document.querySelector('#codice-omega .sub-nav-item');
                         if (firstEcoItem) {
                            firstEcoItem.click();
                         }
                     }
                 }, 150); // Un pequeño retraso es a menudo necesario después de mostrar un módulo
             }

        } else {
            // Si no hay hash válido o no hay hash, mostrar el módulo de Inicio por defecto
            showModule(targetModuleId);
            // Asegurarse de que el enlace de Inicio en la nav esté activo
            const homeNavItem = document.querySelector('.imperial-nav a[href="#inicio"]');
            if (homeNavItem) {
                 navItems.forEach(nav => nav.classList.remove('active'));
                 homeNavItem.classList.add('active');
            }
        }
    };

     // Ejecutar la lógica de hash inicial al cargar la página
    handleInitialHash();

    // Opcional: Añadir listener para el evento popstate si se usa history.pushState
    // window.addEventListener('popstate', handleInitialHash);

});