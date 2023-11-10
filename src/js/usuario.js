const userData = localStorage.getItem('uI')
const ps = localStorage.getItem('ps')

const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')
const nombresInput = document.getElementById('nombresInput')
const apellidosInput = document.getElementById('apellidosInput')
const dniInput = document.getElementById('dniInput')
const celularInput = document.getElementById('celularInput')
const direccionInput = document.getElementById('direccionInput')

let routeUser = 'http://localhost:4000/api/usuario/'

document.addEventListener('DOMContentLoaded', function() {
  datosEditar(userData)
  console.log('El DOM se ha cargado completamente')
})

togglePassword.addEventListener('click', function() {
  if(passwordInput.type === 'password') {
      passwordInput.type = 'text'
      togglePassword.innerHTML = '<i id="eye" class="fas fa-eye-slash text-gray-400"></i>'
  } else {
      passwordInput.type = 'password'
      togglePassword.innerHTML = '<i id="eye" class="fas fa-eye text-gray-400"></i>'
  }
})

const fecthData = async(ruta) => {
  try {
    const res = await fetch(ruta)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

function actualizarDatos() {
  validarCampos()
  if(!camposValidados()) {
    return
  }
    var usuarioBody = {
        username: usernameInput.value,
        clave: passwordInput.value,
        nombres: nombresInput.value,
        apellidos: apellidosInput.value,
        dni: dniInput.value,
        celular: celularInput.value,
        direccion: direccionInput.value
    }

   Swal.fire({
        title: 'Actualizar Mis Datos',
        text: '¿Desea continuar con la actualización de los datos?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        buscarUsuario(userData)
        .then(usuarioName => {
            const c = desencriptar(ps)
            const auth = new Headers()
            auth.append('Authorization','Basic ' + btoa(usuarioName + ":" + c))
            fetch(`http://localhost:8080/usuario/editar/${userData}`, {
                method: 'PUT',
                body: JSON.stringify(usuarioBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.get('Authorization')
                }
            })
            .then(response => {
                if(response.status === 409) {
                    usernameEnUso()
                } else if(response.status === 400) {
                    dniEnUso()
                } else if(response.status === 404) {
                    celularEnUso()
                } else if(response.status === 200) {
                    const nuevoPass = encriptar(passwordInput.value)
                    localStorage.removeItem('ps')
                    localStorage.setItem('ps', nuevoPass)
                    notificacionConfirmacion('success','Usuario Actualizado','Sus datos han sido actualizados con éxito.')
                }
            })
            .catch(error => {
                console.error('Error al editar el usuario',error)
            })
        })
      } 
    })
}
async function datosEditar(userId) {
    try {
      const usuario = await fecthData(routeUser + `${userId}`)
      usernameInput.value = usuario.username
      passwordInput.value = desencriptar(ps)
      nombresInput.value = usuario.nombres
      apellidosInput.value = usuario.apellidos
      dniInput.value = usuario.dni
      celularInput.value = usuario.celular
      direccionInput.value = usuario.direccion
    } catch (error) {
      console.error("Error al obtener los datos del usuario: ", error)
    }
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
function usernameEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El username ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    usernameInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function dniEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El DNI ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    dniInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function celularEnUso() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El celular ya está registrado. Intente con otro',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#fff0f0',
        iconColor: '#FF0000',
        customClass: {
          popup: 'animated slideInRight'
        }
      })
      celularInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
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
function encriptar(password) {
    let passwordEncript = ''
    for(let i = 0; i < password.length; i++) {
        const caracter = password[i]
        const valorAsci = caracter.charCodeAt(0)
        const nuevoValorAsci = valorAsci + 30
        const nuevoCaracter = String.fromCharCode(nuevoValorAsci)
        passwordEncript += nuevoCaracter
    }
    return passwordEncript
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
function usernameEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El username ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    usernameInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function dniEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El DNI ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    dniInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function celularEnUso() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El celular ya está registrado. Intente con otro',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#fff0f0',
        iconColor: '#FF0000',
        customClass: {
          popup: 'animated slideInRight'
        }
      })
      celularInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}