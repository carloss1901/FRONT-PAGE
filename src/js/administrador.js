const userDataA = localStorage.getItem('uI')
const ps = localStorage.getItem('ps')

const templatePedidos = document.getElementById('template-pedido').content
const templateProducto = document.getElementById('template-producto').content
const templatePedidosMobile = document.getElementById('template-pedido-mobile').content
const templateProductoMobile = document.getElementById('template-producto-mobile').content

const pedidos = document.getElementById('pedidos')
const pedidosMobile = document.getElementById('pedidos-mobile')
const contadorRealizados = document.getElementById('contador-p-realizados')
const contadorRealizadosM = document.getElementById('contador-p-realizados-m')
const contadorRecibidos = document.getElementById('contador-p-recibidos')
const contadorRecibidosM = document.getElementById('contador-p-recibidos-m')

const fragment = document.createDocumentFragment()

let routePedido = 'http://localhost:4000/api/pedido/listar/noentregados'
let routePedidoRecibido = 'http://localhost:4000/api/pedido/recibir/'
let routeRecibidosCount = 'http://localhost:4000/api/pedido/listar/recibidos/count'

document.addEventListener('DOMContentLoaded', function() {
  fetchInitializer()
  console.log("El DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
  try {
    const [pedidosData, contadorRecibidos] = await Promise.all([
      fetchData(routePedido),
      fetchData(routeRecibidosCount)
    ])

    pintarPedidos(pedidosData)
    pintarPedidosMobile(pedidosData)
    countRecibidos(contadorRecibidos.count)
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
  contadorRealizados.innerHTML = ''

  if(data.length === 0) { contadorRealizados.textContent = '0' }
  else { contadorRealizados.textContent = data.length }

  data.forEach((pedido) => {
    const clone = templatePedidos.cloneNode(true)

    clone.querySelector('#contador-pedido').textContent = pedido.id_pedido
    clone.querySelector('#fecha-pedido').textContent = pedido.fecha_pedido
    clone.querySelector('#nombres-cliente').textContent = pedido.usuario.nombres + ' ' + pedido.usuario.apellidos
    clone.querySelector('#dni-cliente').textContent = pedido.usuario.dni
    clone.querySelector('#direccion-cliente').textContent = pedido.usuario.direccion

    const detallesContenedor = clone.querySelector('#productos-pedido')
    const botonRecibido = clone.querySelector('#button-recibido')
    
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

    botonRecibido.addEventListener('click', () => {
      confirmarPedidoRecibido(pedido.id_pedido)
    })

    fragment.appendChild(clone)
  })
  pedidos.appendChild(fragment)
}
const pintarPedidosMobile = data => {
  contadorRealizadosM.innerHTML = ''

  if(data.length === 0) { contadorRealizadosM.textContent = '0' }
  else { contadorRealizadosM.textContent = data.length }

  data.forEach((pedido) => {
    const clone = templatePedidosMobile.cloneNode(true)

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

function confirmarPedidoRecibido(pedidoId) {
  Swal.fire({
    icon: 'info',
    title: 'Pedido Recibido',
    text: '¿Quieres marcar el pedido como recibido?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if(result.isConfirmed) {
      fetch(routePedidoRecibido + `${pedidoId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Pedido Recibido', 'El pedido ha sido marcado como recibido.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al marcar el pedido como recibido.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      })
    }
  })
}

function notificacionConfirmacion(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar'
  }).then((result) => {
    if(result.isConfirmed) {
      location.reload()
    }
  })
}
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

function irCatalogo() {
  window.location.href = "../../../index.html"
}