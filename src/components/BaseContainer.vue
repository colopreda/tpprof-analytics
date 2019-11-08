<template>
    <div id="container">
        <div class="graph" :id="id"></div>
    </div>
</template>

<script>
    export default {
        name: "BaseContainer",
        props: {
            id: String
        }
    }
</script>

<style scoped>
    .graph {
        width: 100%;
        height: 100%;
        margin-bottom: 50px;
    }

    @media not all and (min-resolution:.001dpcm) { @media {

        .graph {
            width: 100%;
            height: 100%;
            min-height: 550px;
            margin-bottom: 50px;
        }
    }}

    #container {
        flex-grow: 1;
    }
</style>