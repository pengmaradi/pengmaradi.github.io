import Alpine from 'alpinejs'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const MainMenu = () => {
    Alpine.data('mainMenu', () => ({
        showMenu: false,
        animating: false,
        init() {
            gsap.registerPlugin(SplitText)
            
            this.$nextTick(() => {
                let bars = this.$el.querySelector('.bars')
                let deco = this.$el.querySelector('.deco')
                let linkElements = this.$el.querySelectorAll('a')

                if (bars) {
                    const tl = gsap.timeline()

                    bars.addEventListener('click', () => {
                        this.showMenu = !this.showMenu
                        deco?.removeAttribute('style')
                        linkElements.forEach(link => {
                            link.removeAttribute('style')
                        })

                        if (this.showMenu) {
                            tl.from(deco, {
                                duration: 1.5,
                                rotation: 360,
                                scale: 0,
                                opacity: 1,
                                ease: "power2.inOut",
                            })
                            .to(linkElements, {
                                onStart: () => {
                                    linkElements.forEach(link => {
                                        
                                        tl.to(link, {
                                            duration: 0.2,
                                            opacity: 1,
                                            ease: 'power2.inOut',
                                            onStart: () => {
                                                let split = SplitText.create(link, { type: 'chars', aria: 'hidden' })
                                                
                                                gsap.from(split.chars, {
                                                    //x: -10,
                                                    rotate: 90,
                                                    y: 10,
                                                    autoAlpha: 0,
                                                    stagger: 0.2,
                                                    duration: 0.5,
                                                    ease: 'power2.inOut',
                                                    onComplete: () => {
                                                        split.revert()
                                                    },
                                                })
                                            },
                                        })
                                    })
                                },
                                
                            })
                            .to(deco, {
                                duration: 0.5,
                                opacity: 0.5,
                                scale: 1,
                                ease: "power3.out",
                            })
                        }
                    })
                }
            })
        }
    }))
}

export default MainMenu