import Alpine from 'alpinejs'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

const PostPage = () => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin)
    Alpine.data('postPage', () => ({
        init() {
            const postPages = this.$el.querySelectorAll('.post-page');

            postPages.forEach((page, index) => {
                gsap.fromTo(
                    page,
                    {
                        opacity: 0,
                        y: 150,
                        rotation: index % 2 === 0 ? -15 : 15,
                        scale: 0.8,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotation: index % 2 === 0 ? 1 : -2,
                        scale: 1,
                        duration: 3,
                        ease: 'back.out(2)',
                        scrollTrigger: {
                            trigger: page,
                            start: 'top 85%',
                            end: 'bottom 15%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
                const title = page.querySelector('.post-title');
                const description = page.querySelector('.post-description');
                if (!title || !description) return;

                title.addEventListener('mouseenter', () => {
                    gsap.to(title, {
                        scale: 1.05,
                        rotation: 2,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });

                title.addEventListener('mouseleave', () => {
                    gsap.to(title, {
                        scale: 1,
                        rotation: -1,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });

                gsap.fromTo(
                    title,
                    { scale: 0.8, rotation: -5 },
                    {
                        scale: 1,
                        rotation: -1,
                        duration: 1.2,
                        delay: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: page,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );

                this.animateTextOnScroll(description, page);
            });
        },

        animateTextOnScroll(element, triggerEl) {
            const original = element.textContent;
            element.innerHTML = original
                .split(' ')
                .map(
                    (w) =>
                        `<span class="word" style="display:inline-block;opacity:0;transform:translateY(20px)">${w}</span>`
                )
                .join(' ');

            const words = element.querySelectorAll('.word');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top 100%',
                    end: 'bottom 30%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.to(words, {
                opacity: 0.5,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.08,
                delay: 0.6,
            });

            words.forEach((w, i) => {
                if (Math.random() > 0.7) {
                    gsap.to(w, {
                        scale: 1.1,
                        duration: 0.2,
                        delay: 0.9 + i * 0.08,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut',
                    });
                }
            });
        },
    }));

}

export default PostPage