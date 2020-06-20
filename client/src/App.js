import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

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
      {users.map(user => {
        return <li key = {user.id}>Name: {user.name}<br />Bio: {user.bio}</li>; 
      })}
    </div>
  );
}

export default App;
