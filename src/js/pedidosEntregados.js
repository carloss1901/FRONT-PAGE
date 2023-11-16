const userData = localStorage.getItem('uI')
const ps = localStorage.getItem('ps')

const templatePedido = document.getElementById('template-pedido').content
const templateProducto = document.getElementById('template-producto').content
const templatePedidoMobile = document.getElementById('template-pedido-mobile').content
const templateProductoMobile = document.getElementById('template-producto-mobile').content

const pedidos = document.getElementById('pedidos')
const pedidosMobile = document.getElementById('pedidos-mobile')

const contadorRealizados = document.getElementById('contador-p-realizados')
const contadorRealizadosM = document.getElementById('contador-p-realizados-m')
const contadorRecibidos = document.getElementById('contador-p-recibidos')
const contadorRecibidosM = document.getElementById('contador-p-recibidos-m')

const fragment = document.createDocumentFragment()

let routePedido = 'http://localhost:4000/api/pedido/listar/entregados'
let routeRealizadosCount = 'http://localhost:4000/api/pedido/listar/noentregados/count'
let routeRecibidosCount = 'http://localhost:4000/api/pedido/listar/recibidos/count'

document.addEventListener('DOMContentLoaded', function() {
  fetchInitializer()
  console.log("El DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
  try {
    const [pedidosData, realizadosCount, recibidosCount] = await Promise.all([
      fetchData(routePedido),
      fetchData(routeRealizadosCount),
      fetchData(routeRecibidosCount)
    ])

    pintarPedidos(pedidosData)
    pintarPedidosMobile(pedidosData)
    countRealizados(realizadosCount.count)
    countRecibidos(recibidosCount.count)

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
  data.forEach((pedido) => {
    const clone = templatePedido.cloneNode(true)

    clone.querySelector('#contador-pedido').textContent = pedido.id_pedido
    clone.querySelector('#fecha-pedido').textContent = pedido.fecha_pedido
    clone.querySelector('#nombres-cliente').textContent = pedido.usuario.nombres + ' ' + pedido.usuario.apellidos
    clone.querySelector('#dni-cliente').textContent = pedido.usuario.dni
    clone.querySelector('#direccion-cliente').textContent = pedido.usuario.direccion

    const detallesContenedor = clone.querySelector('#productos-pedido')
    let total = 0

    pedido.detalles.forEach(detalle => {
      const detalleClone = templateProducto.cloneNode(true)

      detalleClone.querySelector('#nombre-producto').textContent = detalle.producto.nombre
      detalleClone.querySelector('#cantidad-producto').textContent = detalle.cantidad
      detalleClone.querySelector('#precio-producto').textContent = detalle.precio.toFixed(2)
      detalleClone.querySelector('#total-precio-producto').textContent = (detalle.precio * detalle.cantidad).toFixed(2)

      total += (detalle.producto.precio * detalle.cantidad)

      detallesContenedor.appendChild(detalleClone)
    })
    clone.querySelector('#total-precio-pedido').textContent = total.toFixed(2)

    fragment.appendChild(clone)
  })
  pedidos.appendChild(fragment)
}

const pintarPedidosMobile = data => {
  data.forEach((pedido) => {
    const clone = templatePedidoMobile.cloneNode(true)

    clone.querySelector('#contador-mobile').textContent = pedido.id_pedido
    clone.querySelector('#fecha-pedido').textContent = pedido.fecha_pedido
    clone.querySelector('#nombres-cliente').textContent = pedido.usuario.nombres + ' ' + pedido.usuario.apellidos
    clone.querySelector('#dni-cliente').textContent = pedido.usuario.dni
    clone.querySelector('#direccion-cliente').textContent = pedido.usuario.direccion

    const detallesContenedor = clone.querySelector('#productos-mobile')
    let total = 0

    pedido.detalles.forEach(detalle => {
      const detalleClone = templateProductoMobile.cloneNode(true)

      detalleClone.querySelector('#nombre-mobile').textContent = detalle.producto.nombre
      detalleClone.querySelector('#cantidad-mobile').textContent = detalle.cantidad
      detalleClone.querySelector('#precio-mobile').textContent = detalle.precio.toFixed(2)
      detalleClone.querySelector('#total-mobile').textContent = (detalle.precio * detalle.cantidad).toFixed(2)

      total += (detalle.producto.precio * detalle.cantidad)

      detallesContenedor.appendChild(detalleClone)
    })
    clone.querySelector('#precio-total-mobile').textContent = total.toFixed(2)

    fragment.appendChild(clone)
  })
  pedidosMobile.appendChild(fragment)
}

const countRealizados = async (dato) => {
  try {
    contadorRealizados.innerHTML = ''
    contadorRealizadosM.innerHTML = ''
    contadorRealizados.textContent = dato
    contadorRealizadosM.textContent = dato
  } catch (error) {
    console.error(error)
  }
}
const countRecibidos = async (dato) => {
  try {
    contadorRecibidos.innerHTML = ''
    contadorRecibidosM.innerHTML = ''
    contadorRecibidos.textContent = dato
    contadorRecibidosM.textContent = dato
  } catch (error) {
    console.error(error)
  }
}