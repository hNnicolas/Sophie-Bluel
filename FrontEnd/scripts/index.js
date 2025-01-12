import { getWorks, getCategories, deleteWork, addWork } from './api.js'
import { projectGallery, filterContainer, loginButton, editHeader, editButton, modalEdit, triggerModal, addProjectButton, firstModal, secondModal, returnBack, formNewProject, inputImgNewProject, imgNewProject, titleNewProject, categoriesNewProject, inputFileContent, pushProjectButton, errorFile, errorTitle } from './domLinker.js'

// METHODE DE CREATION DES PROJETS POUR CHAQUE GALERIE
const createGallery = projects => {
    projectGallery.forEach((gallery, index) => {
        // Remise a 0 de la galerie lors du filtrage
        gallery.innerHTML = ''
        // Creation et ajout des cartes projets
        projects.forEach(project => {
            const projectCard = document.createElement('figure')
            const projectImg = document.createElement('img')
            projectImg.src = project.imageUrl
            projectImg.alt = project.title
            projectCard.appendChild(projectImg)

            // homepage : Création du titre du projet
            if (index === 0) {
                const projectTitle = document.createElement('figcaption')
                projectTitle.innerText = project.title
                projectCard.appendChild(projectTitle)
            }

            // Fenetre modale : ajout corbeille et supression titre projet
            if (index === 1) {
                const trashIcon = document.createElement('i')
                trashIcon.classList.add('fa-trash-can', 'fa-solid')
                projectCard.appendChild(trashIcon)

                // Supression du projet au clic sur la corbeille
                trashIcon.addEventListener('click', function () {
                    deleteWork(project.id)
                        .then(() => getWorks())
                        .then(updatedProjects => createGallery(updatedProjects))
                })
            }
            gallery.appendChild(projectCard)
        })
    })
}

// METHODE DE FILTRAGE DES PROJETS
const createCategories = categories => {
    // Creation du filtre All
    const filterButtonAll = document.createElement('button')
    filterButtonAll.classList.add('filter-button')
    filterButtonAll.classList.add('filter-button-all')
    filterButtonAll.innerText = 'Tous'
    filterContainer.appendChild(filterButtonAll)
    filterButtonAll.classList.add('filter-button-active')
    // Comportement au clic sur le filtre All
    filterButtonAll.addEventListener('click', function () {
        const btnsFilter = document.querySelectorAll('.portfolio-filters .filter-button')
        btnsFilter.forEach(btn => {
            btn.classList.remove('filter-button-active') // Suppression de la classe active de tous les btns
        })
        filterButtonAll.classList.add('filter-button-active') // Ajout de la classe active au btn All

        // Affichage de la galerie au clic sur le filtre All
        getWorks().then(projects => createGallery(projects))
    })

    // CREATION ET AJOUT DES FILTRES POUR CHAQUE CATEGORIE (SAUF ALL)
    categories.forEach(categorie => {
        const filterButton = document.createElement('button')
        filterButton.classList.add('filter-button')
        filterButton.classList.add('filter-button-categorie')
        filterButton.innerText = categorie.name
        filterContainer.appendChild(filterButton)

        // Comportement au clic sur les filtres
        filterButton.addEventListener('click', function () {
            const btnsFilter = document.querySelectorAll('.portfolio-filters .filter-button')
            btnsFilter.forEach(btn => {
                btn.classList.remove('filter-button-active')
            })
            filterButton.classList.add('filter-button-active')

            // Creation de la galerie en fonction du filtre
            getWorks().then(projects => {
                // Récupération des projets filtrés
                const filteredProjects = projects.filter(project => project.categoryId === categorie.id)
                // Création de la galerie en fonction de l'id du projet
                createGallery(filteredProjects)
            })
        })
    })
}

