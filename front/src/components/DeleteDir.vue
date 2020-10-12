<template>
    <div class="deleteDir">
        <p @click="borrar">Borrar</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props:{
        path: String
    },
    methods: {
        async borrar(){

            let path = "http://localhost:3000/dir/"+this.path+"/";

            await axios({
                method: 'delete',
                url: path
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
            });
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>