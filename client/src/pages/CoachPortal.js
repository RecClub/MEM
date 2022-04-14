import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import CoachMessage from '../components/CoachMessage';
import MemberClass from '../components/MemberClass';
import MemberAssign from '../components/MemberAssign';

const CoachPortal = () => {
  return (
    <div>
      <CoachMessage />
      <MemberAssign/>
      <MemberClass/>
    </div>
  );
};

export default CoachPortal;
