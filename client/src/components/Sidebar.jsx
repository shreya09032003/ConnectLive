import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Grid, Container, Paper, InputAdornment, IconButton } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, CheckCircle, Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../Context';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '500px',
    margin: '20px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  copyIcon: {
    cursor: 'pointer',
    color: 'grey',
  },
  tickIcon: {
    color: 'green',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: '100%',
    maxWidth: '200px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '0px',
    textTransform: 'none',
    marginTop: 20,
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    padding: 16,
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  alert: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: 16,
    backgroundColor: '#f8d7da',
    color: 'red',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'opacity 0.5s ease-in-out',
    opacity: 0,
    zIndex: 1000,
    maxWidth: '90%',
    textAlign: 'center',
  },
  alertShow: {
    opacity: 1,
  },
  closeIcon: {
    marginLeft: 8,
  },
  hidden: {
    display: 'none',
  },
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, callUser, callConnected } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false });
  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true); // State for sidebar visibility
  const classes = useStyles();

  useEffect(() => {
    console.log('Call connected:', callConnected);
    if (callConnected) {
      setCalling(false);
      setCallStatus('Call Connected!');
      setSidebarVisible(false); // Hide sidebar when call is connected
    }
  }, [callConnected]);

  useEffect(() => {
    console.log('Call ended:', callEnded);
    if (callEnded) {
      setSidebarVisible(true); // Show sidebar when call ends
    }
  }, [callEnded]);

  const handleCopy = () => {
    if (name.trim() === '') {
      setShowAlert({ message: 'Please enter your name first', show: true });
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleCall = () => {
    if (name.trim() === '') {
      setShowAlert({ message: 'Please enter your name first', show: true });
    } else if (!idToCall.trim()) {
      setShowAlert({ message: 'Please enter a valid ID', show: true });
    } else {
      setCalling(true);
      setCallStatus('Calling...');
      callUser(idToCall);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert({ ...showAlert, show: false });
  };

  return (
    <Container className={`${classes.container} ${!sidebarVisible ? classes.hidden : ''}`}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            {/* Name Input Field */}
            <Grid item xs={12} md={6} className={classes.padding}>
              <TextField
                label="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard text={me} onCopy={handleCopy}>
                        <IconButton>
                          {copiedText ? (
                            <CheckCircle fontSize="medium" className={classes.tickIcon} />
                          ) : (
                            <Assignment fontSize="medium" className={classes.copyIcon} />
                          )}
                        </IconButton>
                      </CopyToClipboard>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Friend's ID Input Field */}
            <Grid item xs={12} md={6} className={classes.padding}>
              <TextField
                label="Your friend's ID"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              <div className={classes.buttonContainer}>
                {!callAccepted || callEnded ? (
                  <Button
                    variant="contained"
                    className={classes.callButton}
                    startIcon={<Phone fontSize="large" />}
                    fullWidth
                    onClick={handleCall}
                    type="button"
                  >
                    {calling ? callStatus : 'Call'}
                  </Button>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
      {/* Alert for error messages */}
      {showAlert.show && (
        <div
          className={`${classes.alert} ${showAlert.show ? classes.alertShow : ''}`}
        >
          {showAlert.message}
          <IconButton
            onClick={handleCloseAlert}
            className={classes.closeIcon}
            size="small"
          >
            <Close />
          </IconButton>
        </div>
      )}
    </Container>
  );
};

export default Sidebar;
