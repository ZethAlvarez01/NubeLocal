<template>
    <div class="deleteDir">
        <p @click="borrar">DELETE</p>
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
            .then((response) => {
                console.log(response);
                setTimeout(() => { this.$emit('getTodos'); }, 500);
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