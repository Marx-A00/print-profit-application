import { Box } from '@mui/material';
import backgroundImage from '../../assets/printProfitBgLanding2.png';
import LoginForm from '../LoginForm/LoginForm.jsx';

function LandingPage() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          // minWidth: '70%',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <Box sx={{ display: 'flex', paddingRight: '9%' }}>
          <LoginForm />
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
