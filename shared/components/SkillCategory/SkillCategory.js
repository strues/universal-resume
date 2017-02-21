/* @flow */
import React from 'react';
import { Card, Button, CardImg, CardTitle, CardText, CardGroup, CardSubtitle, CardBlock } from 'reactstrap';
import { List, ListItem } from '../List';

type Props = {
  skillCategory: Object,
};

const SkillCategory = (props: Props) => {
  const { skillCategory } = props;
  return (
    <Card>
      <CardBlock>
       <CardTitle>{skillCategory.name}</CardTitle>

      <List>
        {skillCategory.skills.map(skill => <ListItem key={ skill }>{skill}</ListItem>)}

      </List>
    </CardBlock>
    </Card>
  );
};

export default SkillCategory;
