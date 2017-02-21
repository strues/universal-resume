import { find, filter } from 'lodash';

const locationData = {
  city: 'Highlands Ranch',
  region: 'Colorado',
  country: 'US',
  code: 'CO 80129',
};
const educationData = {
  level: 'College',
  history: [
    {
      institution: 'Colorado State University',
      start: '08/14/2008',
      end: '12/15/2013',
      summary: '',
      area: 'Journalism',
      studyType: 'Bachelor',
    },
  ],
};
const personData = { name: 'Steven Truesdell' };
const employmentData = {
  history: [
    {
      position: 'Senior Frontend Developer',
      employer: 'REDHOT.io',
      summary: 'Frontend and Node.js lead developer for planning, development, and implementation of the REDHOT.io platform.',
      start: '07/01/2016',
      end: '12/04/2016',
      url: 'http://www.redhot.io',
      keywords: [],
      highlights: [
        'Universal javascript website with client area and administration area built using React.',
        'Standalone backend API written in Node.js, with Postgres as the database, which runs as a microservice for easy scalability.',
        'Wrote custom Dockerfiles, scripts, and workflows in order to seamlessly integrate the REDHOT platform with Oracle Enterprise Linux.',
      ],
    },
    {
      position: 'Frontend Developer',
      employer: 'Axial',
      summary: 'Frontend developer by title, fullstack developer by practice. During my time at Axial I wore many hats and did whatever was necessary to get the job done. I put out more than my fair share of fires, always rising above expectations, and meeting the needs of my fellow developers.',
      start: '08/01/2015',
      end: '07/31/2016',
      url: 'http://www.axial.agency',
      keywords: [],
      highlights: [
        'Built large web applications using Angular and React.',
        'Worked alongside C# developers integrating applications into Umbraco CMS.',
        'Designed and carried out implementation of various Node.js APIs for numerous cross platform applications and services.',
        'Responsible for expanding the teams knowledge and skill set of JavaScript tools, frameworks and application design.',
        'Taught myself enough Ruby on Rails, to manage the upkeep of a backend for a mobile application',
        'Laid a foundation of standards and best practices to be used by other developers.',
      ],
    },
    {
      position: 'Sole Proprietor',
      employer: 'Steven Truesdell',
      summary: 'My journey as a freelance developer began in my later years of college. Eventually, I grew my passion and personal brand into a self-sustaining business. The experience I gained from working as a self-employed developer was invaluable.',
      start: '09/01/2012',
      end: '08/01/2015',
      url: 'https://www.steventruesdell.com',
      keywords: [],
      highlights: [
        'Full time freelance developer.',
        'Everything from WordPress sites to single page applications.',
        'Client management, lead generation, statements of work, and everything that goes into running a development business.',
        'Built a number of high quality Angular.js applications.',
      ],
    },
  ],
};
const skillsData = {
  sets: [
    {
      name: 'Frontend',
      skills: ['HTML', 'CSS', 'Sass', 'Javascript', 'User Experience', 'Git'],
    },
    {
      name: 'JavaScript',
      skills: ['React', 'Angular', 'Express.js', 'Redux / Flux architecture', 'Gulp', 'Webpack', 'ES2015 / ES2016'],
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Docker', 'Linux system administration', 'AWS / Heroku', 'Rails'],
    },
    {
      name: 'Databases',
      skills: ['MongoDB', 'RethinkDB', 'PostgreSQL', 'MySQL'],
    },
  ],
};
const resolveFunctions = {
  Query: {
    location() {
      return locationData;
    },
    employment() {
      return employmentData;
    },
    education() {
      return educationData;
    },
    skills() {
      return skillsData;
    },
    person() {
      return personData;
    },
  },
};

export default resolveFunctions;
