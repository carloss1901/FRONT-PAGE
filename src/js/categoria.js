const body = document.getElementById('body')
const datosCategoria = document.getElementById('datos-categoria')

const dialogActualizar = document.getElementById('dialog-actualizar')
const dialogAgregar = document.getElementById('dialog-agregar')

const botonActualizar = document.getElementById('boton-actualizar')
const botonAgregar = document.getElementById('boton-agregar')

const nombreCategoria = document.getElementById('nombre-categoria')
const nombreCategoriaAc = document.getElementById('nombre-categoria-ac')
const estadoCategoriaAc = document.getElementById('estado-categoria-ac')

const templateCategorias = document.getElementById('template-categorias').content

const fragment = document.createDocumentFragment()

let routeCategorias = 'http://localhost:4000/api/categoria/listar'
let routeDesactivarCat = 'http://localhost:4000/api/categoria/desactivar/'
let routeActivarCat = 'http://localhost:4000/api/categoria/activar/'
let routeAgregarCat = 'http://localhost:4000/api/categoria/registrar'
let routeActualizarCat = 'http://localhost:4000/api/categoria/editar/'

document.addEventListener('DOMContentLoaded', function() {
  fetchInitializer()
  console.log("EL DOM se ha cargado completamente")
})

const fetchInitializer = async () => {
  try {
    const [categoriasData] = await Promise.all([
      fetchData(routeCategorias)
    ])
    
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
  datosCategoria.innerHTML = ''

  data.forEach(categoria => {
    const clone = templateCategorias.cloneNode(true)

    clone.querySelector('#id-categoria').textContent = categoria.id_categoria
    clone.querySelector('#nombre-categoria').textContent = categoria.nombre
    clone.querySelector('#boton-activar').dataset.id = categoria.id_categoria
    clone.querySelector('#boton-desactivar').dataset.id = categoria.id_categoria

    const spanActivo = clone.querySelector('#activo')
    const spanInactivo = clone.querySelector('#inactivo')
    const botonActivar = clone.querySelector('#boton-activar')
    const botonDesactivar = clone.querySelector('#boton-desactivar')
    const botonEditar = clone.querySelector('#editar-categoria')

    if(categoria.vigencia === false) {
      spanActivo.classList.add('hidden')
      spanInactivo.classList.remove('hidden')
      botonDesactivar.classList.add('hidden')
      botonActivar.classList.remove('hidden')
    }

    botonActivar.addEventListener('click', () => {
      activarCategoria(categoria.id_categoria)
    })
    botonDesactivar.addEventListener('click', () => {
      desactivarCategoria(categoria.id_categoria)
    })
    botonEditar.addEventListener('click', () => {
      mostrarDialogActualizar(categoria)
    })

    fragment.appendChild(clone)
  })
  datosCategoria.appendChild(fragment)
}

function agregarCategoria(nombreCat) {
  Swal.fire({
    icon: 'info',
    title: 'Agregar Categoría',
    text: '¿Quieres agregar la categoría?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      const formData = {
        nombre: nombreCat,
        vigencia: true
      }

      fetch(routeAgregarCat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Categoría Agregada', 'La categoría ha sido agregada.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al agregar la categoría.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      })
    }
  })
}
function actualizarCategoria(categoria, nuevoNombre) {
  Swal.fire({
    icon: 'info',
    title: 'Actualizar Categoría',
    text: '¿Quieres actualizar la categoría?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      const formData = {
        nombre: nuevoNombre
      }
      
      fetch(routeActualizarCat + `${categoria.id_categoria}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Categoría Actualizada', 'La categoría ha sido actualizada.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al actualizar la categoría.') }
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
  

  botonAgregar.addEventListener('click', () => {
    const nombreCat = nombreCategoria.value
    if(nombreCat === '') {
      errorInputAgregar()
      return 
    }
    cerrarDialogAgregar()
    agregarCategoria(nombreCat)
  })
}
function cerrarDialogAgregar() {
  limpiarEstilosAgregar()
  dialogAgregar.close()
  body.classList.remove('blur')
}

function mostrarDialogActualizar(categoria) {
  dialogActualizar.showModal()
  body.classList.add('blur')
  
  nombreCategoriaAc.value = categoria.nombre
  estadoCategoriaAc.value = categoria.vigencia ? 'si' : 'no'

  if(categoria.vigencia) { 
    estadoCategoriaAc.classList.remove('text-rose-200')
    estadoCategoriaAc.classList.add('text-green-200') 
  }
  else { 
    estadoCategoriaAc.classList.remove('text-green-200')
    estadoCategoriaAc.classList.add('text-rose-200') 
  }

  var nuevoNombre = nombreCategoriaAc.value

  nombreCategoriaAc.addEventListener('input', function(event) {
    nuevoNombre = event.target.value
  })

  botonActualizar.addEventListener('click', () => {
    if(nuevoNombre.trim() === '') {
      errorInputActualizar()
      return
    }
    cerrarDialog()
    actualizarCategoria(categoria, nuevoNombre)
  })
}
function cerrarDialog() {
  limpiarEstilosActualizar()
  dialogActualizar.close()
  body.classList.remove('blur')
}

function errorInputActualizar() {
  nombreCategoriaAc.classList.add('border-rose-500')
  nombreCategoriaAc.classList.add('placeholder-red-200')
  nombreCategoriaAc.placeholder = 'Campo requerido !!!'
}
function limpiarEstilosActualizar() {
  nombreCategoriaAc.classList.remove('border-rose-500')
  nombreCategoriaAc.placeholder = ''
}

function errorInputAgregar() {
  nombreCategoria.classList.add('border-rose-500')
  nombreCategoria.classList.add('placeholder-red-200')
  nombreCategoria.placeholder = 'Campo requerido !!!'
}
function limpiarEstilosAgregar() {
  nombreCategoria.classList.remove('border-rose-500')
  nombreCategoria.placeholder = ''
}

function desactivarCategoria(categoriaId) {
  Swal.fire({
    icon: 'info',
    title: 'Desactivar Categoría',
    text: '¿Quieres desactivar la categoría?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      fetch(routeDesactivarCat + `${categoriaId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Categoría Desactivada', 'La categoría ha sido desactivada.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al desactivar la categoría.') }
      })
      .catch(error => {
        notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error.')
        console.error(error)
      })
    }
  })
}
function activarCategoria(categoriaId) {
  Swal.fire({
    icon: 'info',
    title: 'Activar Categoría',
    text: '¿Quieres activar la categoría?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed) {
      fetch(routeActivarCat + `${categoriaId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if(response.ok) { notificacionConfirmacion('success', 'Categoría Activada', 'La categoría ha sido activada.') }
        else { notificacionConfirmacion('error', 'Error', 'Ha ocurrido un error al activar la categoría.') }
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

function volver() {
  window.history.back()
}