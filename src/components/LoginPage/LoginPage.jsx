import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <Box
        component="form"
        direction="column"
        alignItems="center"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LoginForm />
      </Box>
    </div>
  );
}

export default LoginPage;
