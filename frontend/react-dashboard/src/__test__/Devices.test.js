import React from "react";
import { render, screen } from "@testing-library/react";
import Devices from "../scenes/devices";
import axios from "axios";

jest.mock("axios");

test("muestra la tabla de dispositivos", async () => {
  localStorage.setItem("userId", "1");
  axios.get.mockResolvedValue({
    data: [
      { idDispositivo: 1, nombre: "ADR1", ubicacion: "Avilés", mac: "00:11:22" },
    ],
  });

  render(<Devices />);
  expect(await screen.findByText("ADR1")).toBeInTheDocument();
});
