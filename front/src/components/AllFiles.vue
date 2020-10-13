<template>
    <div class="Files">

        <div class="nuevoFile">
            
            <h1 class="label">Nueva carpeta</h1>
            <input type="text" v-model="nuevaCarpeta">
            <button v-on:click="crearCarpeta">Crear</button>

            <div id="newfileDir">
                <h1 class="label">Nuevo archivo</h1>
                <div @dragover="dragover" @dragleave="dragleave" @drop="drop">
                    <input v-show="0" type="file" multiple name="fields[assetsFieldHandle][]" id="assetsFieldHandle" 
                    @change="onChange" ref="file" />
                
                    <label for="assetsFieldHandle">
                    <div>
                        Explain to our users they can drop files in here 
                        or <span>click here</span> to upload their files
                    </div>
                    </label>
                    <ul v-if="this.filelist.length" v-cloak>
                    <li v-for="(item,i) in filelist" :key="i">
                        {{ item.name }}<button type="button" @click="remove(filelist.indexOf(item))" title="Remove file">x</button>
                    </li>
                    </ul>
                    <button @click="submitFiles">Subir</button>
                </div>
            </div>
            
        </div>

        <h1>Archivos</h1>

        <div v-for="(item, i) in rutas" :key="i" @click="checkBack(item.i)">
            <h2>{{ item.name }}</h2>
        </div>
        <div class="archivos">
            <div v-for="(item, i) in elementos" :key="i">
                <div v-if="item.type"> 
                    {{item.name}} 
                    <div>
                        <Delete :id="item.id" :path="path" v-on:getTodos="getTodos"/>
                    </div>
                </div>
                <div v-else>
                    <div @click="checkFordward(item.path)">
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                width="661px" height="420px" viewBox="0 0 661 420" enable-background="new 0 0 661 420" xml:space="preserve">
                            <g transform="translate(0.000000,420.000000) scale(0.100000,-0.100000)">
                                <path d="M40,2112.002V20h3282.998h3282.001l-2.998,1747.002c-1.006,960.996-5,1748.999-7.002,1751.997
                                    c-2.998,2.002-549.003,7.002-1212.998,8.999l-1207.998,5L3880,3853.999L3585,4176l-720,6.997
                                    c-396.001,4.004-1193.999,10-1772.002,14.004L40,4202.998V2112.002z M2842.001,4082.998l697.998-5.996l295.996-324.004
                                    L4132.001,3430h927.002c508.994,0,1043.994-2.998,1188.994-7.002l262.002-5.996V1762.998V110H3320H130v1997.002v1995.996
                                    l1007.998-5.996C1692.002,4092.998,2458.999,4087.001,2842.001,4082.998z"/>
                            </g>
                            <polygon fill="#4E4F5A" points="13,409 13,9.7 354,12.3 413.2,77 651,78.3 651,409 "/>
                            <path fill="#4E4F5A" d="M-68,183.5"/>
                            </svg>
                        <DeleteDir :path="path + item.name" v-on:getTodos="getTodos"/>
                    
                        {{item.name}}     
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Delete from "@/components/DeleteFile.vue";
import DeleteDir from "@/components/DeleteDir.vue";

export default {
    name: "Files",
    delimiters: ['${', '}'],
    components: {
        Delete,
        DeleteDir
    },
    data:()=>({
        elementos: [],
        path: "",
        rutas: [{name: "Home",i:0}],
        nuevaCarpeta: null,
        filelist: [],
        aux: 0
    }),
    mounted() {
        this.elementos = [];
        this.getTodos();
    },
    methods: {
         getTodos(){
            this.elementos = [];
                        
            let folderA = [];
            let filesA = [];

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
                
            for(let i=0;i<this.elementos.length;i++){
                if(this.elementos[i].type == false){
                    folderA.push(this.elementos[i]);
                }else{
                    filesA.push(this.elementos[i]);
                }
            }

            this.elementos = folderA.concat(filesA);
                
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
        async submitFiles() {
            if( this.filelist.length == 0 ){
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

            console.log(this.files);
            let url = "http://localhost:3000/";
            if(path != undefined){
                url = url + path;
            }

            var bodyFormData = new FormData();
            for(let i=0;i<this.filelist.length;i++){
                bodyFormData.append('file',this.filelist[i]);
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
            this.filelist = [];
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
                this.nuevaCarpeta = "";
                
            },
            onChange() {
                this.filelist = [...this.$refs.file.files];
            },
            remove(i) {
            this.filelist.splice(i, 1);
            },
            dragover(event) {
            event.preventDefault();
            if (!event.currentTarget.classList.contains('bg-green-300')) {
                event.currentTarget.classList.remove('bg-gray-100');
                event.currentTarget.classList.add('bg-green-300');
            }
            },
            dragleave(event) {
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
            },
            drop(event) {
            event.preventDefault();
            this.$refs.file.files = event.dataTransfer.files;
            this.onChange();
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
            }
    }
        
}
</script>

<style scoped>
    #Capa_1 { 
        height: 63.53px;
        width: 100px;
        cursor: pointer;
        fill: white;
    }

    #Capa_1 polygon:hover{
        fill: #5a84b8;
    }

</style>