import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../scenes/dashboard";
import axios from "axios";

jest.mock("axios");

test("renderiza correctamente los sensores del dashboard", async () => {
  const fakeData = {
    data: {
      readings: [
        { tipoSensor: "Temperatura", value: 24.5 },
        { tipoSensor: "HumedadAire", value: 45 },
      ],
    },
  };

  axios.get.mockResolvedValue(fakeData);
  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText("Temperatura")).toBeInTheDocument();
    expect(screen.getByText("HumedadAire")).toBeInTheDocument();
  });
});
