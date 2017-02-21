import React, { PropTypes } from 'react';
import Employer from '../Employer';

const Employment = ({ jobs }) => {
  return (
    <div>
      {
        jobs.map(j =>
          <Employer key={ j.employer } job={ j } />)
      }
    </div>
  );
};

export default Employment;

Employment.propTypes = {
  jobs: PropTypes.array,
};
