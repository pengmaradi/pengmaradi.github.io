import './index.pcss'

import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import './js/dark'
import './js/Glightbox'
import './js/videoModal'
import './js/todolist'
import ArrowMask from './js/ArrowMask'
import HeadingAnimate from './js/HeadingAnimate'
import MainMenu from './js/MainMenu'
import PostPage from './js/PostPage'


document.addEventListener("DOMContentLoaded", () => {
    window.Alpine = Alpine;
    Alpine.plugin(intersect)
    MainMenu()
    ArrowMask()
    HeadingAnimate()
    PostPage()
    Alpine.start()
})

