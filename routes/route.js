const { Router, json } = require('express');
const router = Router();
const fs = require('fs');
const fileupload = require('express-fileupload')
const processPath = require('../src/lib/process')

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

        let dirPath = req.params.path;
        if(dirPath === undefined){
            dirPath = "../public/uploads";
        }else{
            dirPath = processPath(dirPath);
        }

        let files = req.files.file;
        if (!Array.isArray(files)) {
            files = [files];
        }

        ////Mover archivos

        console.log(dirPath)


        return res.json({ 
            message: 'File received',
            success: true,
            path: dirPath
        });
    }
    
});

module.exports = router;