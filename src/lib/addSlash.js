function addSlash(path){
    let cadena = path.split("\\");
    let nueva = "";
    for(let i=0;i<cadena.length-1;i++){
        nueva = nueva + cadena[i] + "\\\\";
    }
    nueva = nueva + cadena[cadena.length-1];
    return nueva;
}

module.exports = addSlash;