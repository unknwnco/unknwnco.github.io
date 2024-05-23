// Seleccionar todos los botones
var botones = document.querySelectorAll('.btnmm');
    
// Añadir evento de clic a cada botón
botones.forEach(function(boton) {
    boton.addEventListener('click', function() {
        // Ocultar todos los elementos de contenido
        var contenidos = document.querySelectorAll('.content');
        contenidos.forEach(function(contenido) {
            contenido.classList.remove('active');
        });
        // Mostrar el contenido relacionado con el botón clicado
        var contentId = boton.getAttribute('data-content');
        document.getElementById(contentId).classList.add('active');
    });
});

// Función para cargar y mostrar los pedidos del usuario junto con su estado
function loadUserOrders() {
    const database = firebase.database();
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const userRef = database.ref(`usuarios/${usuario.uid}`);
        const pendientePagoRef = userRef.child('Productos/PendientePago');
        const enCaminoRef = userRef.child('Productos/EnCamino');
        const entregadoRef = userRef.child('Productos/Entregado');

        Promise.all([getOrders(pendientePagoRef), getOrders(enCaminoRef), getOrders(entregadoRef)])
            .then(([pendientePagoOrders, enCaminoOrders, entregadoOrders]) => {
                const allOrders = [...pendientePagoOrders, ...enCaminoOrders, ...entregadoOrders];
                const ordersTable = document.getElementById('orders-table');
                ordersTable.innerHTML = ''; // Limpiar la tabla antes de cargar los datos

                allOrders.forEach((order, index) => {
                    const row = document.createElement('tr');
                    const orderIdCell = document.createElement('td'); // Celda para el ID del pedido
                    const statusCell = document.createElement('td'); // Celda para el estado del pedido

                    orderIdCell.textContent = order.id; // Mostrar el ID del pedido
                    statusCell.textContent = order.status; // Mostrar el estado del pedido

                    row.appendChild(orderIdCell);
                    row.appendChild(statusCell);

                    ordersTable.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error al obtener los pedidos:', error);
            });
    } else {
        console.log("Usuario no autenticado. No se pueden cargar los pedidos.");
    }
}

// Función para obtener los pedidos de una referencia específica
function getOrders(ref) {
    return ref.once('value').then(snapshot => {
        const orders = [];
        snapshot.forEach(childSnapshot => {
            const order = {
                id: childSnapshot.key, // ID del pedido
                status: ref.key // Estado del pedido (PendientePago, EnCamino, Entregado)
            };
            orders.push(order);
        });
        return orders;
    });
}

// Llamar a la función para cargar y mostrar los pedidos del usuario
loadUserOrders();


        