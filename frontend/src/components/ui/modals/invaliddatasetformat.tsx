import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type React from "react";

interface InvalidJsonFileFormatModalInterface {
    properFormat: string;
    showFormatModal: boolean;
    setShowFormatModal: React.Dispatch<React.SetStateAction<boolean>>;
}


export const InvalidJsonFileFormatModal: React.FC<InvalidJsonFileFormatModalInterface> = ({
    setShowFormatModal,
    showFormatModal,
    properFormat
})=> {
    return (
        <Dialog open={showFormatModal} onClose={() => setShowFormatModal(false)}>
                <DialogTitle>Invalid Dataset Format</DialogTitle>
                <DialogContent>
                  <Typography gutterBottom>
                    The dataset does not match the required format:
                  </Typography>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      overflowX: "auto",
                    }}
                  >
                    {properFormat}
                  </pre>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowFormatModal(false)}>Close</Button>
                </DialogActions>
              </Dialog>
    );
}