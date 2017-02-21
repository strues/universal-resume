import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const schema = `
type Location {
  city: String
  region: String
  country: String
  code: String
}

type Person {
  name: String
}

type Job {
  position: String
  employer: String
  summary: String
  start: String
  end: String
  url: String
  keywords: [String]
  highlights: [String]
}

type Employment {
  history: [Job]
}

type EducationHistory {
  institution: String
  start: String
  end: String
  summary: String
  area: String
  studyType: String
}

type Education {
  level: String
  history: [EducationHistory]
}

type SkillSet {
  name: String
  skills: [String]
}

type Skills {
  sets: [SkillSet]
}

# the schema allows the following query:
type Query {
  employment: Employment
  education: Education
  skills: Skills
  location: Location
  person: Person
}

`;

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
