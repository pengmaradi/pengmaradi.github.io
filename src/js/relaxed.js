import Alpine from 'alpinejs';

const Relaxed = () => {
    
    Alpine.data('leading_relaxed', () => ({
        texts: [],
        animate: '',
        show: false,
        props: {
            delay: 0,
            wordDelay: 100,
            highlightClass: 'font-medium',
            baseClass: 'font-light',
        },
        init() {
            this.texts = this.$el.dataset.text
                .replace(/\n/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim()
                .split(' ');

            this.$nextTick(() => {
                this.show = true;
                this.toggleClass();

                window.addEventListener('scroll', () => {
                    const rect = this.$el.getClientRects();
                    if (rect[0].top < -300) {
                        this.show = false;

                        this.toggleClass();
                    } else {
                        this.show = true;
                    }
                });
            });
        },

        toggleClass(texts) {
            this.texts.forEach((_, index) => {
                const wordEl = this.$el.children[index + 1];
                setTimeout(() => {
                    if (wordEl) {
                        if (this.show) {
                            wordEl.classList.remove(
                                ...this.props.baseClass.split(' ')
                            );
                            wordEl.classList.add(
                                ...this.props.highlightClass.split(' ')
                            );

                            wordEl.classList.add(this.animate);
                        } else {
                            wordEl.classList.remove(...this.animate.split(' '));
                            wordEl.classList.remove(
                                ...this.props.baseClass.split(' ')
                            );
                            wordEl.classList.remove(
                                ...this.props.highlightClass.split(' ')
                            );
                        }
                        setTimeout(() => {
                            if (this.show) {
                                wordEl.classList.remove(this.animate);
                            }
                        }, 300);
                    }
                }, this.props.delay + index * this.props.wordDelay);
            });
        },
    }));
}
export default Relaxed