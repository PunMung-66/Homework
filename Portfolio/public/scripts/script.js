//loader

window.addEventListener('load', function () {
    // Add a delay of 1 second before hiding the preloader
    // Hide the preloader
    var preloader = document.querySelector('.preloader-canvas')
    setTimeout(function () {
        preloader.classList.add('animate-close')
    }, 5000)
    setTimeout(function () {
        preloader.classList.add('hidden')
    }, 6000)

    
})

let content_list = document.querySelectorAll('.content-show')
let select_list = document.querySelectorAll('.item-sidebar')

let update_function = async (index, list_update, hide_class) => {
    try {
        if (index >= 0 && index < list_update.length) {
            for (let i = 0; i < list_update.length; i++) {
                if (i === index) {
                    list_update[i].classList.remove(hide_class)
                } else {
                    list_update[i].classList.add(hide_class)
                }
            }
        } else {
            for (let i = 0; i < list_update.length; i++) {
                list_update[i].classList.add(hide_class)
            }
        }
    } catch (e) {
        console.log(e)
    }
}

//update first page
update_function(0, content_list, 'content-hide')

// sidebar
for (let i = 0; i < select_list.length; i++) {
    select_list[i].addEventListener('click', () => {
        if (i === 4) {
            // update(0)
            update_function(0, content_list, 'content-hide')
        } else if (i === 3) {
            console.log('download')
        } else {
            update_function(i, content_list, 'content-hide')
        }
    })
}

// Modal

let card_list = document.querySelectorAll('.exp-card')
let modal_list = document.querySelectorAll('.modal-canvas')
let x_modal_list = document.querySelectorAll('.x-in-modal')
let c_modal_list = document.querySelectorAll('.modal-canvas')

console.log(card_list)
console.log(modal_list)

// close all modal
update_function(-1, modal_list, 'modal-hide')

for (let i = 0; i < card_list.length; i++) {
    card_list[i].addEventListener('click', () => {
        update_function(i, modal_list, 'modal-hide')
    })

    x_modal_list[i].addEventListener('click', () => {
        update_function(-1, modal_list, 'modal-hide')
    })

    c_modal_list[i].addEventListener('click', () => {
        update_function(-1, modal_list, 'modal-hide')
    })
}
