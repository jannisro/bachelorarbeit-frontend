<template>
    <router-view/>
</template>

<script>

export default {
    name: 'App'
}
</script>

<style lang="less">
@import '@/assets/less/setup';
@import '@/assets/less/utils';

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Source Sans Pro', sans-serif;
}

html {
    background: @dark;
    color: @light;
    scroll-behavior:smooth

    /** {
        color: @light;
    }

    &.light {
        background: @light;
        color: #000;

        * {
            color: #000;
        }
    }*/
}
</style>
