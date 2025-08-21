import Alpine from 'alpinejs';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

const ArrowMask = () => {
    Alpine.data('arrowMaskTry', () => ({
        init() {
            gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

            gsap.from('#maskFill', {
                duration: 2,
                ease: 'none',
                drawSVG: 0,
                repeat: -1,
                yoyo: true,
                repeatDelay: 1,
            });

            gsap.from(this.$el, {
                duration: 3,
                ease: 'power1.out',
                x: '-50vw',
            });
        },
    }));
};

export default ArrowMask;
