import React, { useState, useEffect } from 'react';

function AllUsers() {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => {
          console.error(error);
          setError('Error al cargar los usuarios');
        });
    }, []);
  
    if (error) {
      return <div>{error}</div>;
    } else if (users === null) {
      return <div>Cargando...</div>;
    } else {
      return (
        <div>
          {users.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      );
    }
  }

function User({ username }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/user/${username}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error(error));
  }, [username]);

  if (user === null) {
    return <div>Cargando...</div>;
  } else {
    return <div>{user.name}</div>;
  }
}

function UserAge({ username }) {
  const [age, setAge] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/user/${username}/age`)
      .then(response => response.json())
      .then(data => setAge(data.age))
      .catch(error => console.error(error));
  }, [username]);

  if (age === null) {
    return <div>Cargando...</div>;
  } else {
    return <div>La edad del usuario es {age}</div>;
  }
}

export { AllUsers, User, UserAge };