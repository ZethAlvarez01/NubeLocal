<template>

<div class="main">

<div class="nuevoFile" id="nuevoFile">
            <div class="cerrarP2" @click="hidden()"> 
                <p class="equisCerrar">X</p>
            </div>
            
            <div class="textNuevoP">
                <h1 class="label letrasC">Nueva carpeta</h1>
                <input type="text" class="txtName" v-model="nuevaCarpeta" placeholder="Nueva carpeta">
                <button v-on:click="crearCarpeta" class="btnCrear">Crear</button>

                <div id="newfileDir">

                    <div @dragover="dragover" @dragleave="dragleave" @drop="drop">
                        <input v-show="0" type="file" multiple name="fields[assetsFieldHandle][]" id="assetsFieldHandle" 
                        @change="onChange" ref="file" />

                        <div class="upload">
                            <label for="assetsFieldHandle">
                            <div style="margin-bottom: 10px;">
                                Puedes arrastrar tus archivos o dar
                                <span style="font-weight: bold;">click aqui</span> para subirlos
                            </div>
                            </label>
                            <ul v-if="this.filelist.length" v-cloak>
                            <li class="space" v-for="(item,i) in filelist" :key="i">
                                {{ item.name }}<button type="button" @click="remove(filelist.indexOf(item))" class="removeFile" title="Remove file">x</button>
                            </li>
                            </ul>
                        </div>
                    </div>
                    <button @click="submitFiles" class="btnUpload">Subir</button>
                </div>
            </div>
            
        </div>
    

    <div class="Files">

        <button id="btnNuevo" @click="mostrar">Nueva</button>

        <div class="navigation">
            <div class="items" v-for="(item, i) in rutas" :key="i" v-bind:class="(i < rutas.length-1)?'borde_act':'borde_bot'" >
                <div class="texto" @click="checkBack(item.i)" v-bind:class="(item.name == 'HOME')?'borde_r':''">
                    {{ item.name }}
                </div>
                <div v-if="i != 0" class="cerrar" @click="checkBack(item.i-1)" >
                    <p class="cerrarP">X</p>
                </div>
            </div>
        </div>
        <div class="body">
            <div class="archivos">
                <div v-for="(item, i) in elementos" :key="i">
                    <div v-if="item.type" class="itemFile"> 
                        
                            <div class="icon">
                                <svg class="file" version="1.1" id="Capa_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    width="651px" height="419px" viewBox="0 0 651 419" enable-background="new 0 0 651 419" xml:space="preserve">
                                <g transform="translate(0.000000,419.000000) scale(0.100000,-0.100000)">
                                    <path d="M28.999,4161L0,4132.001V2095V57.998l28.999-28.994L57.998,0H3255h3197.002l28.994,29.004l29.003,28.994V2095v2037.002
                                        L6480.996,4161L6452.001,4190H3255H57.998L28.999,4161z M6415,2095V95H3255H95l-2.998,1990C91.001,3180,92.002,4081,95,4087.998
                                        c2.998,10,641.001,12.002,3162.001,10L6415,4095V2095z"/>
                                </g>
                                <polygon fill="#4E4F5A" points="9.5,409.5 9.5,10.2 641.5,9.5 641.5,409.5 "/>
                                <path fill="#4E4F5A" d="M-116,86"/>
                                </svg>
                                <p id="FILE_name" class="noselect">FILE</p>
                            </div>
                        <div class="name">
                            {{item.name}} 
                        </div>

                        <div class="oculta">
                            <Delete class="textoo" :id="item.id" :path="path" v-on:getTodos="getTodos"/>
                        </div>

                        <div class="oculta2">
                            <a @click="download(item.path)"> Download</a>
                        </div>

                    </div>
                    <div v-else>
                        <div class="itemFile">
                            <div @click="checkFordward(item.path)" class="icon">
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
                                <div class="name">
                                    {{item.name}}   
                                </div>
                            </div>
                            <div class="oculta">
                                <DeleteDir :path="path + item.name" v-on:getTodos="getTodos"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="myImage"></div>
    </div>
