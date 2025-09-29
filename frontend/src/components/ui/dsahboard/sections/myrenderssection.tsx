import React, { useState } from "react";
import { templatesWithTheirIds } from "../../../../data/templateids";
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

interface RenderItem {
  id: string;
  type: "mp4" | "gif" | "webm";
  outputUrl: string;
  templateId?: number;
  [key: string]: any;
}

interface MyRendersSectionProps {
  renders: RenderItem[];
  loading: boolean;
  selectedRenders: string[];
  setSelectedRenders: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteRenders: () => Promise<void>;
}


export const MyRendersSection: React.FC<MyRendersSectionProps> = ({
  renders,
  loading,
  selectedRenders,
  setSelectedRenders,
  handleDeleteRenders,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectAllRenders, setSelectAllRenders] = useState(false);

  if (loading) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body1">Loading renders...</Typography>
    </Box>
  );
  if (!renders || renders.length === 0) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body1">No renders found.</Typography>
    </Box>
  );

  // Filter renders by selected template
  let filteredRenders = selectedTemplateId === "all"
    ? renders
    : renders.filter((r: RenderItem) => r.templateId === selectedTemplateId);

  // Select all renders
  const handleSelectAllRenders = () => {
    if (selectedRenders.length === filteredRenders.length) {
      setSelectedRenders([]);
    } else {
      setSelectedRenders(filteredRenders.map((r) => r.id));
    }
    setSelectAllRenders(!selectAllRenders);
  };

  // Cancel selection
  const handleCancelRenders = () => {
    setSelectedRenders([]);
    setSelectAllRenders(false);
  };

  // Sort renders by date
  filteredRenders = filteredRenders.slice().sort((a, b) => {
    const aDate = a.renderedAt ? new Date(a.renderedAt).getTime() : 0;
    const bDate = b.renderedAt ? new Date(b.renderedAt).getTime() : 0;
    return sortOrder === 'latest' ? bDate - aDate : aDate - bDate;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Sticky header/filter area */}
      <Box sx={{
        width: "100%",
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.paper',
        boxShadow: 1,
        px: 2,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '0 0 12px 12px',
        gap: 2,
      }}>
        <Typography variant="h5" fontWeight={700}>
          My Renders
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="template-filter-label">Filter by template</InputLabel>
            <Select
              labelId="template-filter-label"
              id="template-filter"
              value={selectedTemplateId}
              label="Filter by template"
              onChange={e => setSelectedTemplateId(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              <MenuItem value="all">All</MenuItem>
              {Object.entries(templatesWithTheirIds).map(([id, label]) => (
                <MenuItem key={id} value={id}>{label as string}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-control"
              value={sortOrder}
              label="Sort by"
              onChange={e => setSortOrder(e.target.value as 'latest' | 'oldest')}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="layout-label">Layout</InputLabel>
            <Select
              labelId="layout-label"
              id="layout-control"
              value={layout}
              label="Layout"
              onChange={e => setLayout(e.target.value as 'grid' | 'list')}
            >
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* Scrollable renders grid/list */}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: 2, px: 2 }}>
        {layout === 'grid' ? (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 3,
          }}>
            {filteredRenders.map((render) => {
              const isSelected = selectedRenders.includes(render.id);
              const formattedDate = render.renderedAt
                ? new Date(render.renderedAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';
              return (
                <Box
                  key={render.id}
                  sx={{
                    position: 'relative',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #eee',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#222',
                    maxHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedRenders((prev) =>
                      prev.includes(render.id)
                        ? prev.filter((id) => id !== render.id)
                        : [...prev, render.id]
                    );
                  }}
                >
                  {/* Checkbox overlay */}
                  {(selectedRenders.length > 0) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 3,
                        bgcolor: 'white',
                        p: 0.5,
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ height: '18px', width: '18px', cursor: 'pointer' }}
                      />
                    </Box>
                  )}
                  {/* Overlay details at top */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    background: '#fff',
                    color: 'black',
                    px: 2,
                    pt: 1.5,
                    pb: 1,
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    fontSize: 13,
                  }}>
                    <Typography fontWeight={600} fontSize={14} noWrap>
                      Template: {typeof render.templateId === "number" && templatesWithTheirIds[String(render.templateId)]
                        ? templatesWithTheirIds[String(render.templateId)]
                        : "Unknown Template"}
                    </Typography>
                    <Typography fontWeight={400} fontSize={11} noWrap>
                      Rendered: {formattedDate}
                    </Typography>
                  </Box>
                  {/* Media fills card */}
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                    {render.type === "mp4" || render.type === "webm" ? (
                      <video
                        src={render.outputUrl}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, minHeight: 180, background: '#111' }}
                        preload="metadata"
                      />
                    ) : render.type === "gif" ? (
                      <img
                        src={render.outputUrl}
                        alt="GIF Render"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, minHeight: 180, background: '#111' }}
                      />
                    ) : (
                      <span>Unknown type</span>
                    )}
                  </Box>
                  {/* Download button at top right overlay */}
                  <a
                    href={render.outputUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 3,
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 6px',
                      color: 'black',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                    }}
                    title="Download"
                  >
                    <DownloadIcon style={{ fontSize: 25, marginRight: 2 }} />
                  </a>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredRenders.map((render) => {
              const isSelected = selectedRenders.includes(render.id);
              const formattedDate = render.renderedAt
                ? new Date(render.renderedAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';
              return (
                <Box
                  key={render.id}
                  sx={{
                    position: 'relative',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #eee',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#fff',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedRenders((prev) =>
                      prev.includes(render.id)
                        ? prev.filter((id) => id !== render.id)
                        : [...prev, render.id]
                    );
                  }}
                >
                  {/* Checkbox overlay */}
                  {(selectedRenders.length > 0) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 3,
                        bgcolor: 'white',
                        p: 0.5,
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ height: '18px', width: '18px', cursor: 'pointer' }}
                      />
                    </Box>
                  )}
                  {/* Media thumbnail */}
                  <Box sx={{ width: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: 1, overflow: 'hidden' }}>
                    {render.type === "mp4" || render.type === "webm" ? (
                      <video
                        src={render.outputUrl}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, background: '#111' }}
                        preload="metadata"
                      />
                    ) : render.type === "gif" ? (
                      <img
                        src={render.outputUrl}
                        alt="GIF Render"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, background: '#111' }}
                      />
                    ) : (
                      <span>Unknown type</span>
                    )}
                  </Box>
                  {/* Details */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                    <Typography fontWeight={600} fontSize={15} noWrap>
                     Template Used: {typeof render.templateId === "number" && templatesWithTheirIds[String(render.templateId)]
                        ? templatesWithTheirIds[String(render.templateId)]
                        : "Unknown Template"}
                    </Typography>
                    <Typography fontWeight={400} fontSize={12} noWrap>
                      Rendered at: {formattedDate}
                    </Typography>
                  </Box>
                  {/* Download button */}
                  <a
                    href={render.outputUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 6px',
                      color: 'black',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      marginLeft: 8,
                    }}
                    title="Download"
                  >
                    <DownloadIcon style={{ fontSize: 26, marginRight: 2 }} />
                  </a>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Box>
        {selectedRenders.length > 0 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'white',
              boxShadow: '0px 4px 16px rgba(0,0,0,0.2)',
              borderRadius: '30px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              zIndex: 2000,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {selectedRenders.length} selected
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSelectAllRenders}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              {selectedRenders.length === filteredRenders.length ? 'Unselect All' : 'Select All'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelRenders}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleDeleteRenders}
              sx={{ borderRadius: '20px', textTransform: 'none', minWidth: 80 }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
