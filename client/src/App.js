import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

const initialValues = {
  name: "",
  bio: ""
}

function App() {
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();

    if(values.name && values.bio) {
      if(!isEditing) {
      axios.post("http://localhost:5000/api/users", values)
        .then(res => {
          setUsers(res.data);
          setValues(initialValues);
        })
        .catch(err => {
          console.log(err.response.data.errorMessage, err.response.status);
          if(err.response.data.errorMessage) {
            alert(err.response.data.errorMessage);
          }
        });
      } else {
        axios.put(`http://localhost:5000/api/users/${values.id}`, values)
          .then(res => {
            setUsers(res.data);
            setValues(initialValues);
            setIsEditing(false);
          })
          .catch(err => {
            console.log(err.response.data.errorMessage, err.response.status);
            if(err.response.data.errorMessage) {
              alert(err.response.data.errorMessage);
            }
          });
      }
    }
  }

  const remove = user => {
    axios.delete(`http://localhost:5000/api/users/${user.id}`)
      .then(res => {
        setUsers(res.data.users);
        setValues(res.data.removed);
      })
      .catch(err => {
        console.log(err.response.data.errorMessage, err.response.status);
        if(err.response.data.errorMessage) {
          alert(err.response.data.errorMessage);
        }
      });
  }

  const edit = user => {
    setValues(user);
    setIsEditing(true);
  }

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err.response.data, err.message);
      });
  }, []);

  return (
    <div className="App">
      <h1>My Users API (My Very First API)</h1>
      <div className = "users-container">
        {users.map(user => {
          return (
            <div key = {user.id} className = "user-card">
              <h3>{user.name}</h3>
              <p>{user.bio}</p>
              <button onClick = {() => edit(user)}>Edit</button>
              <button onClick = {() => remove(user)}>Delete</button>
            </div>
          );
        })}
      </div>

      <form onSubmit = {handleSubmit}>
        <input type = "text" name = "name" value = {values.name} onChange = {handleChange} placeholder = "User's Name" /><br />
        <textarea name = "bio" value = {values.bio} onChange = {handleChange} placeholder = "User's Bio" /><br />
        <button>Submit</button><br />
      </form>
    </div>
  );
}

export default App;
