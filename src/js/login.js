const loginButton = document.getElementById('loginButton')
const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')
const togglePassword = document.getElementById('togglePassword')

let routeLogin = 'http://localhost:4000/api/login/ingresar'

document.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        loginButton.click()
    }
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
loginButton.addEventListener('click', function() {
    if(!validarCampos()) { return }

    var usernameData = usernameInput.value
    var passwordData = passwordInput.value

    const formData = {
        username: usernameData,
        password: passwordData
    }

    loguearse(formData)
})

function loguearse(formData) {
    fetch(routeLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if(response.status === 200) { return response.json() }
        else if(response.status === 401) { notificacionDenegacion() }
        else { throw new Error("Error en la solicitud") }
    })
    .then(data => {
        const passEncript = encriptar(passwordInput.value)
        localStorage.setItem('uI', data.id_usuario)
        localStorage.setItem('ps', passEncript)
        localStorage.setItem('nm', data.nombres)
        limpiarCampos()
        notificacionConfirmacion(data.nombres)
        setTimeout(() => {
            if(data.id_rol === 1) { irAdmin() }
            else { irCatalogo() }
        }, 1200)
    })
    .catch(error => { console.error(error) })
}

function validarCampos() {
    const usernameInput = document.getElementById('usernameInput')
    const passwordInput = document.getElementById('passwordInput')
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if(username === '') {
        notificacionCamposVaciosUser()
        usernameInput.classList.add('input-error')
        return false
    } else {
        usernameInput.classList.remove('input-error')
    }

    if(password === '') {
        notificacionCamposVaciosClave()
        passwordInput.classList.add('input-error')
        return false
    } else {
        passwordInput.classList.remove('input-error')
    }

    return true
}

function notificacionConfirmacion(nombreUsuario) {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Bienvenido, ${nombreUsuario}`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f0fff0',
        iconColor: '#50C878',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function notificacionDenegacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Credenciales Incorrectas :(',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8d7da',
        iconColor: '#721c24',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function notificacionCamposVaciosUser() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Debe ingresar su username',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8d7da',
        iconColor: '#721c24',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function notificacionCamposVaciosClave() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Debe ingresar su contraseña',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8d7da',
        iconColor: '#721c24',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function limpiarCampos() {
    document.getElementById('usernameInput').value = ""
    document.getElementById('passwordInput').value = ""
}
function irCatalogo() {
    window.location.href = "../../../index.html"
}
function irAdmin() {
    window.location.href = "../html/administrador.html"
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