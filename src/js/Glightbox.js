import Alpine from "alpinejs"
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

Alpine.data('glightbox', () => ({
  lightbox: null,
  gallery: [
    {
        type:'image',
        video: '',
        img: 'https://mdbcdn.b-cdn.net/img/new/slides/086.webp',
        alt: 'the first image',
        tite: 'hallo welt',
        description: 'this is about glightbox',
    },
    {
        type:'video',
        video: 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
        img: 'https://mdbcdn.b-cdn.net/img/new/slides/006.webp',
        alt: 'the second test',
        tite: 'hallo welt again',
        description: 'this is about glightbox',
    },
    {
        type:'image',
        video: '',
        img: 'https://mdbcdn.b-cdn.net/img/new/slides/087.webp',
        alt: 'the first image',
        tite: 'hallo nina',
        description: 'this is about glightbox',
    },
    {
        type:'image',
        video: '',
        img: 'https://mdbcdn.b-cdn.net/img/new/slides/088.webp',
        alt: 'the first image',
        tite: 'hallo youtube',
        description: 'this is about glightbox',
    },
    {
        type:'video',
        video: 'https://vimeo.com/115041822',
        img: 'https://mdbcdn.b-cdn.net/img/new/slides/007.webp',
        alt: '007',
        tite: '007',
        description: 'just testing',
    }
  ],
  init() {
    this.$nextTick(() => {
      GLightbox({
          loop: true, 
          autoplayVideos: true
      })
    })
  }
}))