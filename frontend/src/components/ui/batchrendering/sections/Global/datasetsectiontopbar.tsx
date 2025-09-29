import { Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type React from "react";
import DatasetIcon from "@mui/icons-material/Dataset";
import TableViewIcon from "@mui/icons-material/TableView";
import CodeIcon from "@mui/icons-material/Code";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface DatasetTopbarInterface {
  activeSource: "ai" | "user";
  setActiveSource: React.Dispatch<React.SetStateAction<"ai" | "user">>;
  displayLayout: "table" | "json";
  setDisplayLayout: React.Dispatch<React.SetStateAction<"table" | "json">>;
}

export const DatasetTopbar: React.FC<DatasetTopbarInterface> = ({
  activeSource,
  setActiveSource,
  displayLayout,
  setDisplayLayout,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        p: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ToggleButtonGroup
        value={activeSource}
        exclusive
        onChange={(_, val) => val && setActiveSource(val)}
        size="small"
      >
        <ToggleButton value="ai">
          <AutoAwesomeIcon sx={{ mr: 1 }} /> APIs and AI generated        </ToggleButton>
        <ToggleButton value="user">
          <DatasetIcon sx={{ mr: 1 }} /> Your datasets
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={displayLayout}
        exclusive
        onChange={(_, val) => val && setDisplayLayout(val)}
        size="small"
      >
        <ToggleButton value="table">
          <TableViewIcon sx={{ mr: 1 }} /> Table
        </ToggleButton>
        <ToggleButton value="json">
          <CodeIcon sx={{ mr: 1 }} /> JSON
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
};
