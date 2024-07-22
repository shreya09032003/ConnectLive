import React, { useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';

const CopyToClipboard = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the state after 2 seconds
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
        <IconButton onClick={handleCopy} color="primary">
          {copied ? <CheckCircle /> : <ContentCopy />}
        </IconButton>
      </Tooltip>
      {copied && (
        <Typography variant="body2" style={{ marginLeft: '8px' }}>
          Copied
        </Typography>
      )}
    </div>
  );
};

export default CopyToClipboard;
