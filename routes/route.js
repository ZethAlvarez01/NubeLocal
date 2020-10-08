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
router.get('/:path?',(req,res) =>{
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
            element.push(tree.children[i].type);
        }
    
        res.json({
            message: 'success',
            success: false,
            path: dirPath,
            elements: element
        });

    }else{
        res.status(400).json({
            message: 'Doesnt exist',
            success: false,
            path: dirPath
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
        try{
        const file = await File.findByIdAndDelete(id);
        }catch(err){
            return res.status(400).json({
                message: 'Doesnt exist file',
                success: false,
                error: err
            });
        }
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
                return res.status(400).json({
                    message: 'No se pudo guardar',
                    success: false,
                    error: err
                });
            }
            

            // Mover el archivo a la carpeta 
            f[i].mv(path.join(dirPath,f[i].name),(err)=>{
                if (err) {
                    return res.status(400).json({
                        message: 'No se pudo guardar',
                        success: false,
                        error: err
                    });
                } else {
                    return res.json({ 
                        message: 'File received',
                        success: true,
                        path: dirPath
                    });
                }
            });
        }
    }
    
});

module.exports = router;