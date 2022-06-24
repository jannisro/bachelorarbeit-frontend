<template>

    <router-link :to="href" class="button" :class="{ 'button--large': large }"  v-if="href">
        <slot></slot>
    </router-link>

    <a :href="rawHref" class="button" :class="{ 'button--large': large }"  v-else-if="rawHref">
        <slot></slot>
    </a>

    <button class="button" :class="{ 'button--large': large }" v-else>
        <slot></slot>
    </button>

</template>

<script>
export default {
    name: 'ButtonElement',
    props: {
        href: String,
        rawHref: String,
        large: Boolean
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
    display: flex;
    align-items: center;

    &:hover, &.router-link-active {
        background: fade(@primary, 20%);
        color: @light;
    }

    &--large {
        padding: 0.7rem 3rem;
        font-size: 1.04rem;
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