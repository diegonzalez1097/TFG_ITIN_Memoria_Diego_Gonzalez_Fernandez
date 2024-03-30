import React, { useEffect, useState } from 'react';

function ServerCheck() {
  const [isServerAlive, setIsServerAlive] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:3000/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsServerAlive(true);
      })
      .catch(error => {
        console.error('Error al conectar al servidor:', error);
        setIsServerAlive(false);
      });
  }, []);

  if (isServerAlive === null) {
    return <div>Comprobando conexión con el servidor...</div>;
  }

  return (
    <div>
      {isServerAlive ? 'Conexión exitosa con el servidor.' : 'No se pudo conectar con el servidor.'}
    </div>
  );
}

export default ServerCheck;