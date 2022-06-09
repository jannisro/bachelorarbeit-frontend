<template>
    <div class="modal micromodal-slide" id="modal-support" aria-hidden="true">
        <div class="modal__overlay" tabindex="-1" data-micromodal-close>
            <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-support-title">
                <header class="modal__header">
                <h2 class="modal__title" id="modal-support-title">
                    {{ title }}
                </h2>
                </header>
                <main class="modal__content" id="modal-support-content" v-html="content"></main>
                <footer class="modal__footer">
                    <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
                </footer>
            </div>
        </div>
    </div>
</template>


<script>
import MicroModal from 'micromodal';

export default {
    name: 'SupportModal',

    data () {
        return {
            title: '',
            content: ''
        }
    },

    methods: {
        show (explanation) {
            if (explanation && explanation.title && explanation.caption && explanation.bullets) {
                this.title = explanation.title;
                let content = `<p>${explanation.caption}</p>`;
                content += '<ul>';
                content += explanation.bullets.map(item => { return `<li>${item}</li>` }).join('');
                content += '</ul>';
                this.content = content;
            }
            MicroModal.show('modal-support');
        }
    },

    mounted () {
        MicroModal.init()
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';

.modal {

    ul li {
        list-style-position: inside;
        margin-left: 1rem;
        margin-top: 0.4rem;
    }

    &__overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__container {
        background: #fff;
        padding: 30px;
        max-width: 500px;
        max-height: 100vh;
        border-radius: 4px;
        overflow-y: auto;
        box-sizing: border-box;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__title {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 600;
        font-size: 1.25rem;
        line-height: 1.25;
        color: #00449e;
        box-sizing: border-box;
    }

    &__content {
        margin-top: 2rem;
        margin-bottom: 2rem;
        line-height: 1.7;
        color: rgba(0,0,0,.8);
    }

    &__btn {
        font-size: .875rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: .5rem;
        padding-bottom: .5rem;
        background-color: #e6e6e6;
        color: rgba(0,0,0,.8);
        border-radius: .25rem;
        border-style: none;
        border-width: 0;
        cursor: pointer;
        -webkit-appearance: button;
        text-transform: none;
        overflow: visible;
        line-height: 1.15;
        margin: 0;
        will-change: transform;
        -moz-osx-font-smoothing: grayscale;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        transition: -webkit-transform .25s ease-out;
        transition: transform .25s ease-out;
        transition: transform .25s ease-out,-webkit-transform .25s ease-out;
    }

    &__btn:focus, &__btn:hover {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    &__btn-primary {
        background-color: #00449e;
        color: #fff;
    }
}




@keyframes mmfadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes mmfadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes mmslideIn {
    from { transform: translateY(15%); }
    to { transform: translateY(0); }
}

@keyframes mmslideOut {
    from { transform: translateY(0); }
    to { transform: translateY(-10%); }
}

.micromodal-slide {
    display: none;
}

.micromodal-slide.is-open {
    display: block;
}

.micromodal-slide[aria-hidden="false"] &__overlay {
    animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.micromodal-slide[aria-hidden="false"] &__container {
    animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);
}

.micromodal-slide[aria-hidden="true"] &__overlay {
    animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.micromodal-slide[aria-hidden="true"] &__container {
    animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);
}

.micromodal-slide &__container,
.micromodal-slide &__overlay {
    will-change: transform;
}
</style>