<template>
    <router-view/>
</template>

<script>

export default {
    name: 'App',
    metaInfo: {
        titleTemplate: '%s | European Energy Data', 
        link: [
            /*{ rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/favicon/android-icon-192x192.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/favicon/apple-icon-180x180.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/img/favicon/favicon-96x96.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon/favicon-16x16.png' },*/
        ],
        meta: [
            { name: 'theme-color', content: '#040D21' }
        ]
    }
}
</script>

<style lang="less">
@import '@/assets/less/setup';

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Source Sans Pro', sans-serif;
}

html {
    background: @dark;
    color: @light;

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
