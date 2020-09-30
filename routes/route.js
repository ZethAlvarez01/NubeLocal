const { Router, json } = require('express');
const router = Router();
const fs = require('fs');
const { unlink } = require('fs-extra');
const path = require('path');
const File = require('../model/schema');
const processPath = require('../src/lib/process');
var rimraf = require("rimraf");
const dirTree = require("directory-tree");

router.get('/', (req,res) =>{
    let dirPath = path.join(__dirname,'../public/uploads');
    const tree = dirTree(dirPath);
    console.log(tree);
    res.json(tree);
});

router.get('/adios', (req,res) =>{
    res.send("adios");
});
//borra carpetas
router.delete('/dir/:path?',(req,res)=>{

    let dirPath = path.join(__dirname,'../public/uploads');
    let createPath = dirPath;
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = processPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }

    const tree = dirTree(dirPath);
    
    //Meter a una funcion recursiva!!!
    for(let i=0;i<tree.children.length;i++){
        console.log(tree.children[i]);
        if(tree.children[i] === 'file'){
            //Bucar archivo y eliminar
        }else{
            //
        }
    }

    return res.json({
        tree: tree
    });
});

//Borra archivos
router.delete('/file/:id/:path?',async (req,res)=>{
    let dirPath = path.join(__dirname,'../public/uploads');
    let createPath = dirPath;
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = processPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }
    if (fs.existsSync(dirPath)) {
        const { id } = req.params;
        const file = await File.findByIdAndDelete(id);
        console.log(file);
        await unlink(path.join(dirPath,file.name));
        return res.json({
            message: 'Archivo borrado',
            name: file.name,
            success: false,
            path: dirPath
        });

    }else{
        return res.status(400).json({
            message: 'Doesnt exist',
            success: false,
            path: dirPath
        });
    }
});

router.post('/:path?', async (req,res) =>{
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            messaje: 'No file uploaded',
            success: false
        })
    }else{
        let f = req.files[Object.keys(req.files)];
        if(f.length === undefined){
             let aux = [];
             aux.push(f);
             f = aux;
        }
    
        let dirPath = path.join(__dirname,'../public/uploads');
        let createPath = dirPath;
        let carpetas = [];

        if(req.params.path !== undefined){
            let dir = processPath(req.params.path);
            dirPath = path.join(dirPath,dir[0]);
            carpetas = dir[1];
        }

        console.log(carpetas);

        if (fs.existsSync(dirPath)) {
            console.log("Existe");
        }else{
            console.log("No existe");

            for(let i=0;i<carpetas.length;i++){
                createPath = path.join(createPath,carpetas[i]);
                if (!fs.existsSync(createPath)) {
                    fs.mkdirSync(createPath);
                }
            }
        }
        
        for(let i=0;i<f.length;i++){
            console.log(dirPath);
            console.log(f[i]);
            let file = new File();
            file.name = f[i].name;
            file.path = dirPath;
            file.mimetype = f[i].size;
            file.md5 = f[i].md5;
            file.created_at = new Date(Date.now());

            await file.save();

            // Mover el archivo a la carpeta 
            f[i].mv(path.join(dirPath,f[i].name),(err)=>{
                if (err) {
                    console.log("Error al mover "+err);
                } else {
                    console.log("Subido");
                }
            });
        }

        return res.json({ 
            message: 'File received',
            success: true,
            path: dirPath
        });
    }
    
});

module.exports = router;