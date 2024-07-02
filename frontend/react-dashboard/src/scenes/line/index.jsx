import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChartSensor from "../../components/chart";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChartSensor />
      </Box>
    </Box>
  );
};

export default Line;
