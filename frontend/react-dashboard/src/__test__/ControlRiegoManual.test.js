import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ControlRiegoManual from "../components/riegoManual";
import axios from "axios";

jest.mock("axios");

test("activa y desactiva el riego correctamente", async () => {
  localStorage.setItem("authToken", "fake-token");
  localStorage.setItem("idDispositivo", "1");

  axios.get.mockResolvedValue({ data: { estadoRiegoActivo: { presente: false } } });
  axios.put.mockResolvedValue({});

  render(<ControlRiegoManual />);
  
  const activarBtn = screen.getByText(/activar riego/i);
  fireEvent.click(activarBtn);

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
  });
});
