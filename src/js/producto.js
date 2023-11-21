const userData = localStorage.getItem('userData') 
const ps = localStorage.getItem('ps')

const body = document.getElementById('body')
const datosProducto = document.getElementById('datos-producto')

const botonActualizar = document.getElementById('boton-actualizar')
const botonAgregar = document.getElementById('boton-agregar')

const dialogActualizar = document.getElementById('dialog-actualizar')
const dialogAgregar = document.getElementById('dialog-agregar')

const nombreProducto = document.getElementById('nombre-producto')
const precioProducto = document.getElementById('precio-producto')
const stockProducto = document.getElementById('stock-producto')
const recomendadoProducto = document.getElementById('recomendado-producto')
const imagenProducto = document.getElementById('imagen-producto')
const categoriasProducto = document.getElementById('nombre-categoria')

const nombreProductoAc = document.getElementById('nombre-producto-ac')
const precioProductoAc = document.getElementById('precio-producto-ac')
const stockProductoAc = document.getElementById('stock-producto-ac')
const estadoProductoAc = document.getElementById('estado-producto-ac')
const recomendadoProductoAc = document.getElementById('recomendado-producto-ac')
const imagenProductoAc = document.getElementById('imagen-producto-ac')
const categorias = document.getElementById('nombre-categoria-ac')

const templateProductos = document.getElementById('template-productos').content
const templateCategorias = document.getElementById('template-categorias').content

const fragment = document.createDocumentFragment()

let routeProductos = 'http://localhost:4000/api/producto/listar'
let routeCategorias = 'http://localhost:4000/api/categoria/listar/ac'
let routeActivarProd = 'http://localhost:4000/api/producto/activar/'
let routeDesactivarProd = 'http://localhost:4000/api/producto/desactivar/'
let routeAgregarProd = 'http://localhost:4000/api/producto/registrar'
let routeActualizarProd = 'http://localhost:4000/api/producto/editar/'

document.addEventListener('DOMContentLoaded', function() {
  fetchInitializer()

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') {
      body.classList.remove('blur')
    }
  })
  valorCeroPrecio(precioProductoAc)
  valorCeroStock(stockProductoAc)
  valorCeroPrecioAg(precioProducto)
  valorStockAg(stockProducto)

  console.log("EL DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
  try {
    const [productosData, categoriasData] = await Promise.all([
      fetchData(routeProductos),
      fetchData(routeCategorias)
    ])
    
    pintarProductos(productosData)
    pintarCategorias(categoriasData)
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

const pintarCategorias = data => {
  categorias.innerHTML = ''
  categoriasProducto.innerHTML = ''

  data.forEach(categoria => {
    const clone = templateCategorias.cloneNode(true).querySelector('option')

    clone.textContent = categoria.nombre
    clone.value = categoria.id_categoria

    const clone2 = clone.cloneNode(true)

    fragment.appendChild(clone)
    categoriasProducto.appendChild(clone2)
  })
  categorias.appendChild(fragment)
}
const pintarProductos = data => {
  datosProducto.innerHTML = ''

  data.forEach(producto => {
    const clone = templateProductos.cloneNode(true)

    clone.querySelector('#id-producto').textContent = producto.id_producto
    clone.querySelector('#nombre-producto').textContent = producto.nombre
    clone.querySelector('#precio-producto').textContent = producto.precio.toFixed(2)
    clone.querySelector('#stock-producto').textContent = producto.stock
    clone.querySelector('#nombre-categoria').textContent = producto.categoria.nombre

    estadoVigencia(producto, clone, producto.id_producto)
    estadoRecomendado(producto, clone)

    const botonEditar = clone.querySelector('#editar-producto')

    botonEditar.addEventListener('click', () => {
      mostrarDialogActualizar(producto)
    })

    fragment.appendChild(clone)
  })
  datosProducto.appendChild(fragment)
}

const estadoVigencia = (producto, clone, id) => {
  const spanActivo = clone.querySelector('#activo')
  const spanInactivo = clone.querySelector('#inactivo')
  const botonActivar = clone.querySelector('#boton-activar')
  const botonDesactivar = clone.querySelector('#boton-desactivar')

  botonActivar.addEventListener('click', () => {
    activarProducto(id)
  })
  botonDesactivar.addEventListener('click', () => {
    desactivarProducto(id)
  })

  if(producto.vigencia === false) {
    spanActivo.classList.add('hidden')
    spanInactivo.classList.remove('hidden')
    botonDesactivar.classList.add('hidden')
    botonActivar.classList.remove('hidden')
  }
}
const estadoRecomendado = (producto, clone) => {
  const spanRecomendado = clone.querySelector('#recomendado')
  const spanNoR = clone.querySelector('#no-r')
  
  if(producto.recomendado === false) {
    spanRecomendado.classList.add('hidden')
    spanNoR.classList.remove('hidden')
  }
}

function desactivarProducto(productoId) {
  Swal.fire({
    icon: 'info',
    title: 'Desactivar Producto',
    text: '¿Quieres desactivar el producto?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      fetch(routeDesactivarProd + `${productoId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Producto Desactivado', 'El producto ha sido desactivado.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al desactivar el producto.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      }) 
    }
  })
}
function activarProducto(productoId) {
  Swal.fire({
    icon: 'info',
    title: 'Activar Producto',
    text: '¿Quieres activar el producto?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      fetch(routeActivarProd + `${productoId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Producto Activado', 'El producto ha sido activado.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al activar el producto.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      })
    }
  })
}