// MISE À JOUR DE L'AFFICHAGE EN FONCTION DE L'ÉTAT DE CONNEXION
if (localStorage.token) {
    loginButton.innerText = 'logout'
    editHeader.classList.remove('hidden')
    editButton.classList.remove('hidden')
    filterContainer.classList.add('hidden')
    loginButton.addEventListener('click', function () {
        // Suppression du token dans le local storage au clic sur logout + maj affichage
        localStorage.clear()
        loginButton.innerText = 'login'
        document.location.href = 'index.html' // Redirection pour actualisation
    })
    // Ouverture / fermeture de la modale
    triggerModal.forEach(trigger => trigger.addEventListener('click', function (e) {
        modalEdit.classList.toggle('hidden')
        e.preventDefault()
        // Reinitialisation du formulaire d'envoi d'un nouveau projet
        resetForm()
    }))
    // Changement de modale pour ajouter un projet
    addProjectButton.addEventListener('click', function (e) {
        e.preventDefault()
        firstModal.classList.add('hidden')
        secondModal.classList.remove('hidden')
    })
    // Retour vers la modale 1 au clic sur la flèche
    returnBack.addEventListener('click', function () {
        firstModal.classList.remove('hidden')
        secondModal.classList.add('hidden')
        // Reinitialisation du formulaire d'envoi d'un nouveau projet
        resetForm()
    })
    // Ajout des catégories dans la modale d'ajout photo
    getCategories().then(categories => {
        categories.forEach(function (element, id) {
            categoriesNewProject[id] = new Option(element.name, element.id)
        })
    })
} else { // Comportement au clic sur login si pas de token dans le local Sto
    loginButton.addEventListener('click', function () {
        document.location.href = 'login.html'
    })
}

// INITIALISATION DE LA GALERIE ET DES PROJETS A L'OUVERTURE DE LA PAGE
const init = () => {
    getWorks().then(projects => createGallery(projects))
    getCategories().then(categories => createCategories(categories))
}
init()

// FORMULAIRE D'AJOUT D'UN NOUVEAU PROJET
// Règle image
inputImgNewProject.addEventListener('input', () => {
    // vérif image + prévisualisation
    fileIsValid()
    // vérification du formulaire
    if (titleIsValid()) {
        formIsValid()
    }
})

const fileIsValid = () => {
    const file = inputImgNewProject.files[0]
    // Règles ajout de l'image
    if (file.size > 4194304) {
        errorFile.classList.remove('hidden')
        return false
    } else if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
        errorFile.classList.remove('hidden')
        return false
    } else {
        // Aperçu de l'image
        imgNewProject.classList.remove('hidden')
        imgNewProject.src = URL.createObjectURL(file)
        imgNewProject.alt = titleNewProject.value
        inputFileContent.forEach(content => {
            content.classList.add('hidden')
        })
        errorFile.classList.add('hidden')
        return true
    }
}

// Règle titre
titleNewProject.addEventListener('input', () => {
    // vérification du titre
    titleIsValid()
    // vérification du formulaire
    if (fileIsValid()) {
        formIsValid()
    }
})
const regex = /^[a-zA-Z"](?:[a-zA-Z"\s-]*[a-zA-Z"])$/
const titleIsValid = () => {
    if (titleNewProject.value.length > 0) {
        if (!regex.test(titleNewProject.value)) {
            errorTitle.classList.remove('hidden')
            return false
        }
        errorTitle.classList.add('hidden')
        return true
    }
    return false
}

// Actualisation style bouton envoi du projet
const formIsValid = () => {
    if (titleIsValid() && fileIsValid()) {
        pushProjectButton.classList.add('add-project-button-valid')
        errorFile.classList.add('hidden')
        errorTitle.classList.add('hidden')
        return true
    } else {
        pushProjectButton.classList.remove('add-project-button-valid')
        return false
    }
}

// Envoi du nouveau projet si formulaire valide
formNewProject.addEventListener('submit', (e) => {
    e.preventDefault()
    if (formIsValid()) {
        const newProject = new FormData()
        newProject.append('title', titleNewProject.value)
        newProject.append('image', inputImgNewProject.files[0])
        newProject.append('category', categoriesNewProject.value)
        resetForm()
        firstModal.classList.remove('hidden')
        secondModal.classList.add('hidden')

        // Actualisation de la galerie
        addWork(newProject)
            .then(() => getWorks())
            .then(updatedProjects => createGallery(updatedProjects))
    }
})

// Fonction de réinitialisation du formulaire
const resetForm = () => {
    errorTitle.classList.add('hidden')
    errorFile.classList.add('hidden')
    formNewProject.reset()
    imgNewProject.src = ''
    imgNewProject.alt = ''
    imgNewProject.classList.add('hidden')
    inputFileContent.forEach(content => {
        content.classList.remove('hidden')
    })
    pushProjectButton.classList.remove('add-project-button-valid')
}
