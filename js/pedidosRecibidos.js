const pedidosContainer = document.getElementById('pedidosContainer')
const userData = localStorage.getItem('userData')
const ps = localStorage.getItem('ps')
const contadorRealizados = document.getElementById('contador-pedidos-realizados')
const contadorRecibidos = document.getElementById('contador-pedidos-recibidos')

contadorPedidosRealizados()
  .then(contador => {
    const contadorElement = contadorRealizados
    contadorElement.textContent = contador
  })
  .catch(error => {
    console.error("Error al obtener el contador de pedidos realizados:",error)
  })
contadorPedidosRecibidos()
  .then(contador => {
    const contadorElement = contadorRecibidos
    contadorElement.textContent = contador
  })
  .catch(error => {
    console.error("Error al obtener el contador de pedidos recibidos:",error)
  })

buscarUsuario(userData)
  .then(username => {
    const c = desencriptar(ps)
    const headers = new Headers()
    headers.append('Authorization','Basic ' + btoa(username + ":" + c))
    fetch('http://localhost:8080/pedido/listar/recibidos', {
      method: 'GET',
      headers: headers
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(pedido => {
          const pedidoItem = document.createElement('div')
          pedidoItem.classList.add('pedido-item')
          
          const botonesContainer = document.createElement('div')
          botonesContainer.classList.add('botones-container')
          
          const boton1 = document.createElement('button')
          boton1.textContent = 'Entregado'
          boton1.addEventListener('click', () => {
              pedidoEntregado(pedido.id_pedido)
          })

          botonesContainer.appendChild(boton1)
          pedidoItem.appendChild(botonesContainer)

          const pedidoNumero = document.createElement('h2')
          pedidoNumero.textContent = `Pedido #${pedido.id_pedido}`
          pedidoItem.appendChild(pedidoNumero)

          const fechaPedido = document.createElement('h5')
          fechaPedido.classList.add('fecha-pedido')
          fechaPedido.textContent = `Fecha: ${pedido.fechaPedido}`
          pedidoItem.appendChild(fechaPedido)

          const clienteNombre = document.createElement('h5')
          clienteNombre.textContent = `Cliente: ${pedido.usuario.nombres} ${pedido.usuario.apellidos}`
          pedidoItem.appendChild(clienteNombre)

          const clienteDni = document.createElement('h5')
          clienteDni.textContent = `DNI: ${pedido.usuario.dni}`
          pedidoItem.appendChild(clienteDni)
          
          const clienteDireccion = document.createElement('h5')
          clienteDireccion.textContent = `Dirección: ${pedido.usuario.direccion}`
          pedidoItem.appendChild(clienteDireccion)

          const productoContainer = document.createElement('div')
          productoContainer.classList.add('productos')
          pedidoItem.appendChild(productoContainer)

          const tablaProductos = document.createElement('table')
          const thead = document.createElement('thead')
          const tbody = document.createElement('tbody')
          tablaProductos.appendChild(thead)
          tablaProductos.appendChild(tbody)
          productoContainer.appendChild(tablaProductos)

          const encabezadosRow = document.createElement('tr')

          const encabezadoProducto = document.createElement('th')
          encabezadoProducto.textContent = 'PRODUCTO'
          encabezadosRow.appendChild(encabezadoProducto)

          const encabezadoCantidad = document.createElement('th')
          encabezadoCantidad.textContent = 'CANTIDAD'
          encabezadosRow.appendChild(encabezadoCantidad)

          const encabezadoPrecio = document.createElement('th')
          encabezadoPrecio.textContent = 'PRECIO UNIT.'
          encabezadosRow.appendChild(encabezadoPrecio)

          const encabezadoSubtotal = document.createElement('th')
          encabezadoSubtotal.textContent = 'TOTAL'
          encabezadosRow.appendChild(encabezadoSubtotal)

          thead.appendChild(encabezadosRow)

          const detalles = pedido.detalles
          detalles.forEach(detalle => {
              const filaProducto = document.createElement('tr')

              const nombreProducto = document.createElement('td')
              const cantidadProducto = document.createElement('td')
              const precioProducto = document.createElement('td')
              const subtotalProducto = document.createElement('td')

              cantidadProducto.classList.add('centrado')
              precioProducto.classList.add('derecha')
              subtotalProducto.classList.add('derecha')

              nombreProducto.textContent = detalle.producto.nombre
              cantidadProducto.textContent = detalle.cantidad
              precioProducto.textContent = `${detalle.precio.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}`
              subtotalProducto.textContent = `${((detalle.cantidad * detalle.producto.precio).toLocaleString("es-PE", { style: "currency", currency: "PEN" }))}`

              filaProducto.appendChild(nombreProducto)
              filaProducto.appendChild(cantidadProducto)
              filaProducto.appendChild(precioProducto)
              filaProducto.appendChild(subtotalProducto)
              tbody.appendChild(filaProducto)
          })

          const total = pedido.detalles.reduce((acc, detalle) => acc + (detalle.cantidad * detalle.producto.precio), 0)

          const filaTotal = document.createElement('tr')
          const celdaTotal = document.createElement('td')
          const celdaVacia = document.createElement('td')

          celdaVacia.setAttribute('colspan','3')
          celdaVacia.textContent = 'Costo total: '
          celdaVacia.classList.add('vacia')

          celdaTotal.textContent = `${total.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}`
          celdaTotal.classList.add('fila-total')
          filaTotal.appendChild(celdaVacia)
          filaTotal.appendChild(celdaTotal)
          tbody.appendChild(filaTotal)

          pedidosContainer.appendChild(pedidoItem)
        })
      })
      .catch(error => {
        console.error("Error:",error)
      })
  })

