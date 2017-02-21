import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { ListItem, List } from '../../components';

const Location = ({ loc }) => {
  return (
    <List>
      <ListItem>{ loc.city }, { loc.code }</ListItem>
    </List>
  );
};

export default Location;

Location.propTypes = {
  loc: PropTypes.object,
};
