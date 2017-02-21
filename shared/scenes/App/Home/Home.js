import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Media, Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { graphql } from 'react-apollo';
import { SectionLabel, Social, Skills, Employment, Education, Location } from '../../../components';
import config from '../../../../config';

const PaperWrapper = styled.section`
  width: 100%;
  position: relative;
  padding: 1em;
  margin-bottom: 10px;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .4);
  background-color: #fff;
`;
const Profile = styled.div`
  padding-top: 100px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  margin-top: 25px;
  margin-bottom: 50px;
`;

class Home extends Component {
  render() {
    const { loading, person, location, employment, education, skills } = this.props.data;

    if (loading) return <div>Loading</div>;
    return (
      <Container>
        <Helmet title="Home" />
          <Row>
            <Col xs>
              <Profile>
              <h1>{ person.name }</h1>
              <p>Fullstack developer, specializing in Node.js and React.</p>
              <Location loc={ location } />
              <Social
                facebook
                fburl="http://www.facebook.com"
                twitter
                turl="https://twitter.com/struesco"
                github
                gurl="https://github.com/strues"
                linkedin
                lurl="https://linkedin.com/"
              />
              <ButtonGroup>
              <Button color="primary">Download Resume</Button> { ' ' }<Button color="success">Contact</Button>
            </ButtonGroup>
            </Profile>
            </Col>
          </Row>

        <Row>
          <Col>
            <SectionLabel label="Employment History" />
            <PaperWrapper>
              <Employment jobs={ employment.history } />
            </PaperWrapper>
            <SectionLabel label="Skills" />
            <Skills skillSets={ skills.sets } />
            <SectionLabel label="Education" />
            <PaperWrapper>
              <Education school={ education.history[0] } />
            </PaperWrapper>
          </Col>
        </Row>
      </Container>
    );
  }
}
export const RESUME_DATA_QUERY = gql`
  query Query {
    person {
      name
    },
    location {
      code,
      city,
      country,
      region
    }
    employment {
      history {
        position
        employer
        summary
        start
        end
        url
        keywords
        highlights
      }
    },
    education {
     level,
      history {
        institution
        start
        end
        summary
        area
        studyType
      }
    }
    skills {
      sets {
        name
        skills
      }
    }
  }
`;
export const withResume = graphql(RESUME_DATA_QUERY);

export default withResume(Home);
