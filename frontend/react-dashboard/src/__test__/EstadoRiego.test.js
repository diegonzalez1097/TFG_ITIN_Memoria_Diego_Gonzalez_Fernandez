import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EstadoRiego from "../components/regandoEst";

beforeEach(() => {
  localStorage.setItem("authToken", "fake-token");
  localStorage.setItem("idDispositivo", "1");
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ resultadoRiego: true }),
    })
  );
});

test("muestra el estado activo del riego", async () => {
  render(<EstadoRiego />);
  await waitFor(() => {
    expect(screen.getByText(/activo/i)).toBeInTheDocument();
  });
});
