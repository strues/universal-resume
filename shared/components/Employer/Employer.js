/* @flow */
import React from 'react';
import styled from 'styled-components';
import { JobHighlights, Heading, Link, List, ListItem } from '../index';

const EmployerTitle = styled.div`
  display: inline-flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  job: Object,
};

const Employer = (props: Props) => {
  const { job } = props;
  return (
    <div>
      <EmployerTitle>
        <Heading level={ 3 }>{ job.employer }</Heading> { job.start } - { job.end }
      </EmployerTitle>
      <List>
      <ListItem>
        <Link href={ job.url }>{ job.url }</Link>
      </ListItem>
      <ListItem>
        <Heading level={ 2 }>{ job.position }</Heading>
      </ListItem>
      <ListItem>{ job.summary }</ListItem>
      <ListItem>{ job.keywords }</ListItem>
    </List>
    <JobHighlights highlights={ job.highlights } />
    </div>
  );
};

export default Employer;
