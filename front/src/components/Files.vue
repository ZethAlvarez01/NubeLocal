<template>
    <div class="Files">
        <h1>Archivos</h1>

        <h1 class="label">Nuevo archivo</h1>
        <input type="file" @change="submitFiles" multiple>

        <h1 class="label">Nueva carpeta</h1>
        <input type="text" v-model="nuevaCarpeta">
        <button v-on:click="crearCarpeta">Crear</button>

        <div v-for="(item, i) in rutas" :key="i" @click="checkBack(item.i)">
            <h2>{{ item.name }}</h2>
        </div>
        <div class="archivos">
            <div v-for="(item, i) in elementos" :key="i">
                <div v-if="item.type"> {{item.name}} {{ item.id }}</div>
                <div v-else @click="checkFordward(item.path)">{{item.name}} </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "Files",
    data:()=>({
        elementos: [],
        path: "",
        rutas: [{name: "Home",i:0}],
        files: [],
        nuevaCarpeta: null
    }),
    mounted() {
        this.elementos = [];
        this.getTodos();
    },
    methods: {
        getTodos(){
            this.elementos = [];
            axios.get("http://localhost:3000/"+this.path)
            .then(response => {
                let arreglo = response.data.elements;
                for(let i=0;i<arreglo.length;i++){
                    //console.log(arreglo[i]);
                    let aux = true;
                    if(arreglo[i].type !== 'file'){
                        aux = false;
                    }
                    let elemento = {
                        name: arreglo[i].name,
                        type: aux,
                        path: arreglo[i].path,
                        id: arreglo[i].id
                    };
                    this.elementos.push(elemento);
                }
                
            })
            .catch(e => console.log(e));
            
        },
        checkFordward(path){
            this.rutas = [{name: "Home",i:0}];
            let arreglo = path.split("\\");
            //console.log(arreglo);
            let cad = "";
            let indice = 0;
            for(let i=0;i<arreglo.length;i++){
                if(arreglo[i] == 'uploads'){
                    indice = i;
                }
            }   

            for(let i=indice+1;i<arreglo.length;i++){
                this.rutas.push({name: arreglo[i], i: this.rutas.length});
            }

            for(let i=arreglo.length-1;i>=0;i--){
                if(arreglo[i] != 'uploads'){
                    cad = arreglo[i]+"-"+cad;
                }else{
                    this.path = cad;
                    //console.log(path);
                    this.elementos = [];
                    this.getTodos();
                }
            }
        },
        checkBack(ind){
            if(ind == 0){
                this.path = "";
                this.rutas = [{name: "Home",i:0}];
                this.getTodos();
            }else{
                let cad = "";
                let aux = [{name: "Home",i:0}];
                for(let i=1;i<=ind;i++){
                    cad = cad + this.rutas[i].name +"-";
                    aux.push(this.rutas[i]);
                }
                this.rutas = aux;
                this.path = cad;
                this.elementos = [];
                this.getTodos();
            }
        },
        async submitFiles(event) {
            
            if( event.target.files.length == 0 ){
                console.log("no files selected");
                return 0;
            }

            let path = undefined;
    
            if(this.rutas.length != 1){
                path = "";
                for(let i=0;i<this.rutas.length-1;i++){
                    if(i != 0){
                        path = path + this.rutas[i].name + "-";
                    }
                }
                path = path + this.rutas[this.rutas.length-1].name;
            }

            console.log(path);
            this.files = event.target.files;
            console.log(this.files);
            let url = "http://localhost:3000/";
            if(path != undefined){
                url = url + path;
            }

            var bodyFormData = new FormData();
            for(let i=0;i<this.files.length;i++){
                bodyFormData.append('file',this.files[i]);
            }

            await axios({
                method: 'post',
                url: url,
                data: bodyFormData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
            });

            this.getTodos();

        },
        async crearCarpeta(){
            if(this.nuevaCarpeta == null || this.nuevaCarpeta == "" || this.nuevaCarpeta == undefined || this.nuevaCarpeta == " "){
                console.log("Ingresa un nombre");
                return 0;
            }

            let path = undefined;
            let url = "http://localhost:3000/dir/";
    
            if(this.rutas.length != 1){
                path = "";
                for(let i=0;i<this.rutas.length;i++){
                    if(i != 0){
                        path = path + this.rutas[i].name + "-";
                    }
                }
                url = url + path + this.nuevaCarpeta;
            }else{
                url = url + this.nuevaCarpeta;
            }

            await axios({
                method: 'post',
                url: url
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
            });

            this.getTodos();

        }
    }
        
}
</script>

<style lang="stylus" scoped>

</style>