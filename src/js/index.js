const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const cart = document.getElementById('cart')
const categorias = document.getElementById('categorias')
const showCarrito = document.getElementById('show-carrito')
const productoCarrito = document.getElementById('producto-carrito')
const productoFooterCarrito = document.getElementById('producto-footer-carrito')
const contadorCarrito = document.getElementById('contador-carrito')

const svgAbrir = document.getElementById('svgAbrir')
const svgCerrar = document.getElementById('svgCerrar')
const mobileMenu = document.getElementById('mobile-menu')
const svgAbrirIndex = document.getElementById('svgAbrirIndex')
const svgCerrarIndex = document.getElementById('svgCerrarIndex')
const opcionesIndex = document.getElementById('opcionesIndex')
const botonOpciones = document.getElementById('botonOpciones')
const loguin = document.getElementById('loguin')
const loguinIndex = document.getElementById('loguinIndex')
const botonOpcionesIndex = document.getElementById('botonOpcionesIndex')

const buttonCarrito = document.getElementById('button-carrito')
const btnSumar = document.getElementById('btn-sumar')
const btnRestar = document.getElementById('btn-restar')
const btnQuitar = document.getElementById('btn-quitar')
const contadorP = document.getElementById('contador-principal')
const contadorS = document.getElementById('contador-secundario')
const carritoVacio = document.getElementById('carrito-vacio')

const userDataString = localStorage.getItem('userData')
const userName = localStorage.getItem('userName')
const nm = localStorage.getItem('nm')

const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const templateCategory = document.getElementById('template-category').content
const templateProductoCarrito = document.getElementById('template-producto-carrito').content
const templateFooterCarrito = document.getElementById('template-footer-carrito').content

const fragment = document.createDocumentFragment()

let carrito = {}
let routeProductosRecomendados = 'http://localhost:4000/api/producto/listar/recomendado'
let routeCategoriasActivas = 'http://localhost:4000/api/categoria/listar/ac'
let routeProductosPorCategoria = 'http://localhost:4000/api/producto/listar/categoria'

const fetchInitializer = async () => {
    try {
        const [productosData, categoriasData] = await Promise.all([
            fetchData(routeProductosRecomendados),
            fetchData(routeCategoriasActivas)
        ])

        pintarCards(productosData)
        pintarCategories(categoriasData)

        if(localStorage.getItem('carrito')) {
            carrito = JSON.parse(localStorage.getItem('carrito'))
            pintarCarrito()
            pintarProductoCarrito()
        }
        if(localStorage.getItem('uI') && localStorage.getItem('ps')) {
            loguinIndex.classList.toggle('sm:hidden')
            loguin.classList.toggle('hidden')
            botonOpcionesIndex.classList.toggle('sm:block')
            botonOpciones.classList.toggle('hidden')
            showCarrito.classList.toggle('right-20')
        }
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchInitializer()
    console.log("EL DOM se ha cargado completamente")
})

function menuUsuario() {
    svgAbrir.classList.toggle('hidden')
    svgCerrar.classList.toggle('hidden')
    mobileMenu.classList.toggle('hidden')
}
function menuUsuarioIndex() {
    svgAbrirIndex.classList.toggle('hidden')
    svgCerrarIndex.classList.toggle('hidden')
    opcionesIndex.classList.toggle('hidden')
}
function agregarAnimacion() {
    contadorP.classList.add('animate-bounce')
    contadorS.classList.add('animate-bounce')
    setTimeout(() => {
        contadorP.classList.remove('animate-bounce')
        contadorS.classList.remove('animate-bounce')
    }, 500)
}
function cerrarSesion() {
    localStorage.removeItem('uI')
    localStorage.removeItem('ps')
    localStorage.removeItem('nm')
    location.reload()
}

const fetchData = async (ruta) => {
    try {
        const res = await fetch(ruta)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click', e => {
    btnAccion(e)
})
productoCarrito.addEventListener('click', e => {
    btnAccion(e)
})
buttonCarrito.addEventListener('click', () => {
    showCarrito.classList.toggle('hidden')
})

