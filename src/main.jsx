import './index.pcss'

import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import './js/dark'
import './js/Glightbox'
import './js/videoModal'
import './js/todolist'
import Relaxed from './js/relaxed'


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GetFilm from './js/GetFilm'

document.addEventListener("DOMContentLoaded", () => {
    window.Alpine = Alpine;
    Alpine.plugin(intersect)
    Relaxed()
    Alpine.start()
})

const film = document.getElementById('film')

if(film) {
    createRoot(film).render(
      <StrictMode>
        <GetFilm />
      </StrictMode>,
    )
} else {
    //console.log('no film element')
}
