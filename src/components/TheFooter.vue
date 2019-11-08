<style>
</style>

<template>
    <footer class="d-flex justify-content-center mt-auto py-4 bg-dark text-white-50">
        <div class="d-flex justify-content-between">{{text}}</div>
    </footer>
</template>

<script>
    export default {
        name: "TheFooter",
        props: {
            text: String
        }
    }
</script>
