/* @flow */
import React from 'react';
import styled from 'styled-components';

type Props = {
  label: String,
};

const SectionLabel = (props: Props) => {
  const SecLabel = styled.h2`
    font-size: 2.5rem;
    font-weight: 200;
    text-transform: uppercase;
    line-height: 2;
  `;
  return (
    <SecLabel>{ props.label }</SecLabel>
  );
};

export default SectionLabel;