function pedidoEntregado(pedidoId) {
    Swal.fire({
      icon: 'info',
      title: 'Pedido Entregado',
      text: '¿Quiere marcar el pedido como entregado?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        buscarUsuario(userData)
          .then(username => {
            const c = desencriptar(ps)
            const headers = new Headers()
            headers.append('Authorization','Basic ' + btoa(username + ":" + c))
            fetch(`http://localhost:8080/pedido/entregado/${pedidoId}`, {
              method: 'DELETE',
              headers: headers
            })
            .then(response => {
              if (response.ok) {
                notificacionConfirmacion('success', 'Pedido Entregado', 'El pedido ha sido marcado como entregado.')
              } else {
                notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al marcar el pedido como entregado.')
              }
            })
            .catch(error => {
              notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al marcar el pedido como entregado.')
              console.error(error)
            })
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
function contadorPedidosRecibidos() {
  return new Promise((resolve, reject) => {
    buscarUsuario(userData)
      .then(username => {
        const c = desencriptar(ps)
        const headers = new Headers()
        headers.append('Authorization','Basic ' + btoa(username + ':' + c))
        fetch("http://localhost:8080/pedido/listar/recibidos", {
          method: 'GET',
          headers: headers
        })
        .then(response => response.json())
        .then(data => {
          const contador = data.length
          resolve(contador)
        })
        .catch(error => {
          console.error("Error al obtener los pedidos realizados:",error)
          reject(error)
        })
      })
  })
  .catch(error => {
    reject(error)
  })
}
function contadorPedidosRealizados() {
  return new Promise((resolve, reject) => {
    buscarUsuario(userData)
      .then(username => {
        const c = desencriptar(ps)
        const headers = new Headers()
        headers.append('Authorization','Basic ' + btoa(username + ':' + c))
        fetch("http://localhost:8080/pedido/listar/noentregados", {
          method: 'GET',
          headers: headers
        })
        .then(response => response.json())
        .then(data => {
          const contador = data.length
          resolve(contador)
        })
        .catch(error => {
          console.error("Error al obtener los pedidos realizados: ",error)
          reject(error)
        })
      })
  })
  .catch(error => {
    reject(error)
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
function buscarUsuario(userId) {
  return fetch(`http://localhost:8080/usuario/id/${userId}`)
  .then(response => response.json())
  .then(user => {
    if(user && user.username) {
      return user.username
    } else {
      throw new Error('No se encontró el nombre de usuario')
    }
  })
  .catch(error => {
    console.error('Error al obtener los datos del usuario: ', error)
    throw error
  })
}