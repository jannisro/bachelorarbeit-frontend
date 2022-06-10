<template>
    <button class="support-button" @click="$emit('supportButtonClicked')">?</button>
</template>

<script>
export default {
    name: 'SupportButton',
    emits: ['supportButtonClicked']
}
</script>

<style lang="less">
@import '@/assets/less/setup';

.support-button {
    width:2.7rem;
    height: 2.7rem;
    background: none;
    border: none;
    cursor: pointer;
    color: @light;
    font-size: 1.7rem;
    padding: 0.9rem;
    border-radius: 200rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 2px @light;
    transition: all 250ms;

    &:hover {
        background: fade(@primary, 30%);
        border: solid 2px @primary
    }
}
</style>