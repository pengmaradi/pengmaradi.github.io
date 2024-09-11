import Alpine from "alpinejs"
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

Alpine.data('gLightbox', () => ({
  lightbox: null,
  gallery: [],
  init() {
    this.$nextTick(() => {
      GLightbox({
        openEffect: 'fade',
        //width: '100%',
        touchNavigation: true,
        type: 'image',
        zoomable: true,
      })
    })
  }
}))