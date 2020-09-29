const { Router, json } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const File = require('../model/schema');
const processPath = require('../src/lib/process');
const { log } = require('console');

router.get('/', (req,res) =>{
    res.send("Holaaaa");
});

router.get('/adios', (req,res) =>{
    res.send("adios");
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

        if(req.params.path !== undefined){
            let dir = processPath(req.params.path);
            dirPath = path.join(dirPath,dir);
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