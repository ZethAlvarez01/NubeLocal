function processPath(path){
    const ini = '../public/uploads'
    let cadena = path.split('-');
    path = ini;
    cadena.forEach(element => {
        path = path + '/' + element;
    });
    return path;
}

module.exports = processPath;