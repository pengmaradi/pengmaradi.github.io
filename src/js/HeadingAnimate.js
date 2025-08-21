import Alpine from 'alpinejs'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const HeadingAnimate = () => {
    Alpine.data('headingAnimate', () => ({

        init() {
            gsap.registerPlugin(SplitText)
            
            gsap.set(this.$el, {
                opacity: 1
            })

            let split = SplitText.create(this.$el, { type: 'chars', aria: 'hidden' })

            gsap.from(split.chars, {
                opacity: 0.1,
                y: 10,
                duration: 1,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.1
            })

        }
    }))
}

export default HeadingAnimate