</div>


</template>

<script>
import axios from 'axios'
import Delete from "@/components/DeleteFile.vue";
import DeleteDir from "@/components/DeleteDir.vue";

//const FileDownload = require('js-file-download');

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
        rutas: [{name: "HOME",i:0}],
        nuevaCarpeta: null,
        filelist: [],
        aux: 0
    }),
    mounted() {
        this.elementos = [];
        this.getTodos();
    },
    methods: {
            download(path){

                let path2 = path.split('\\');
                console.log(path2);
                let cad = "";
                for(let i=0;i<path2.length-1;i++){
                    cad = cad + path2[i] + "-";
                }
                cad = cad + path2[path2.length-1];

    let url = "http://localhost:3000/download/"+cad;
    let method = 'GET';

            axios
                .request({
                    url,
                    method,
                    responseType: 'blob', //important
                })
                .then(({ data }) => {
                    const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', path2[path2.length-1]); //any other extension
                    //document.body.appendChild(link);
                    link.click();
                    link.remove();
                });

                

            },
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
            this.rutas = [{name: "HOME",i:0}];
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
                this.rutas = [{name: "HOME",i:0}];
                this.getTodos();
            }else{
                let cad = "";
                let aux = [{name: "HOME",i:0}];
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
            this.hidden();
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
            },
            mostrar(){
                let nuevo =  document.getElementById("nuevoFile");
                nuevo.classList.add('mostrar');
            },
            hidden(){
                let nuevo =  document.getElementById("nuevoFile");
                nuevo.classList.remove('mostrar');
            }
    }
        
}
</script>

