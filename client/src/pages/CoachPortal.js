import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import CoachMessage from '../components/CoachMessage';

const CoachPortal = () => {
  return (
    <div>
      <Button variant="contained">Hello World</Button>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <CoachMessage />
    </div>
  );
};

export default CoachPortal;
