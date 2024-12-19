const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
