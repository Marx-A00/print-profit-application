import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function MyAccountPageForm({ setIsForm }) {
  const dispatch = useDispatch();

  const profileUser = useSelector((store) => store.user.profileUserReducer);
  const userEmail = useSelector((store) => store.user.editUserEmail);
  const userName = useSelector((store) => store.user.editUserName);
  const [invalidText, setInvalidText] = useState('');

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_PROFILE_PAGE_USER' });
  }, [dispatch]);

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newVerifyPasswordInput, setNewVerifyPasswordInput] = useState('');
  const [openComfirmation, setOpenComfirmation] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);

  // Opens Discard Dialog
  const handleDiscardClickOpen = () => {
    setOpenDiscard(true);
  };

  // Closes Discard Dialog
  const handleDiscardClose = () => {
    setOpenDiscard(false);
  };

  // Opens Comfirmation Dialog
  const handleComfirmationClickOpen = () => {
    if (
      userName.name &&
      userEmail.email &&
      newPasswordInput === newVerifyPasswordInput &&
      (newPasswordInput.length >= 8 || newPasswordInput.length === 0)
    ) {
      setOpenComfirmation(true);
      // setInvalidText('');
    } else {
      setInvalidText('Invalid, please insert valid information');
    }
  };

  // Closes Comfirmation Dialog
  const handleComfirmationClose = () => {
    setOpenComfirmation(false);
  };

  // sends you back to users info
  const discardChanges = () => {
    dispatch({
      type: 'FETCH_USER',
    });
    setOpenDiscard(false);
    setIsForm(false);
  };

  // changes email redux state when entering info
  const handleEmailChange = (newEmail) => {
    dispatch({
      type: 'CHANGE_EMAIL',
      payload: newEmail,
    });
  };

  // changes name redux state when entering info
  const handleNameChange = (newName) => {
    dispatch({
      type: 'CHANGE_NAME',
      payload: newName,
    });
  };

  // Sends dispatch to save the users info
  const saveNewUserInfo = () => {
    if (newPasswordInput === '' || newPasswordInput.length < 8) {
      console.log('no password');
      dispatch({
        type: 'SAGA_EDIT_USERS_INFO',
        payload: {
          newEmailInput: userEmail.email,
          newNameInput: userName.name,
        },
      });
    } else {
      console.log('password');
      dispatch({
        type: 'SAGA_EDIT_USERS_INFO',
        payload: {
          newEmailInput: userEmail.email,
          newNameInput: userName.name,
          newPasswordInput: newPasswordInput,
        },
      });
    }
    setNewPasswordInput('');
    setNewVerifyPasswordInput('');
    setOpenComfirmation(false);
    setIsForm(false);
  };

  return (
    <div className="accountPageForm">
      <h3 className="invalidHeader">{invalidText}</h3>
      <form marginTop={2}>
        <section>
          <FormLabel sx={{ mt: 5 }}>Name:</FormLabel>

          <TextField
            variant="outlined"
            type="text"
            name="name"
            placeholder={profileUser.name}
            value={userName.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            label="New Name"
            color={userName.name === '' ? 'error' : ''}
            helperText={
              userName.name === '' ? 'you must enter a valid name' : ''
            }
            sx={{
              mt: 5,
              width: '20ch',
            }}
          />
        </section>

        <section>
          <FormLabel
            sx={{
              mt: 2,
            }}
          >
            Email:
          </FormLabel>
          <TextField
            variant="outlined"
            type="email"
            name="email"
            placeholder={profileUser.email}
            value={userEmail.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            color={userEmail.email === '' ? 'error' : ''}
            helperText={
              userEmail.email === '' ? 'you must enter a valid email' : ''
            }
            required
            label="New Email"
            sx={{
              mt: 2,
              width: '20ch',
            }}
          />
        </section>

        <section>
          <FormLabel
            sx={{
              mt: 2,
            }}
          >
            New Password:
          </FormLabel>

          <TextField
            variant="outlined"
            type="password"
            name="password"
            placeholder={'password'}
            color={
              newPasswordInput.length < 8 && newPasswordInput !== ''
                ? 'error'
                : newPasswordInput !== newVerifyPasswordInput
                  ? 'error'
                  : ''
            }
            helperText={
              newPasswordInput.length < 8 && newPasswordInput !== ''
                ? 'password must be 8 or more characters'
                : newPasswordInput !== newVerifyPasswordInput
                  ? 'passwords do not match'
                  : ''
            }
            value={newPasswordInput}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            label="Enter new password"
            sx={{
              mt: 2,
              width: '16ch',
            }}
          />
        </section>

        <section>
          <FormLabel
            sx={{
              mt: 2,
            }}
          >
            Verify New Password:
          </FormLabel>

          <TextField
            variant="outlined"
            type="password"
            name="Verify New Password"
            placeholder={'verify new password'}
            color={
              newVerifyPasswordInput.length < 8 && newVerifyPasswordInput !== ''
                ? 'error'
                : newPasswordInput !== newVerifyPasswordInput
                  ? 'error'
                  : ''
            }
            helperText={
              newVerifyPasswordInput.length < 8 && newVerifyPasswordInput !== ''
                ? 'password must be 8 or more characters'
                : newPasswordInput !== newVerifyPasswordInput
                  ? 'passwords do not match'
                  : ''
            }
            value={newVerifyPasswordInput}
            onChange={(e) => setNewVerifyPasswordInput(e.target.value)}
            label="Verify new password"
            sx={{
              mt: 2,
              width: '16ch',
            }}
          />
        </section>

        <Button
          onClick={handleComfirmationClickOpen}
          variant="contained"
          type="button"
          color="button"
          sx={{
            mt: 3,
            mb: 5,
            mr: 2,
          }}
        >
          <SaveIcon /> Save Changes
        </Button>
        <Button
          color="error"
          onClick={handleDiscardClickOpen}
          variant="outlined"
          type="button"
          sx={{
            mt: 3,
            mb: 5,
            ml: 2,
          }}
        >
          <DeleteIcon /> Discard Changes
        </Button>
      </form>

      {/* Discard Dialog */}
      <Dialog
        open={openDiscard}
        onClose={handleDiscardClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to discard these changes?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can change this information again if need be.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={discardChanges} autoFocus>
            <DeleteIcon /> Discard
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleDiscardClose}>
            <CloseIcon /> Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openComfirmation}
        onClose={handleComfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to save the new information?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can change this information again if need be.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveNewUserInfo} autoFocus>
            <SaveIcon /> Save Changes
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleComfirmationClose}>
            <CloseIcon /> Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
