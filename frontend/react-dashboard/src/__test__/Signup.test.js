import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../scenes/signup/index';
import { BrowserRouter } from 'react-router-dom';

test('muestra error si las contraseñas no coinciden', async () => {
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'juan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText(/Confirma Contraseña/i), { target: { value: 'abcdef' } });
  fireEvent.click(screen.getByText(/Crear Cuenta/i));
  expect(await screen.findByText(/Las contraseñas no coinciden/)).toBeInTheDocument();
});
