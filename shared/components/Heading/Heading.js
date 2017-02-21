import React, { PropTypes } from 'react';
import styled, { css } from 'styled-components';

export const fontSize = ({ level }) => `${0.75 + 1 * (1 / level)}rem`;

const styles = css`
  font-weight: 700;
  font-size: ${fontSize};
  margin: 0;
  margin-top: 0.85714em;
  margin-bottom: 0.57142em;
  color :#292b2c;
`;

const Heading = styled(({ level, children, ...props }) =>
  React.createElement(`h${level}`, props, children))`${styles}`;

Heading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
};

Heading.defaultProps = {
  level: 1,
};

export default Heading;
