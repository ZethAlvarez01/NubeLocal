const {Schema, model} = require('mongoose');

const fileSchema = new Schema({
    name: {type: String},
    path: {type: String},
    mimetype: {type: String},
    size: {type: Number},
    md5: {type: String},
    created_at:{ type: Date, default: new Date(Date.now())}
});

module.exports = model('File', fileSchema);