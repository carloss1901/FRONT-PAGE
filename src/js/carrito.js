const productosCarrito = document.getElementById('productos-carrito')
const footerCarrito = document.getElementById('footer-carrito')
const productosCarritoMobile = document.getElementById('carrito-mobile')
const productosFooterMobile = document.getElementById('footer-mobile')

const loguin = document.getElementById('loguin')
const botonOpciones = document.getElementById('botonOpciones')
const opcionesIndex = document.getElementById('opcionesIndex')
const svgAbrir = document.getElementById('svgAbrir')
const svgCerrar = document.getElementById('svgCerrar')

const templateProducto = document.getElementById('template-producto').content
const templateFooter = document.getElementById('template-footer').content
const templateProductoMobile = document.getElementById('template-producto-mobile').content
const templateFooterMobile = document.getElementById('template-footer-mobile').content
const fragmentCarrito = document.createDocumentFragment()

const userData = localStorage.getItem('userData')
const ps = localStorage.getItem('ps')
const nm = localStorage.getItem('nm')

const contador = document.getElementById('contador')

let carrito = JSON.parse(localStorage.getItem('carrito')) || {}
let routePedido = 'http://localhost:4000/api/pedido/registrar'

document.addEventListener('DOMContentLoaded', function() {
    fetchInitializer()
    console.log("EL DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
    pintarCarrito()
    pintarCarritoMobile()
    pintarFooter()
    try {
        if(localStorage.getItem('carrito')) {
            carrito = JSON.parse(localStorage.getItem('carrito'))
        }
        if(localStorage.getItem('uI') && localStorage.getItem('ps')) {
            loguin.classList.toggle('hidden')
            botonOpciones.classList.toggle('hidden')
        }
    } catch (error) {
        console.log(error)
    }
}

productosCarrito.addEventListener('click', e => {
    btnAccion(e)
})
productosCarritoMobile.addEventListener('click', e => {
    btnAccion(e)
})

function menuUsuario() {
    svgAbrir.classList.toggle('hidden')
    svgCerrar.classList.toggle('hidden')
    opcionesIndex.classList.toggle('hidden')
}
function cerrarSesion() {
    localStorage.removeItem('uI')
    localStorage.removeItem('ps')
    localStorage.removeItem('nm')
    location.reload()
}
const pintarCarrito = () => {
    productosCarrito.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateProducto.querySelector('img').setAttribute("src", producto.img)
        templateProducto.querySelector('#nombre-producto').textContent = producto.title
        templateProducto.querySelector('#cantidad-producto').textContent = producto.cantidad
        templateProducto.querySelector('#precio-producto').textContent = (producto.precio * producto.cantidad).toFixed(2)
        templateProducto.querySelector('#sumar').dataset.id = producto.id
        templateProducto.querySelector('#restar').dataset.id = producto.id
        templateProducto.querySelector('#quitar').dataset.id = producto.id

        const clone = templateProducto.cloneNode(true)
        fragmentCarrito.appendChild(clone)
    })
    productosCarrito.appendChild(fragmentCarrito)
    pintarFooter()
    pintarCarritoMobile()
    
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
const pintarCarritoMobile = () => {
    productosCarritoMobile.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateProductoMobile.querySelector('img').setAttribute("src", producto.img)
        templateProductoMobile.querySelector('#title-card').textContent = producto.title
        templateProductoMobile.querySelector('#cantidad-producto').textContent = producto.cantidad
        templateProductoMobile.querySelector('#precio-producto').textContent = (producto.precio * producto.cantidad).toFixed(2)
        templateProductoMobile.querySelector('#sumar').dataset.id = producto.id
        templateProductoMobile.querySelector('#restar').dataset.id = producto.id
        templateProductoMobile.querySelector('#quitar').dataset.id = producto.id
        
        const clone = templateProductoMobile.cloneNode(true)
        fragmentCarrito.appendChild(clone)
    })
    productosCarritoMobile.appendChild(fragmentCarrito)
    pintarFooter()
    pintarFooterMobile()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}
const pintarFooter = () => {
    footerCarrito.innerHTML = ''
    contador.innerHTML = ''
    
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)

    templateFooter.querySelector('#cantidad-total').textContent = nCantidad
    templateFooter.querySelector('#precio-total').textContent = nPrecio.toFixed(2)
    contador.textContent = nCantidad    

    const clone = templateFooter.cloneNode(true)
    fragmentCarrito.appendChild(clone)
    footerCarrito.appendChild(fragmentCarrito)
}
const pintarFooterMobile = () => {
    productosFooterMobile.innerHTML = ''
    contador.innerHTML = ''

    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)

    templateFooterMobile.querySelector('#cantidad').textContent = nCantidad
    templateFooterMobile.querySelector('#precio').textContent = nPrecio.toFixed(2)
    contador.textContent = nCantidad

    const clone = templateFooterMobile.cloneNode(true)
    fragmentCarrito.appendChild(clone)
    productosFooterMobile.appendChild(fragmentCarrito)
}
// const pintarFooter = () => {
//     footer.innerHTML = ''
//     if(Object.keys(carrito).length === 0) {
//         footer.innerHTML = `
//         <th scope="row" colspan="5">Carrito vacío - Comience a comprar!</th>
//         `
//         return 
//     }