const pintarCategories = data => {
    data.forEach(categoria => {
        
        const clone = templateCategory.cloneNode(true)
        const uElement = clone.querySelector('#category-name')

        uElement.textContent = categoria.nombre
        uElement.dataset.id = categoria.id_categoria

        uElement.addEventListener('click', async () => {
            cards.innerHTML = ''
            const categoriaId = uElement.dataset.id
            const productoCatData = await fetchData(routeProductosPorCategoria + `/${categoriaId}`)
            pintarCards(productoCatData)
        })

        fragment.appendChild(clone)
    })
    categorias.appendChild(fragment)
}
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h2').textContent = producto.nombre
        templateCard.querySelector('p').textContent = formatCurrency(producto.precio)
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('#button-card').dataset.id = producto.id_producto

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if(e.target.id === 'button-card') { 
        const templateDiv = e.target.closest('.relative')
        setCarrito(templateDiv)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('#button-card').dataset.id,
        title: objeto.querySelector('h2').textContent,
        precio: parseFloat(objeto.querySelector('p').textContent.replace(/[^\d.-]+/g, '')),
        cantidad: 1,
        img: objeto.querySelector('img').getAttribute('src')
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    
    carrito[producto.id] = {...producto}

    pintarCarrito()
    pintarProductoCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('.btn-trash').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
} 
const pintarProductoCarrito = () => {
    productoCarrito.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateProductoCarrito.querySelector('img').setAttribute("src", producto.img)
        templateProductoCarrito.querySelector('#title-card').textContent = producto.title
        templateProductoCarrito.querySelector('#cantidad-producto').textContent = producto.cantidad
        templateProductoCarrito.querySelector('#price-total').textContent = formatCurrency(producto.precio * producto.cantidad)
        templateProductoCarrito.querySelector('#sumar').dataset.id = producto.id
        templateProductoCarrito.querySelector('#restar').dataset.id = producto.id
        templateProductoCarrito.querySelector('#quitar').dataset.id = producto.id

        const clone = templateProductoCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    productoCarrito.appendChild(fragment)
    pintarFooterCarrito()
    
    localStorage.setItem('carrito', JSON.stringify(carrito))

    if(Object.keys(carrito).length === 0) {
        productoCarrito.classList.add('hidden')
        carritoVacio.classList.remove('hidden')
    } else {
        productoCarrito.classList.remove('hidden')
        carritoVacio.classList.add('hidden')
    }
}
const pintarFooterCarrito = () => {
    productoFooterCarrito.innerHTML = ''
    contadorP.innerHTML = ''
    contadorS.innerHTML = ''

    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)

    templateFooterCarrito.querySelector('#total-carrito').textContent = formatCurrency(nPrecio)
    contadorP.textContent = nCantidad
    contadorS.textContent = nCantidad

    const clone = templateFooterCarrito.cloneNode(true)
    fragment.appendChild(clone)
    productoFooterCarrito.appendChild(fragment)
}
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Comience a comprar!</th>
        `
        return 
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)    

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        pintarProductoCarrito()
    })
}

const btnAccion = e => {
    //Accion de aumentar
    if(e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarProductoCarrito()
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            // notificacionConfirmacion()
        }
        pintarProductoCarrito()
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-trash')) {
        const producto = carrito[e.target.dataset.id]
        delete carrito[producto.id]
        pintarCarrito()
        pintarProductoCarrito()
        // notificacionConfirmacion2()
    }
    e.stopPropagation()
}
// function notificacionConfirmacion() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Producto agregado al carrito',
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
//         title: 'Producto eliminado del carrito',
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
// function notificacionEliminacion() {
//     Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Producto eliminado del carrito',
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
// function search() {
//     var searchTerm = document.querySelector('.search-form input').value.trim()
//     if (searchTerm !== '') {
//         var url = 'http://localhost:8080/producto/buscar/' + encodeURIComponent(searchTerm);
    
//         fetch(url)
//           .then(response => response.json())
//           .then(data => {
//             cards.innerHTML = ''
//             pintarCards(data)
//             })
//           .catch(error => console.error(error))
//       }
    
//       return false
// }
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('es-PE', { style:'currency', currency:'PEN' })
    return formatter.format(amount)
}