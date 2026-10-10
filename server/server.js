const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

const app = express()
app.use(express.json());
app.use(cors())

// let students = [
//   {
//     id: 1,
//     name: 'Juan Dela Cruz',
//     course: 'BSIT',
//     age: 20,
//   },
// ]

app.get('/', (req, res) => {
  res.send('Server is running!')
})

// app.get('/students', (req, res) => {
//   res.json(students)
// })

const PORT = 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch ((err) => console.error('MongoDB connection error:', err));

  app.post('/students', async (req, res) => {
    try {
      const { name, course, age } = req.body;
      const newStudent = new Student({ name, course, age });
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.put('/students/:id', async (req, res) => { 
    try {
      const { id } = req.params;
      const { name, course, age } = req.body;
      const updatedStudent = await Student.findByIdAndUpdate(id, { name, course, age }, { new: true });
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.delete('/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });