import React, { useState, useEffect } from "react";
import { BiLink } from "react-icons/bi";
import Snackbar from "@mui/joy/Snackbar";

const LinkButton: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [open, setOpen] = React.useState(false);
  const [duration, setDuration] = React.useState<undefined | number>(3000);
  const [left, setLeft] = React.useState<undefined | number>();
  const timer = React.useRef<undefined | number>();
  const countdown = () => {
    timer.current = window.setInterval(() => {
      setLeft((prev) => (prev === undefined ? prev : Math.max(0, prev - 100)));
    }, 100);
  };
  React.useEffect(() => {
    if (open && duration !== undefined && duration > 0) {
      setLeft(duration);
      countdown();
    } else {
      window.clearInterval(timer.current);
    }
  }, [open, duration]);
  const handlePause = () => { window.clearInterval(timer.current); };
  const handleResume = () => { countdown(); };

  return (
    <>
      <BiLink size="20" onClick={() => {
        const linkElement = document.querySelector(`a[href="/forum/${itemId}"]`);
        const link = (linkElement as HTMLAnchorElement).href;
        if (link) navigator.clipboard.writeText(link);
        setOpen(true);
      }} />
      <Snackbar variant="solid" color="success" autoHideDuration={duration} resumeHideDuration={left}
        onMouseEnter={handlePause} onMouseLeave={handleResume} onFocus={handlePause} onBlur={handleResume}
        onUnmount={() => setLeft(undefined)} open={open} onClose={() => setOpen(false)}
        sx={{ color: "white", backgroundColor: "#007a70" }}>
        Link Copied to Clipboard
      </Snackbar>
    </>
  );
};

export default LinkButton;
