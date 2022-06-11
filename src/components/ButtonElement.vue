<template>
    <a class="button" v-if="href">
        <slot></slot>
    </a>
    <button class="button" v-else>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ButtonElement',
    props: {
        href: String
    }
}
</script>

<style lang="less">
@import '@/assets/less/setup';

.button {
    text-decoration: none;
    color: @light;
    padding: 0.4rem 2rem;
    background: transparent;
    border: solid 2px @primary;
    border-radius: 100px;
    transition: all 250ms;

    &:hover, &.router-link-active {
        background: fade(@primary, 20%);
        color: @light;
    }

    img {
        max-width: 1.2rem;
        margin-right: 0.6rem;
    }
}

html.light .button {
    background: fade(@primary, 80%);
    color: @light;

    &:hover {
        background: @primary;
        color: @light;
    }
}
</style>