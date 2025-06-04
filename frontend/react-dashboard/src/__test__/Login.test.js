import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../scenes/login";
import { AuthProvider } from "../authContext";
import { BrowserRouter } from "react-router-dom";

test("muestra error si los campos están vacíos", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );

  const loginButton = screen.getByText(/iniciar sesión/i);
  fireEvent.click(loginButton);

  expect(screen.getByText(/requerido/i)).toBeInTheDocument();
});
