<template>
    <div class="deleteFile">
        <p @click="borrar">DELETE</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props:{
        id:{
            type: String,
            required: true
        },
        path:{
            type: String,
            default: undefined
        }
    },
    methods:{
        async borrar(){
            let path = undefined;
            if(this.path == ""){
                path = "http://localhost:3000/file/"+this.id+"/";
            }else{
                path = "http://localhost:3000/file/"+this.id+"/"+this.path;
            }
            console.log(path + "  " + this.id);

            await axios({
                method: 'delete',
                url: path
            })
            .then((response) =>{
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