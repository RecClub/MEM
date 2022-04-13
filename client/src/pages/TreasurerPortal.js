import React from 'react';

import MemberLog from '../components/MemberLog';

import CoachList from '../components/CoachList';
import UnpaidDebt from '../components/UnpaidDebt';
import CoachClass from '../components/CoachClass';

const TreasurerPortal = () => {
  return (
    <div>
      TreasurerPortal
      <MemberLog/>
      <CoachList/>
     <CoachClass/>
      <br/>
      UnpaidDebt
      <UnpaidDebt/>
    </div>
  );
};

export default TreasurerPortal;
