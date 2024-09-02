import './index.pcss'

import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import './js/dark'
import './js/Glightbox'
import './js/videoModal'
import './js/todolist'


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

document.addEventListener("DOMContentLoaded", () => {
    window.Alpine = Alpine;
    Alpine.plugin(intersect)
    Alpine.start();
})


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
