<template>
    <div class="cardUrl-creator">
        <h1>cardUrl Creator</h1>
        <label for="cardUrl-name">cardUrl Name: </label>
        <input type="text" id="cardUrl-name" v-model="name" placeholder="Enter a name" /> <br /><br />
        <label for="url-list">cardUrl Profession: </label>
        <select id="urls-list" v-model="url">
            <option value="Mage">Mage</option>
            <option value="Thief">Thief</option>
            <option value="Warrior">Warrior</option>
        </select><br /><br />
        <button v-on:click="postcardUrl">Create cardUrl</button>
    </div>
</template>

<script>
    import axios from 'axios';
	
    export default {
        name: 'cardUrlCreator',
        data: function () {
            return {
                name: null,
                url: null
            }
        },
		
        methods: {
            postcardUrl: function () {
                axios
                    .post('http://localhost:3000/cardUrls', {
                        name: this.name,
                        url: this.url
                    });
            }
        }
		
    }
</script>

<style scoped>
</style>