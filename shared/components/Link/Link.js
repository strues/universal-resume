import React, { PropTypes } from 'react';
import styled, { css } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

const styles = css`
  text-decoration: none;
  font-weight: 500;
  color: #2879ff;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledLink = styled(({ ...props }) => <RouterLink { ...props } />)`${styles}`;
const Anchor = styled.a`${styles}`;

const Link = ({ ...props }) => {
  if (props.to) {
    return <StyledLink { ...props } />;
  }
  return <Anchor { ...props } />;
};

Link.propTypes = {
  to: PropTypes.string,
};

export default Link;
