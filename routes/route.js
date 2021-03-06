const { Router, json } = require('express');
const router = Router();
const fs = require('fs');
const fsp = require('fs').promises;
const { unlink } = require('fs-extra');
const path = require('path');
const File = require('../model/schema');
const splitPath = require('../src/lib/splitPath');
const addSlash = require('../src/lib/addSlash');
var rimraf = require("rimraf");
const dirTree = require("directory-tree");
const { log } = require('console');


router.get('/all', async (req,res)=>{

    const file = await File.find().sort({_id: -1});
    console.log(file);

    return res.json({
        message: "All Files",
        file: file,
        status: true
    });
});

//Get de rutas y archivos
router.get('/:path?', async (req,res) =>{
    let dirPath = path.join(__dirname,'../public/uploads');
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = splitPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }

    if (fs.existsSync(dirPath)) {
        const tree = dirTree(dirPath);
        console.log(tree);
    
        let element = [];

        for(let i=0;i<tree.children.length;i++){
            if(tree.children[i].type == 'file'){
                let auxName = tree.children[i].name;
                let pathAux = tree.path;
                if(pathAux.split("\\").length > 7){
                    let aux = pathAux.split("\\");
                    let aux2 = ""; 
                    for(let j=0;j<aux.length-2;j++){
                        aux2 = aux2 + aux[j] + "\\";
                    }
                    aux2 = aux2 + aux[aux.length-2];
                    pathAux = aux2;
                }
                console.log(pathAux);
                try{
                    const file = await File.find({"path": pathAux,"name":auxName});
                    console.log(file[0].id);
                    let data = {
                        type: tree.children[i].type,
                        name: tree.children[i].name,
                        path: tree.children[i].path,
                        id: file[0].id
                    };
                    element.push(data);
                }catch(e){
                    console.log("ErrorWahat "+e);
                }
                
            }else{
                let data = {
                    type: tree.children[i].type,
                    name: tree.children[i].name,
                    path: tree.children[i].path,
                    id: "null"
                };
                element.push(data);
            }
        }
    
        res.json({
            message: 'success',
            success: false,
            path: dirPath,
            elements: element
        });

    }else{
        res.json({
            message: 'Doesnt exist',
            success: false,
            path: dirPath,
            elements: []
        });
    }
    
});

router.get('/file/:id', async (req,res)=>{
    const idFile = req.params.id;

    const file = await File.find({_id: idFile});
    console.log(file);

    return res.json({
        message: idFile,
        file: file,
        status: true
    });
});

router.get('/adios', (req,res) =>{
    res.send("adios");
});
//borra carpetas
router.delete('/dir/:path', async (req,res)=>{

    let dirPath = path.join(__dirname,'../public/uploads');
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = splitPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }

    const tree = dirTree(dirPath);
    
    console.log(tree);
    console.log(fs.existsSync(dirPath));
    console.log(carpetas);

    let dirPath2 = addSlash(dirPath);

    if (fs.existsSync(dirPath)) {
        console.log(dirPath2);
        try{
            const file = await File.remove({ "path": {$regex: "^"+dirPath2}});    
            console.log(file);
        }catch(err){
            return res.status(400).json({
                message: 'No se pudo borrar',
                success: false,
                error: err
            });
        }

        rimraf(dirPath, function () { 
            console.log('done'); 
        }); 

        return res.json({
            message: 'Carpeta borrada',
            success: true,
            path: dirPath
        });

    }else{
        
        console.log("No existe "+dirPath)
        return res.status(400).json({
            message: 'Doesnt exist',
            success: false,
            path: dirPath
        });
    }

});

//Borra archivos
router.delete('/file/:id/:path?',async (req,res)=>{
    let dirPath = path.join(__dirname,'../public/uploads');
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = splitPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }
    if (fs.existsSync(dirPath)) {
        const { id } = req.params;
        let file = null;
        try{
        file = await File.findByIdAndDelete(id);
        }catch(err){
            return res.status(400).json({
                message: 'Doesnt exist file',
                success: false,
                error: err
            });
        }
        console.log(file);
        try{
            await unlink(path.join(dirPath,file.name));
        }catch(e){
            console.log("Error "+e)
        }
        
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

router.post('/dir/:path',(req,res)=>{
    let dirPath = path.join(__dirname,'../public/uploads');
    let createPath = dirPath;
    let carpetas = [];

    if(req.params.path !== undefined){
        let dir = splitPath(req.params.path);
        dirPath = path.join(dirPath,dir[0]);
        carpetas = dir[1];
    }

    console.log(carpetas);

        if (!fs.existsSync(dirPath)) {
            console.log("No existe");

            for(let i=0;i<carpetas.length;i++){
                createPath = path.join(createPath,carpetas[i]);
                if (!fs.existsSync(createPath)) {
                    fs.mkdirSync(createPath);
                }
            }
            console.log("Creada "+dirPath);
        }

    return res.json({
        message: 'Carpetas creadas'
    });


});

router.post('/:path?', async (req,res) =>{
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            message: 'No file uploaded',
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
            let dir = splitPath(req.params.path);
            dirPath = path.join(dirPath,dir[0]);
            carpetas = dir[1];
            ///asafasfa
        }

        console.log(carpetas);

        if (!fs.existsSync(dirPath)) {
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

            try{
                await file.save();
            }catch(err){
                res.status(400).json({
                    messaje: "Error al guardar los archivos",
                    status: false,
                    error: err
                });
            }
            
            // Mover el archivo a la carpeta 
            f[i].mv(path.join(dirPath,f[i].name),(err)=>{
                if (err) {
                    res.status(400).json({
                        messaje: "Error al subir archivos",
                        status: false,
                        error: err
                    });
                }
            });
        }

        return res.json({
            messaje: "Archivos subidos",
            status: true
        });
        
    }
    
});

router.get('/download/:path', (req,res)=>{
    let path2 = req.params.path.split('-');
                console.log(path2);
                let cad = "";
                for(let i=0;i<path2.length-1;i++){
                    cad = cad + path2[i] + "\\";
                }
                cad = cad + path2[path2.length-1];

                res.download(cad);
});

module.exports = router;