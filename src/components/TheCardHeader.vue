<template>
    <div id="content">
        <img :id="tooltipText" :src="require(`@/assets/${icon}`)" width="40"/>
        <h4 id="text">{{ title }}</h4>
        <b-tooltip :target="tooltipText" placement="bottomleft">
            {{ tooltipText }}
        </b-tooltip>

    </div>
</template>

<script>
    export default {
        name: "TheCardHeader",
        props: {
            title: String,
            icon: String,
            tooltipText: String
        }
    }
</script>

<style scoped>
    #content {
        position: relative;
    }
    #content img {
        position: absolute;
        top: 0;
        right: 16px;
    }

    #text {
        height: 52px;
        margin-right: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 1.8rem;
        font-family: 'Dosis', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
    }
</style>