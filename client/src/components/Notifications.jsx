import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Backdrop, Fade, makeStyles, Typography } from '@material-ui/core';
import { SocketContext } from '../Context';

// If using public directory
const ringtone = new Audio('/ringtone.mp3'); // Path is relative to the public directory

// If using src/assets (uncomment and adjust path if using this method)
// import ringtoneSrc from '../assets/ringtone.mp3';
// const ringtone = new Audio(ringtoneSrc);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Notifications = () => {
  const { answerCall, declineCall, call, callAccepted } = useContext(SocketContext);
  const [showEndNotification, setShowEndNotification] = useState(false);
  const [showCallNotification, setShowCallNotification] = useState(false);
  const classes = useStyles();

  // Function to play ringtone
  const playRingtone = () => {
    if (ringtone) {
      ringtone.play().catch((error) => {
        console.error('Error playing ringtone:', error);
      });
    }
  };

  // Function to stop ringtone
  const stopRingtone = () => {
    if (ringtone) {
      ringtone.pause();
      ringtone.currentTime = 0; // Reset playback position
    }
  };

  // Handle ringtone end event
  useEffect(() => {
    const handleRingtoneEnd = () => {
      setShowEndNotification(true); // Show call ended notification
      stopRingtone(); // Ensure ringtone stops
      setShowCallNotification(false); // Hide incoming call notification
    };

    ringtone.addEventListener('ended', handleRingtoneEnd);

    return () => {
      ringtone.removeEventListener('ended', handleRingtoneEnd);
    };
  }, []);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      playRingtone();
      setShowCallNotification(true); // Show incoming call notification
    } else if (callAccepted || !call.isReceivingCall) {
      stopRingtone();
      setShowCallNotification(false); // Hide incoming call notification
      setShowEndNotification(false); // Hide call ended notification if applicable
    }
  }, [call.isReceivingCall, callAccepted]);

  return (
    <>
      {/* Incoming Call Notification */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={showCallNotification}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showCallNotification}>
          <div className={classes.paper}>
            <Typography variant="h6" id="transition-modal-title">{call.name} is calling...</Typography>
            <div className={classes.buttonContainer}>
              <Button variant="contained" color="primary" onClick={answerCall} className={classes.button}>
                Answer
              </Button>
              <Button variant="contained" color="secondary" onClick={declineCall} className={classes.button}>
                Decline
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>

      {/* Call Ended Notification */}
      <Modal
        aria-labelledby="call-ended-title"
        aria-describedby="call-ended-description"
        className={classes.modal}
        open={showEndNotification}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showEndNotification}>
          <div className={classes.paper}>
            <Typography variant="h6" id="call-ended-title">Call ended</Typography>
            <Button variant="contained" color="secondary" onClick={() => setShowEndNotification(false)} className={classes.button}>
              Close
            </Button>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default Notifications;
