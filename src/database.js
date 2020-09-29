const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/localdrive', {
    useNewUrlParser:  true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB conectada'))
    .catch(err => console.log('Error al conectar db'));
