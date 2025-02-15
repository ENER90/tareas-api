const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Title is required"]
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'In Revision', 'Done'],
        default: 'To Do'
    },
    asignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Person',
        required: true
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null // Null significa que la tarea no ha sido eliminada 
    }
});

// Middleware para actualizar `updatedAt` antes de cada `save`
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware para actualizar `updatedAt` antes de cada `findOneAndUpdate`
taskSchema.pre('findOneAndUpdate', function (next) {
    this.set({updatedAt: Date.now()});
    next();
});

module.exports = mongoose.model('Task', taskSchema);
