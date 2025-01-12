import { postLogin } from './api.js'
import { loginEmail, loginPassword, loginForm } from './domLinker.js'

// Lancement de la fonction connexion au clic sur submit
loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    // Récupération de l'user et du mdp renseignés
    const user = {
        email: loginEmail.value,
        password: loginPassword.value
    }

    postLogin(user)
        .then((data) => {
            if (data.token) {
                const token = data.token
                localStorage.token = token
                console.log(localStorage)
                document.location.href = 'index.html'
            } else {
                throw alert('Erreur dans l\'identifiant ou le mot de passe')
            }
        })
        .catch(error => {
            throw alert('API non disponible : ' + error.message)
        })
})
