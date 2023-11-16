const userData = localStorage.getItem('uI')
const ps = localStorage.getItem('ps')
const nm = localStorage.getItem('nm')

const templatePedido = document.getElementById('template-pedido').content
const templatePedidoMobile = document.getElementById('template-pedido-mobile').content
const templateProductoPedido = document.getElementById('template-producto').content
const templateProductoPedidoMobile = document.getElementById('template-producto-mobile').content

const productosPedido = document.getElementById('productos-pedidos')

const pedido = document.getElementById('pedido')
const pedidoMobile = document.getElementById('pedido-mobile')

const botonOpciones = document.getElementById('botonOpciones')
const opcionesIndex = document.getElementById('opcionesIndex')
const svgAbrir = document.getElementById('svgAbrir')
const svgCerrar = document.getElementById('svgCerrar')

const fragment = document.createDocumentFragment()

let routePedido = 'http://localhost:4000/api/pedido/listar/usuario/'

document.addEventListener('DOMContentLoaded', function() {
  fetchInitializer()
  console.log("EL DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
  try {
    const [pedidosData] = await Promise.all([
      fetchData(routePedido + `${userData}`)
    ])

    pintarPedidos(pedidosData)
    pintarPedidosMobile(pedidosData)
  } catch (error) {
    console.log(error)
  }
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
const pintarPedidos = data => {
  data.forEach((pedido, index) => {
    const clone = templatePedido.cloneNode(true)

    clone.querySelector('#fecha-pedido').textContent = pedido.fecha_pedido
    clone.querySelector('#contador-pedido').textContent = data.length - index
    const detallesContenedor = clone.querySelector('#productos-pedido')
    
    let total = 0

    pedido.detalles.forEach(detalle => {
      const detalleClone = templateProductoPedido.cloneNode(true)

      detalleClone.querySelector('#nombre-producto').textContent = detalle.producto.nombre
      detalleClone.querySelector('#cantidad-producto').textContent = detalle.cantidad
      detalleClone.querySelector('#precio-producto').textContent = detalle.precio.toFixed(2)
      detalleClone.querySelector('#total-precio-producto').textContent = (detalle.precio * detalle.cantidad).toFixed(2)

      total += (detalle.producto.precio * detalle.cantidad)
      
      detallesContenedor.appendChild(detalleClone)
    })
    clone.querySelector('#total-precio-pedido').textContent = total.toFixed(2)

    estadoPedido(pedido.estado, clone)

    fragment.appendChild(clone)
  })
  pedido.appendChild(fragment)
}
const pintarPedidosMobile = data => {
    data.forEach((pedido, index) => {
      const clone = templatePedidoMobile.cloneNode(true)

      clone.querySelector('#fecha-mobile').textContent = pedido.fecha_pedido
      clone.querySelector('#contador-mobile').textContent = data.length - index
      const detalleMobile = clone.querySelector('#productos-mobile')

      let total = 0

      pedido.detalles.forEach(detalle => {
        const detalleClone = templateProductoPedidoMobile.cloneNode(true)

        detalleClone.querySelector('#nombre-mobile').textContent = detalle.producto.nombre
        detalleClone.querySelector('#cantidad-mobile').textContent = detalle.cantidad
        detalleClone.querySelector('#precio-mobile').textContent = detalle.precio.toFixed(2)
        detalleClone.querySelector('#total-mobile').textContent = (detalle.precio * detalle.cantidad).toFixed(2)

        total += (detalle.producto.precio * detalle.cantidad)
        detalleMobile.appendChild(detalleClone)
      })
      clone.querySelector('#precio-total-mobile').textContent = total.toFixed(2)

      estadoPedido(pedido.estado, clone)
      
      fragment.appendChild(clone)
    })
    pedidoMobile.appendChild(fragment)
}
function estadoPedido(estado, clone) {
  const porEntregar = clone.querySelector('#por-entregar')
  const alistando = clone.querySelector('#alistando')
  const entregado = clone.querySelector('#entregado')

  if(estado === 0) { porEntregar.classList.remove('hidden') }
  else if(estado === 1) { alistando.classList.remove('hidden') }
  else { entregado.classList.remove('hidden') }
}

function menuUsuario() {
  svgAbrir.classList.toggle('hidden')
  svgCerrar.classList.toggle('hidden')
  opcionesIndex.classList.toggle('hidden')
}
function cerrarSesion() {
  localStorage.removeItem('uI')
  localStorage.removeItem('ps')
  localStorage.removeItem('nm')
  irCatalogo()
}
function irCatalogo() {
  window.location.href = "../../../index.html"
}