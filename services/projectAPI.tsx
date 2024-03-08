import {gql} from '@apollo/client';

const PROJECT_LIST = gql`
  query projectsList($limit: Int!, $offset: Int!) {
    projectsList(limit: $limit, offset: $offset) {
      projects {
        id
        name
        email
      }
      count
    }
  }
`;
const CARD = gql`
  query user {
    user {
      cards {
        id
        reward
      }
    }
  }
`;

const PROJECT = gql`
  query project($id: ID!) {
    project(id: $id) {
      id
      created_at
      name
      email
    }
  }
`;

export {PROJECT_LIST, PROJECT};
