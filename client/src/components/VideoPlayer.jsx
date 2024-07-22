import React, { useContext, useState, useEffect } from 'react';
import { Grid, Typography, Paper, makeStyles, IconButton } from '@material-ui/core';
import { PhoneDisabled } from '@material-ui/icons';
import { SocketContext } from '../Context';

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '100%',
    height: 'auto',
    maxWidth: '600px',
    maxHeight: '400px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '90vw',
      maxHeight: '50vw',
    },
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  paper: {
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#222222',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: '16px',
  },
  typography: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  timer: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '1.2rem',
    fontWeight: '500',
    zIndex: 10,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
  },
  hangUpButton: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    color: '#ffffff',
    backgroundColor: '#dc3545',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    '&:hover': {
      backgroundColor: '#c82333',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
    },
  },
  hangUpIcon: {
    fontSize: '2.5rem',
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, leaveCall } = useContext(SocketContext);
  const classes = useStyles();
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (callAccepted && !callEnded) {
      setStartTime(new Date());
    } else if (callEnded) {
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [callAccepted, callEnded]);

  useEffect(() => {
    let interval;
    if (startTime && !callEnded) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    } else if (callEnded) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startTime, callEnded]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      {stream && (
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.typography}>{name || 'My Video'}</Typography>
            <div className={classes.videoContainer}>
              <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
              {callAccepted && !callEnded && (
                <>
                  <Typography className={classes.timer}>{formatTime(elapsedTime)}</Typography>
                  <IconButton
                    className={classes.hangUpButton}
                    onClick={leaveCall}
                    size="large"
                  >
                    <PhoneDisabled className={classes.hangUpIcon} />
                  </IconButton>
                </>
              )}
            </div>
          </Paper>
        </Grid>
      )}
      {callAccepted && !callEnded && (
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.typography}>{call.name || 'Their Video'}</Typography>
            <div className={classes.videoContainer}>
              <video playsInline ref={userVideo} autoPlay className={classes.video} />
              <Typography className={classes.timer}>{formatTime(elapsedTime)}</Typography>
            </div>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoPlayer;
