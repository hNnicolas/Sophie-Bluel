// URLS API
const URL_WORKS = 'http://localhost:5678/api/works'
const URL_CATEGORIES = 'http://localhost:5678/api/categories'
const URL_LOGIN = 'http://localhost:5678/api/users/login'

// METHODE GET API GENERALE
const get = url => fetch(url).then(response => response.json())

// METHODE GET API PAR URL
export const getWorks = () => get(URL_WORKS)
export const getCategories = () => get(URL_CATEGORIES)

// METHODE CONNEXION
export const postLogin = userLogin => fetch(URL_LOGIN, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userLogin)
})
    .then(response => response.json())
    .catch(error => {
        throw error
    })

// METHODE SUPPRESSION PROJET
export const deleteWork = id => fetch(`${URL_WORKS}/${id}`, {
    method: 'DELETE',
    headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'My-Custom-Header': 'foobar'
    }
})
    .then(() => alert('Ce projet a bien été supprimé'))
    .catch(error => {
        throw error
    })

// METHODE AJOUT D'UN PROJET
export const addWork = newProjectDescription => fetch(URL_WORKS, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${localStorage.token}`
    },
    body: newProjectDescription
})
    .then(response => {
        alert('Ce projet a bien été ajouté')
        return response.json()
    })
    .catch(error => {
        throw error
    })
