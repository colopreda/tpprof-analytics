<template>
    <div id="animation-container">
        <img class="center" src="@/assets/loading.gif">
    </div>
</template>

<script>
    export default {
        name: "LoadingAnimation"
    }
</script>

<style scoped>
#animation-container {
    width: 100%;
    height: 100%;
}
img.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>