import React, { PropTypes } from 'react';
import { Heading, List, ListItem } from '../index';

const Education = ({ school }) => {
  return (
    <div>
      <List>
      <ListItem><Heading level={ 2 }>{ school.institution }</Heading></ListItem>
      <ListItem>{ school.start } { school.end }</ListItem>
      <ListItem>{ school.area }</ListItem>
      <ListItem>{ school.studyType }</ListItem>
    </List>
    </div>
  );
};

Education.propTypes = {
  school: PropTypes.object,
};

export default Education;
