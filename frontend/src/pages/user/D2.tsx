
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../../theme.ts";
// import { Navbar } from "../../components/page-level/user/topnav.tsx";
import DashboardContent from "../../components/page-level/user/DashboardContent.tsx";

const Dashboard: React.FC = () => {
  const mode = "light";

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <DashboardContent />
    </ThemeProvider>
  );
};

export default Dashboard;
