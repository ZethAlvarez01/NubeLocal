function processPath(path){
    let arreglo = [];
    let cadena = path.split('-');
    let dir='';
    cadena.forEach(element => {
        dir = dir + '/' + element;
    });
    arreglo.push(dir);
    arreglo.push(cadena);
    return arreglo;
}

module.exports = processPath;