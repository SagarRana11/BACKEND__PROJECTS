const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    imageURL: {
        type: String,
        required: true
    },
    githubAddress: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Project', ProjectSchema)