// FROM https://github.com/sominator/mevn-cardUrl-generator/blob/master/client/src/components/CharacterViewer.vue

<template>
    <div class="cardUrl-viewer">
        <h1>Url Viewer</h1>
        <p v-for="(cardUrl, index) in cardUrls" v-bind:key="index">{{cardUrl.name}} is a {{cardUrl.url}}!</p>
    </div>
</template>

<script>
    export default {
        name: 'cardUrlViewer',
        props: {
            cardUrls: Array
        }
    }
</script>

<style scoped>
</style>