import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const SCSendOTPButton = styled(Button)`
  height: 44px !important;
  width: 100% !important;
  border-radius: 8px !important;
  background: #ffb600;
  color: rgba(102, 51, 35, 1);
`;

const DisabledButton = ({ setToggle }: { setToggle: Function }) => {
  const [count, setCount] = React.useState<number>(10);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  React.useEffect(() => {
    if (count === 0) {
      setToggle(false);
    }
  }, [count]);
  return (
    <>
      <SCSendOTPButton variant="contained" id="send-sms-btn" disabled>
        {count >= 0 && count}
      </SCSendOTPButton>
    </>
  );
};

export default DisabledButton;
