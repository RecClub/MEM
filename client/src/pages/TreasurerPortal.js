import React from 'react';

import MemberLog from '../components/MemberLog';

import CoachList from '../components/CoachList';
import UnpaidDebt from '../components/UnpaidDebt';

const TreasurerPortal = () => {
  return (
    <div>
      TreasurerPortal
      <MemberLog/>
      CoachList
      <CoachList/>
      <br/>
      UnpaidDebt
      <UnpaidDebt/>
    </div>
  );
};

export default TreasurerPortal;
