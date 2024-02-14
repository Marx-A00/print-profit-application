import { Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyAccountPageForm from '../MyAccountPageForm/MyAccountPageForm';
import './MyAccountPage.css';

export default function MyAccountPage() {
  const dispatch = useDispatch();

  const profileUser = useSelector((store) => store.user.profileUserReducer);
  const currentUser = useSelector((store) => store.user.currentUser);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_PROFILE_PAGE_USER' });
  }, [dispatch]);

  const [isForm, setIsForm] = useState(false);

  const toggleForm = () => {
    setIsForm(true);
  };

  const displayText = () => {
    if (isForm) {
      return (
        <>
          <MyAccountPageForm setIsForm={setIsForm} sx={{ mt: 5 }} />
        </>
      );
    }
    if (isForm === false) {
      return (
        <>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>{currentUser.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Email:</TableCell>
                  <TableCell>{profileUser.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Company:</TableCell>
                  <TableCell>{profileUser.company_name}</TableCell>
                </TableRow>

                {/* <TableRow>
                  <TableCell align="right" >
                    <Button
                      aria-label="edit info"
                      className="editInfoButton"
                      onClick={toggleForm}
                      type="button"
                      variant="contained"
                      
                    >
                      <Typography> Edit info</Typography>

                      <EditIcon sx={{ color: 'black' }} />
                    </Button>
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
            <Button
              aria-label="edit info"
              className="editInfoButton"
              onClick={toggleForm}
              type="button"
              variant="contained"
              sx={{
                mt: 3,
              }}
            >
              <Typography> Edit info</Typography>

              <EditIcon sx={{ color: 'black' }} />
            </Button>
          </TableContainer>
        </>
      );
    }
  };

  return (
    <div className="myAccountPageCss">
      <div className="accountPageFormArea">{displayText()}</div>
    </div>
  );
}
