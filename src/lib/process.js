function processPath(path){
    let cadena = path.split('-');
    let dir='';
    cadena.forEach(element => {
        dir = dir + '/' + element;
    });
    return dir;
}

module.exports = processPath;