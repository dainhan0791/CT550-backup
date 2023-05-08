import React from 'react';

import { Alert } from '@mui/material';
import styled from 'styled-components';

const SCAlertError = styled(Alert)`
  width: 100%;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  padding: 0 1rem;
  font-weight: bold;
`;

const AlertError = (props: any) => {
  return <SCAlertError severity="error">{props.children}</SCAlertError>;
};

export default AlertError;
