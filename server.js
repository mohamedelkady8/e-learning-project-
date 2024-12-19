const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Course = require('./models/course');
const Teacher = require('./models/Teacher');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/e-learning', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes for Courses

// Create a new course
app.post('/courses', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all courses or filter by title
app.get('/courses', async (req, res) => {
    try {
        const filter = req.query.title ? { title: new RegExp(req.query.title, 'i') } : {};
        const courses = await Course.find(filter);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single course by ID
app.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a course
app.put('/courses/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Routes for Teachers

// Create a new teacher
app.post('/teachers', async (req, res) => {
    try {
        const newTeacher = new Teacher(req.body);
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all teachers or filter by name
app.get('/teachers', async (req, res) => {
    try {
        const filter = req.query.name ? { name: new RegExp(req.query.name, 'i') } : {};
        const teachers = await Teacher.find(filter);
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single teacher by ID
app.get('/teachers/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a teacher
app.put('/teachers/:id', async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a teacher
app.delete('/teachers/:id', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
