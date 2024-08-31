import './index.pcss'

import Alpine from 'alpinejs'
import './js/dark'


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

document.addEventListener("DOMContentLoaded", () => {
    window.Alpine = Alpine;
    Alpine.start();
})


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
