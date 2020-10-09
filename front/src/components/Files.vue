<template>
    <div class="Files">
        <h1>Archivos</h1>
        <h1 v-for="(item, i) in rutas" :key="i" @click="checkBack(item.i)">
            {{ item.name }}
        </h1>
        <div class="archivos">
            <div v-for="(item, i) in elementos" :key="i">
                <div v-if="item.type"> {{item.name}} </div>
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
        rutas: [{name: "Home",i:0}]
    }),
    mounted() {
        this.getTodos();
    },
    methods: {
        getTodos(){
            this.elementos = [];
            axios.get("http://localhost:3000/"+this.path)
            .then(response => {
                let arreglo = response.data.elements;
                for(let i=0;i<arreglo.length;i++){
                    console.log(arreglo[i]);
                    let aux = true;
                    if(arreglo[i].type !== 'file'){
                        aux = false;
                    }
                    let elemento = {
                        name: arreglo[i].name,
                        type: aux,
                        path: arreglo[i].path
                    };
                    this.elementos.push(elemento);
                    console.log(elemento);
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
                    console.log(path);
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
                this.getTodos();
            }
        }
    }
        
}
</script>

<style lang="stylus" scoped>

</style>