//     const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
//     const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio,0)

//     templateFooter.querySelectorAll('td')[0].textContent = nCantidad
//     templateFooter.querySelector('span').textContent = formatCurrency(nPrecio)

//     const clone = templateFooter.cloneNode(true)
//     fragment.appendChild(clone)
//     footer.appendChild(fragment)    

//     const btnVaciar = document.getElementById('vaciar-carrito')
//     btnVaciar.addEventListener('click', () => {
//         carrito = {}
//         pintarCarrito()
//         notificacionConfirmacion2()
//     })
//     const btnPedido = document.getElementById('realizar-pedido')
//     btnPedido.addEventListener('click', () => {
//         const carritoString = localStorage.getItem('carrito')
//         const userDataString = localStorage.getItem('userData')
//         if(carritoString) {
//             const carrito = JSON.parse(carritoString)
//             const userData = JSON.parse(userDataString)
            
//             if(userData) {
//                 Swal.fire({
//                     title: 'Confirmar Pedido',
//                     html: '<h3>¿Desea continuar con el pedido?</h3><p>Asegúrese de verificar todos los detalles antes de confirmar el pedido. Ya que no hay vuelta atrás una vez realizado el pedido</p>',
//                     icon: 'info',   
//                     showCancelButton: true,
//                     confirmButtonText: 'Continuar',
//                     cancelButtonText: 'Cancelar',
//                 }).then((result) => {
//                     if(result.isConfirmed) {
//                         buscarUsuario(userData)
//                         .then(username => {
//                             const c = desencriptar(ps)
//                             const auth = new Headers()
//                             auth.append('Authorization','Basic ' + btoa(username + ":" + c))
                            
//                             const detalles = Object.values(carrito).map(item => ({
//                                 producto: {
//                                     id_producto: item.id,
//                                 },
//                                 precio: item.precio,
//                                 cantidad: item.cantidad,
//                             }))
//                             const data = {
//                                 usuario: {
//                                     id_usuario: userData
//                                 },
//                                 detalles: detalles
//                             }
//                             fetch('http://localhost:8080/pedido/registrar', {
//                                 method: 'POST',
//                                 headers: {
//                                     'Content-Type': 'application/json',
//                                     'Authorization': auth.get('Authorization')
//                                 },
//                                 body: JSON.stringify(data),
//                             })
//                             .then(response => response.json())
//                             .then(data => {
//                                 console.log('Pedido registrado:', data);
//                                 btnVaciar.click();
//                                 notificacionConfirmacion3()
//                             })
//                             .catch(error => {
//                                 console.error('Error al realizar el pedido:', error)
//                             })
//                         })
//                     }
//                 })
                
//             } else {
//                 notificacionDenegacion()
//             }
//         } else {
//             console.log('El carrito está vacío')
//         }
//     })
// }
const btnAccion = e => {
    if(e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
        pintarCarritoMobile()
    }

    if(e.target.classList.contains('btn-danger')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            // notificacionConfirmacion()
        }
        pintarCarrito()
        pintarCarritoMobile()
    }

    if(e.target.classList.contains('btn-trash')) {
        const producto = carrito[e.target.dataset.id];
        delete carrito[producto.id];
        pintarCarrito()
        pintarCarritoMobile()
    }
    e.stopPropagation()
}

// function notificacionConfirmacion() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Producto eliminado al carrito',
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: '#f0fff0',
//         iconColor: '#50C878',
//         customClass: {
//           popup: 'animated slideInRight'
//         }
//       });
// }
// function notificacionConfirmacion2() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Productos eliminados del carrito',
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: '#f0fff0',
//         iconColor: '#50C878',
//         customClass: {
//           popup: 'animated slideInRight'
//         }
//       })
// }
// function notificacionConfirmacion3() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Pedido Realizado',
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: '#f0fff0',
//         iconColor: '#50C878',
//         customClass: {
//           popup: 'animated slideInRight'
//         }
//       })
// }
// function notificacionDenegacion() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'error',
//         title: 'Debe iniciar sesión para realizar el pedido',
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: '#f8d7da',
//         iconColor: '#721c24',
//         customClass: {
//           popup: 'animated slideInRight'
//         }
//       });
// }
function desencriptar(password) {
    let passwordDesencript = ""
    for(let i = 0; i < password.length; i++) {
      const caracter = password[i]
      const valorAsci = caracter.charCodeAt(0)
      const nuevoValorAsci = valorAsci - 30
      const nuevoCaracter = String.fromCharCode(nuevoValorAsci)
      passwordDesencript += nuevoCaracter
    }
    return passwordDesencript
}
// function buscarUsuario(userId) {
//     return fetch(`http://localhost:8080/usuario/id/${userId}`)
//     .then(response => response.json())
//     .then(user => {
//       if(user && user.username) {
//         return user.username
//       } else {
//         throw new Error('No se encontró el nombre de usuario')
//       }
//     })
//     .catch(error => {
//       console.error('Error al obtener los datos del usuario: ', error)
//       throw error
//     })
// }
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('es-PE', { style:'currency', currency:'PEN' })
    return formatter.format(amount)
}