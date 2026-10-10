import React, {useState, useEffect } from 'react';
import axios from 'axios';



function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');

  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000/students';

  useEffect(() => {
    fetchStudents();
  }, []);

const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(editingId) {
        
        await axios.put(`${API_URL}/${editingId}`, { name, course, age });
      }else{
        await axios.post(API_URL, { name, course, age });
      }
      setEditingId(null);
      setName('');
      setCourse('');
      setAge('');
      await fetchStudents();
    }catch (error) {
      console.error('Error saving student:', error);
    }
    };

    const handleEditClick = (student) => {
      setEditingId(student._id);
      setName(student.name);
      setCourse(student.course);
      setAge(student.age);
    };

    const handleDeleteClick = async (id) => {
      try{
        await axios.delete(`${API_URL}/${id}`);
        await fetchStudents();

      }catch (error) {
        console.error('Error deleting student:', error);
      }
    }; 
  return (
    <>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <h3>{editingId ? 'EDIT student' : 'Add New Student'}</h3>
        <div>
          <label>Name: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Course: </label>
          <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />
        </div>
        <div>
          <label>Age: </label>
          <input type="text" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
        {editingId && (<button type="button" onClick={() => {setEditingId(null); setName(''); setCourse(''); setAge('');}}>
          Cancel
        </button>
        )}
      </form>
      <h3>Student List</h3>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.name} - {student.course} - {student.age}
              <button onClick={() => handleEditClick(student)}>Edit</button>
              <button onClick={() => handleDeleteClick(student._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {/* <h2>Add Student</h2>
      <form>
        <div>
          <label htmlFor="name">Name: </label>
          <input id="name" name="name" type="text" />
        </div>
        <div>
          <label htmlFor="course">Course</label>
          <input id="course" name="course" type="text" />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" />
        </div>
        <button type="button">Add Student</button>
      </form>

      <h2>Students</h2>
      <p>No students yet.</p> */}
    </>
  );
}


export default App;
