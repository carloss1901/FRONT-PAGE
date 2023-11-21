const togglePassword = document.getElementById('togglePassword')
const submitForm = document.getElementById('submitForm')
const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')
const nombresInput = document.getElementById('nombresInput')
const apellidosInput = document.getElementById('apellidosInput')
const dniInput = document.getElementById('dniInput')
const celularInput = document.getElementById('celularInput')
const direccionInput = document.getElementById('direccionInput')

const miBoton = document.getElementById('miBoton')

let routeRegistrarU = 'http://localhost:4000/api/usuario/registrar'

togglePassword.addEventListener('click', function() {
    if(passwordInput.type === 'password') {
        passwordInput.type = 'text'
        togglePassword.innerHTML = '<i id="eye" class="fas fa-eye-slash text-gray-400"></i>'
    } else {
        passwordInput.type = 'password'
        togglePassword.innerHTML = '<i id="eye" class="fas fa-eye text-gray-400"></i>'
    }
})

usernameInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
passwordInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
nombresInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
apellidosInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
dniInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
celularInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})
direccionInput.addEventListener('input', function() {
  if(this.value.trim() != '') {
    quitarEstilosError(this)
  }
})

miBoton.addEventListener('click', function() {
  var usernameData = usernameInput.value
  var passwordData = passwordInput.value
  var nombresData = nombresInput.value
  var apellidosData = apellidosInput.value
  var dniData = dniInput.value
  var celularData = celularInput.value
  var direccionData = direccionInput.value

  if(usernameData.trim() === '' && passwordData.trim() === '' && nombresData.trim() === '' && apellidosData.trim() === '' && dniData.trim() === '' && celularData.trim() === '' && direccionData.trim() === '') {
    errorInput(usernameInput)
    errorInput(passwordInput)
    errorInput(nombresInput)
    errorInput(apellidosInput)
    errorInput(dniInput)
    errorInput(celularInput)
    errorInput(direccionInput)
    return
  }
  if(usernameData.trim() === '') {
    errorInput(usernameInput)
    return
  }
  if(passwordData.trim() === '') {
    errorInput(passwordInput)
    return
  }
  if(nombresData.trim() === '') {
    errorInput(nombresInput)
    return
  }
  if(apellidosData.trim() === '') {
    errorInput(apellidosInput)
    return
  }
  if(dniData.trim() === '') {
    errorInput(dniInput)
    return
  }
  if(dniData.trim().length !== 8) {
    errorInput(dniInput)
    mostrarError('El DNI debe ser de 8 dígitos.')
    return
  }
  if(celularData.trim() === '') {
    errorInput(celularInput)
    return
  }
  if(celularData.trim().length !== 9) {
    errorInput(celularInput)
    mostrarError('El celular debe ser de 9 dígitos.')
    return
  }
  if(direccionData.trim() === '') {
    errorInput(direccionInput)
    return
  }

  const formData = {
    username: usernameData,
    clave: passwordData,
    nombres: nombresData,
    apellidos: apellidosData,
    dni: dniData,
    celular: celularData,
    direccion: direccionData,
    estado: true
  }
  
  //registrarUsuario(formData)
})

function errorInput(inputElement) {
  inputElement.classList.add('border-rose-500')
  inputElement.classList.add('placeholder-red-200')
  inputElement.placeholder = 'Campo requerido !!!'
}
function quitarEstilosError(inputElement) {
  inputElement.classList.remove('border-rose-500')
  inputElement.classList.remove('placeholder-red-200')
  inputElement.placeholder = ''
}

function registrarUsuario(formData) {
  fetch(routeRegistrarU, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if(response.status === 409) { mostrarError('El username ya está registrado. Intente con otro') }
    if(response.status === 404) { mostrarError('El celular ya está registrado. Intente con otro.') }
    if(response.status === 400) { mostrarError('El DNI ya está registrado. Intente con otro.') }
    if(response.status === 200) {
      notificacionConfirmacion()
      limpiarCampos()
      setTimeout(() => {
        irLogin()
      }, 1300)
    }
  })
  .catch(error => {
    console.error(error)
  })
}

function filtrarNumeros(event) {
    const input = event.target
    const regex = /[^0-9]/g
    let value = input.value.replace(regex, '')

    if (!value.startsWith('9')) {
        value = '9' + value.slice(0, 8) // Agregar el dígito "9" al principio y limitar a 8 dígitos adicionales
      } else {
        value = value.slice(0, 9) // Limitar a un máximo de 9 dígitos
      }
      
      input.value = value
}

function filtrarNumerosDNI(event) {
    const input = event.target
    const regex = /[^0-9]/g
    let value = input.value.replace(regex, '')
    value = value.slice(0, 8)
    input.value = value
}

function soloLetras(event) {
    const input = event.target
    const regex = /[0-9]/
    let value = input.value.replace(regex, '')
    input.value = value
}

function notificacionConfirmacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se ha registrado con éxito.',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: '#f0fff0',
        iconColor: '#50C878',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}

function mostrarError(mensaje) {
  Swal.fire({
    position: 'top-end',
    icon: 'error',
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    background: '#fff0f0',
    iconColor: '#FF0000',
    customClass: {
      popup: 'animated slideInRight'
    }
  })
}

function limpiarCampos() {
    usernameInput.value = ''
    passwordInput.value = ''
    nombresInput.value = ''
    apellidosInput.value = ''
    dniInput.value = ''
    celularInput.value = ''
    direccionInput.value = ''
}

function irLogin() {
  window.location.href = "../html/login.html"
}