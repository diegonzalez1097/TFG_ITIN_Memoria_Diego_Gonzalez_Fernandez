import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LecturasComponent from '../scenes/lecturas/LecturasComponent';
import axios from 'axios';
jest.mock('axios');

test('muestra correctamente la tabla de lecturas', async () => {
  axios.get.mockResolvedValue({ data: { lecturas: [{ idLectura: 1, tipoSensor: 'Temperatura', valor: 23.5, fechaHora: new Date().toISOString() }] } });
  render(<LecturasComponent />);
  expect(await screen.findByText('Temperatura')).toBeInTheDocument();
});

test('maneja error de API al obtener lecturas', async () => {
  axios.get.mockRejectedValue(new Error('Error de red'));
  render(<LecturasComponent />);
  await waitFor(() => expect(screen.queryByText('Error al cargar las lecturas:')).not.toBeNull());
});