<style scoped>

    .Files{
        display: flex;
        flex-flow: column;
        align-items: flex-end;
    }

    #Capa_1 { 
        height: 63.53px;
        width: 100px;
        cursor: pointer;
        fill: white;
    }

    #Capa_1 polygon {
        fill: #232429;
    }

    #Capa_2 polygon {
        fill: #232429;
    }

    #Capa_1 polygon:hover{
        fill: #ff71dc;
        transition: 0.3s;
    }

    #Capa_2 { 
        height: 63.53px;
        width: 100px;
        cursor: pointer;
        fill: rgba(255, 255, 255, 0.6);
    }
    
    #Capa_2 polygon:hover{
        fill: rgba(255, 255, 255, .7);
        transition: 0.3s;
    }

    #FILE_name{
        margin-top: -20px;
        margin-left: 5px;
        position: absolute;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
    }

    .navigation{
        width: 97%;
        min-width: 97vw;
        background: #232429;
        margin: 0 auto;
        display: flex;
        flex-flow: row;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        margin-top: 30px;
    }

    .navigation .items{
        /*display: inline-block;*/
        text-align: left;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        width: 200px;
        font-size: 14px;
        justify-content: space-between;
    }

    .items{
        display: flex;
        flex-flow: row;
        margin-bottom: -1px;
        z-index: 10;
    }

    .body{
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        border-left: 1px solid rgba(255, 255, 255, 0.5);
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        margin: 0 auto;
        width: 96.9%;
        min-width: 96.9vw;
        min-height: 70vh;
        margin-top: -1px;
        z-index: 100;
    }

    .archivos{
        box-sizing: border-box;
        margin: 0 auto;
        padding: 10px;
        z-index: -1px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .texto{
        display: inline;
        padding: 15px 45% 5px 10px;
        cursor: pointer;
        overflow: hidden;
    }
    
    .cerrar{
        display: inline;
        box-sizing: border-box;
        text-align: center;
        padding: 15px 0px 2px 0px;
        cursor: pointer;
        font-weight: bold;
    }

    .borde_bot{
        border-bottom: 1px solid #232429;
    }

    .borde_act{
        border-bottom: none;
    }

    .oculta{
        box-sizing: border-box;
        background: #232429;
        display: block;
        width: 80%;
        margin: 0 auto;
        text-align: center;
        cursor: pointer;
        margin-top:0px;
        border-radius: 4px;
        padding: 5px;
        }

    .oculta:hover{
        background: rgba(255, 0, 0, 0.5);
    }

    .oculta2{
        box-sizing: border-box;
        background: #232429;
        display: block;
        width: 80%;
        margin: 0 auto;
        text-align: center;
        cursor: pointer;
        margin-top:5px;
        border-radius: 4px;
        padding: 5px;
        }

    .oculta2:hover{
        background: rgb(0, 189, 25);
    }

    .borde_r{
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }

    .itemFile{
        font-size: 14px;
        display: flex;
        flex-flow: column;
        padding: 5px;
        width: 120px;
        height: 150px;
        align-items: center;
        
    }

    .name{
        width: 90px; 
        overflow: hidden;
        padding: 5px;
    }

    #btnNuevo{
        width: 150px;
        height: 40px;
        background: #fd42ce;
        border-radius: 5px;
        color: white;
        border: none;
        margin: 15px;
        text-transform: uppercase;
    }

    #btnNuevo:hover{
        background: #fd42ced0;
        transition: 0.3s;
    }

    .main{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .equisCerrar{
        display: block;
        padding: 10px 10px 10px 10px;
        border-radius: 5px;
    }

    .cerrarP2{
        background: #232429;
        margin: 0px 10px 30px 10px;
        cursor: pointer;
    }

    .nuevoFile{
        border-radius: 5px;
        /*#4e4f5a*/
        background: #232429;
        position: absolute;
        z-index: 200;
        display: none;
        flex-flow: column;
        align-items: flex-end;
        padding: 20px;
        height: 330px;
        border: 1px solid rgba(255, 255, 255, 0.5);;
    }

    .upload{
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.5);
        width: 600px;
        height: 150px;
        overflow: hidden;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        padding: 25px 20px;
    }

    .btnUpload{
        background: #fd42ce;
        cursor: pointer;
        padding: 10px 25px 10px 25px;
        border-radius: 5px;
        border: none;
        color: white;
        margin-top: 20px;
        text-transform: uppercase;
    }

    .btnUpload:hover{
        background: #fd42ced0;
        transition: 0.3s;
    }

    #newfileDir{
        margin-top: 20px;
    }

    .letrasC{
        font-size: 25px;
        font-weight: bold;
        color: #fd42ce;
        text-transform: uppercase;
        margin-top: -50px;
        margin-bottom: 10px;
        width: 50%;
    }

    .btnCrear{
        background: #fd42ce;
        cursor: pointer;
        padding: 5px 25px 5px 25px;
        border-radius: 5px;
        border: none;
        color: white;
        margin-top: 14px;
        text-transform: uppercase;
    }

    .btnCrear:hover{
        background: #fd42ced0;
        transition: 0.3s;
    }

    .txtName{
        border-radius: 5px;
        padding: 5px 3px 5px 3px;
        border: none;
        margin-right: 10px;
    }

    ::placeholder {
    color: rgba(0, 0, 0, 0.3);
    opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(0, 0, 0, 0.3);
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
        color: rgba(0, 0, 0, 0.3);
    }

    .removeFile{
        background: #fd42ce;
        cursor: pointer;
        padding: 4px 8px 4px 8px;
        border-radius: 5px;
        border: none;
        color: white;
        margin-left: 10px;
        text-transform: uppercase;
    }

    .removeFile:hover{
        background: #fd42ced0;
        transition: 0.3s;
    }

    .space{
        margin-top: 5px;
        font-size: 12px;
    }

    .mostrar{
        display: flex;
    }

    .cerrarP{
        margin-right: 15px;
    }

    
</style>