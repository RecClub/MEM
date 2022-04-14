import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import CoachMessage from '../components/CoachMessage';
import MemberClass from '../components/MemberClass';

const CoachPortal = () => {
  return (
    <div>
      <CoachMessage />
      <MemberClass/>
    </div>
  );
};

export default CoachPortal;
