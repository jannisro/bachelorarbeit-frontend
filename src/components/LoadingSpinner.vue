<template>
    <div class="loading-wrapper">
        <div class="loading-container">
            <svg viewBox="0 0 100 100">
                <defs>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
                    flood-color="#2196F3"/>
                </filter>
                </defs>
                <circle class="loading-spinner" id="spinner" style="fill:transparent;stroke:#2196F3;stroke-width: 7px;stroke-linecap: round;filter:url(#shadow);" cx="50" cy="50" r="45"/>
            </svg>
        </div>
    </div>
</template>


<script>
export default {
    name: 'LoadingSpinner'
}
</script>


<style>

.loading-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 4rem 0;
}

@keyframes loadingSpinner {
    0% {
        stroke-dasharray: 1 98;
        stroke-dashoffset: -105;
    }
    50% {
        stroke-dasharray: 80 10;
        stroke-dashoffset: -160;
    }
    100% {
        stroke-dasharray: 1 98;
        stroke-dashoffset: -300;
    }
}

.loading-container {
    width: 70px;
    height: 70px;
}

.loading-spinner {
    transform-origin: center;
    animation-name: loadingSpinner;
    animation-duration: 1.2s;
    animation-timing-function: cubic-bezier;
    animation-iteration-count: infinite;
}

</style>