function mostrarDialogActualizar(producto) {
  dialogActualizar.showModal()
  body.classList.add('blur')  

  nombreProductoAc.value = producto.nombre
  precioProductoAc.value = producto.precio.toFixed(2)
  stockProductoAc.value = producto.stock
  estadoProductoAc.value = producto.vigencia ? 'si' : 'no'
  recomendadoProductoAc.value = producto.recomendado ? 'si' : 'no'
  imagenProductoAc.value = producto.imagen
  categorias.value = producto.categoria.id_categoria

  if(producto.vigencia) {
    estadoProductoAc.classList.remove('text-rose-200')
    estadoProductoAc.classList.add('text-green-200')
  } else {
    estadoProductoAc.classList.remove('text-green-200')
    estadoProductoAc.classList.add('text-rose-200')
  }

  var nuevoNombre = nombreProductoAc.value
  var nuevoPrecio = parseFloat(precioProductoAc.value)
  var nuevoStock = parseInt(stockProductoAc.value)
  var nuevaImagen = imagenProductoAc.value
  var nuevoRecomendado = recomendadoProductoAc.value
  var nuevaCategoria = parseInt(categorias.value)

  nombreProductoAc.addEventListener('input', function(event) {
    nuevoNombre = event.target.value
  })
  precioProductoAc.addEventListener('input', function(event) {
    nuevoPrecio = parseFloat(event.target.value)
  })
  stockProductoAc.addEventListener('input', function(event) {
    nuevoStock = parseInt(event.target.value)
  })
  recomendadoProductoAc.addEventListener('change', function(event) {
    nuevoRecomendado = event.target.value === 'si' ? true : false
  })
  imagenProductoAc.addEventListener('input', function(event) {
    nuevaImagen = event.target.value
  })
  categorias.addEventListener('change', function(event) {
    nuevaCategoria = parseInt(event.target.value)
  })

  botonActualizar.addEventListener('click', () => {
    let nombreVacio = nuevoNombre.trim() === ''
    let imagenVacia = nuevaImagen.trim() === ''

    if(nombreVacio && imagenVacia) {
      errorInput(nombreProductoAc)
      errorInput(imagenProductoAc)
      return
    }
    if (nombreVacio) {
      errorInput(nombreProductoAc)
      return
    }
    if (imagenVacia) {
      errorInput(imagenProductoAc)
      return
    }

    cerrarDialogActualizar()
    actualizarProducto(producto.id_producto, nuevoNombre, nuevoPrecio, nuevoStock, nuevaImagen, nuevoRecomendado, nuevaCategoria)
  })
}
function errorInput(inputElement) {
  inputElement.classList.add('border-rose-500')
  inputElement.classList.add('placeholder-red-200')
  inputElement.placeholder = 'Campo requerido !!!'
}
function limpiarEstiloActualizar() {
  const elements = document.querySelectorAll('#dialog-actualizar input, #dialog-actualizar textarea')
  
  elements.forEach((elemento) => {
    elemento.classList.remove('border-rose-500')
    elemento.classList.remove('placeholder-red-200')
    elemento.placeholder = ''
  })
}
function cerrarDialogActualizar() {
  limpiarEstiloActualizar()
  dialogActualizar.close()
  body.classList.remove('blur')
}
function actualizarProducto(id, nuevoNombre, nuevoPrecio, nuevoStock, nuevaImagen, nuevoRecomendado, nuevaCategoria) {
  Swal.fire({
    icon: 'info',
    title: 'Actualizar Producto',
    text: '¿Quieres actualizar el producto?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      const formData = {
        nombre: nuevoNombre,
        precio: nuevoPrecio,
        stock: nuevoStock,
        imagen: nuevaImagen,
        recomendado: nuevoRecomendado,
        categoria_id: nuevaCategoria
      }
      
      fetch(routeActualizarProd + `${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Producto Actualizado', 'El producto ha sido actualizado.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al actualizar el producto.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      })
    }
  })
}

function mostrarDialogAgregar() {
  dialogAgregar.showModal()
  body.classList.add('blur')
  precioProducto.value = '0.00'
  stockProducto.value = '0'

  let nuevoPrecio = parseFloat(precioProducto.value)
  let nuevoStock = parseInt(stockProducto.value)
  let nuevoRecomendado = recomendadoProducto.value
  const categoriaProd = parseInt(categoriasProducto.value)

  precioProducto.addEventListener('input', function() {
    nuevoPrecio = parseFloat(this.value)
  })
  stockProducto.addEventListener('input', function() {
    nuevoStock = parseInt(this.value)
  })
  recomendadoProducto.addEventListener('change', function() {
    nuevoRecomendado = this.value === 'si' ? true : false
  })

  botonAgregar.addEventListener('click', () => {
  const nombreProd = nombreProducto.value
  const imagenProd = imagenProducto.value

    if(nombreProd === '' && imagenProd === '') {
      errorInput(nombreProducto)
      errorInput(imagenProducto)
      return
    }
    if(nombreProd === '') {
      errorInput(nombreProducto)
      return
    }
    if(imagenProd === '') {
      errorInput(imagenProducto)
      return
    }

    cerrarDialogAgregar()
    agregarProducto(nombreProd, nuevoPrecio, nuevoStock, nuevoRecomendado, imagenProd, categoriaProd)
  })
}
function cerrarDialogAgregar() {
  limpiarEstilo()
  dialogAgregar.close()
  body.classList.remove('blur')
}
function limpiarEstilo() {
  const elements = document.querySelectorAll('#dialog-agregar input, #dialog-agregar textarea')

  elements.forEach((elemento) => {
    elemento.classList.remove('border-rose-500')
    elemento.classList.remove('placeholder-red-200')
    elemento.placeholder = ''
  })

  nombreProducto.value = ''
  imagenProducto.value = ''
  precioProducto.value = '0.00'
  stockProducto.value = '0'
}
function agregarProducto(nombreA, precioA, stockA, recomendadoA, imagenA, categoria) {
  Swal.fire({
    icon: 'info',
    title: 'Agregar Producto',
    text: '¿Quieres agregar el producto?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      const formData = {
        nombre: nombreA,
        precio: precioA,
        stock: stockA,
        vigencia: true,
        recomendado: recomendadoA,
        imagen: imagenA,
        categoria_id: categoria
      }
      
      fetch(routeAgregarProd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Producto Agregado', 'El producto ha sido agregado.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al agregar el producto.') }
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
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'swal-popup',
      confirmButton: 'btn btn-success'
    },
    allowOutsideClick: false
  }).then((result) => {
    if(result.isConfirmed) {
      location.reload()
    }
  })
}

function valorCeroPrecioAg(input) {
  input.addEventListener('focus', function() {
    if(this.value === '0.00') {
      this.value = ''
    }
  })
  input.addEventListener('blur', function() {
    if(this.value.trim() === '') {
      this.value = '0.00';
    }
  })
  input.addEventListener('input', function() {
    if(this.value.trim() === '') {
      this.value = '0.00'
    }
  })
}
function valorStockAg(input) {
  input.addEventListener('focus', function() {
    if(this.value === '0') {
      this.value = ''
    }
  })
  input.addEventListener('blur', function() {
    if(this.value.trim() === '') {
      this.value = '0'
    }
  })
  input.addEventListener('input', function() {
    if(this.value.trim() === '') {
      this.value = '0'
    }
  })
}

function valorCeroStock(input) {
  input.addEventListener('focus', function() {
    if(this.value === '0') {
      this.value = ''
    }
  })
  input.addEventListener('blur', function() {
    if(this.value.trim() === '') {
      this.value = '0'
    }
  })
  input.addEventListener('input', function() {
    if(this.value.trim() === '') {
      this.value = '0'
    }
  })
}
function valorCeroPrecio(input) {
  input.addEventListener('focus', function() {
    if(this.value === '0.00') {
      this.value = ''
    }
  })
  input.addEventListener('blur', function() {
    if(this.value.trim() === '') {
      this.value = '0.00';
    }
  })
  input.addEventListener('input', function() {
    if(this.value.trim() === '') {
      this.value = '0.00'
    }
  })
}
function volver() {
  window.history.back()
}