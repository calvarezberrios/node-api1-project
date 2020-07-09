import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';
import { TextField, Button, makeStyles, Collapse } from "@material-ui/core";
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: "250px",
    margin: "0 auto",
  },
  inputFields: {
    width: "100%",
    margin: theme.spacing(1),
    background: "#fff",
  },
  formButtons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const initialValues = {
  name: "",
  bio: ""
}

function App() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null)

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();

      if(!isEditing) {
      axios.post("http://localhost:5000/api/users", values)
        .then(res => {
          setUsers([...users, res.data]);
          setValues(initialValues);
          setShowForm(false);
          setError(null);
        })
        .catch(err => {
          if(err.response.data.errorMessage) setError(err.response.data);
          else setError({errorMessage: err.message});
        });
      } else {
        axios.put(`http://localhost:5000/api/users/${values.id}`, values)
          .then(res => {
            setUsers(users.map(user => {
              if(user.id === res.data.id) {
                return res.data;
              }
              return user;
            }));
            setValues(initialValues);
            setIsEditing(false);
            setShowForm(false);
            setError(null);
          })
          .catch(err => {
            if(err.response.data.errorMessage) setError(err.response.data);
            else setError({errorMessage: err.message});
          });
      }
  }

  const remove = user => {
    axios.delete(`http://localhost:5000/api/users/${user.id}`)
      .then(res => {
        setUsers(users.filter(user => user !== res.data));
        getUsers();
        setError(null);
      })
      .catch(err => {
        if(err.response.data.errorMessage) setError(err.response.data);
        else setError({errorMessage: err.message});
      });
  }

  const edit = user => {
    setValues(user);
    setIsEditing(true);
    setShowForm(true);
  }

  const cancelForm = e => {
    e.preventDefault();

    setValues(initialValues);
    setIsEditing(false);
    setShowForm(false);
    setError(null);
  }

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then(res => {
        setUsers(res.data);
        setError(null);
      })
      .catch(err => {
        if(err.response.data.errorMessage) setError(err.response.data);
        else setError({errorMessage: err.message})
      });
  }

  return (
    <div className="App">
      <h1>My Users API (My Very First API)</h1>

      <Button variant = "contained" onClick = {() => setShowForm(!showForm)}>{!showForm ? "Add User" : "Close Form"}</Button>
      <Collapse in = {showForm} timeout = "auto" unmountOnExit>
        <form className = {classes.formContainer} onSubmit = {handleSubmit} autoComplete = "off">
          <TextField variant = "outlined" className = {classes.inputFields} id = "nameInput" type = "text" name = "name" value = {values.name} onChange = {handleChange} label = "User's Name" />
          <TextField variant = "outlined" className = {classes.inputFields} multiline rows = {4} id = "bioInput" name = "bio" value = {values.bio} onChange = {handleChange} label = "User's Bio" />
          
          <div className = {classes.formButtons}>
            <Button variant = "contained" type = "submit">{isEditing ? "Save Edit" : "Add User"}</Button>
            <Button variant = "contained" onClick = {cancelForm}>Cancel</Button>
          </div>
        </form>

      </Collapse>

      <div className = "users-container">
        {users.length > 0 && users.map(user => {
          return (
            <div key = {user.id} className = "user-card">
              <h3>{user.name}</h3>
              <p>{user.bio}</p>
              <button onClick = {() => edit(user)}>Edit</button>
              <button onClick = {() => remove(user)}>Delete</button>
            </div>
          );
        })}
        {
          users.length === 0 && <h3>Loading user cards...</h3>
        }
        
      </div>
      {error && <p style = {{color: "red", fontSize: 11}}>{error.errorMessage}</p>}
      
    </div>
  );
}

export default App;
