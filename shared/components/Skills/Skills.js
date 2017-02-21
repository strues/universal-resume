import React, { PropTypes } from 'react';
import { Row, Col } from 'reactstrap';
import SkillCategory from '../SkillCategory';

const Skills = props => {
  return (
    <Row>
      {
        props.skillSets.map(skill =>
        <Col xs="12" md="3" key={ skill.name } >
          <SkillCategory skillCategory={ skill } />
        </Col>)
      }
    </Row>
  );
};

Skills.propTypes = {
  skillSets: PropTypes.array,
};

export default Skills;
