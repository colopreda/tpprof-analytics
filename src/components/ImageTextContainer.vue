<template>
    <div class="container">
        <div class="item">
            <img :src="require(`@/assets/${image}`)" width="150px"/>
            <h3 id="text">{{ text }}</h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImageTextContainer",
        props: {
            image: String,
            text: String
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .item {
        width: 500px;
        height: 500px;
        padding: 120px 0;
        text-align: center;
    }

    #text {
        margin-top: 40px!important;
    }

</style>