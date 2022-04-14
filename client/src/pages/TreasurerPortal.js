import React from 'react';

import MemberLog from '../components/MemberLog';

import CoachList from '../components/CoachList';
import UnpaidDebt from '../components/UnpaidDebt';
import CoachClass from '../components/CoachClass';
import PaymentInvoice from '../components/PaymentInvoice';

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
      <br/>
      <PaymentInvoice/>
    </div>
  );
};

export default TreasurerPortal;
