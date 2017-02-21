/* @flow */
import React from 'react';
import styled from 'styled-components';
import { Heading, Link, List, ListItem } from '../index';

const EmployerTitle = styled.div`
  display: inline-flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  highlights: Array<String>
}
const JobHighlights = (props: Props) => {
  return (
      <List>
        { props.highlights.map((hlt, i) => <ListItem key={ i }>{ hlt }</ListItem>) }
      </List>
  );
};

export default JobHighlights;
