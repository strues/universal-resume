import React from 'react';
import styled from 'styled-components';

import Paragraph from '../Paragraph';

const Wrapper = styled.div`
  background-color: #333;
  padding: 2rem;
  margin-top: 50px;
`;

const Credits = styled(Paragraph)`
  vertical-align: center;
  text-align: center;
  margin: 0;
`;

const Footer = (props) => {
  return (
    <Wrapper { ...props }>
      <Credits>
        Made with by
      </Credits>
    </Wrapper>
  );
};

export default Footer;
