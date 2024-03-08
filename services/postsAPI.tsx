import {gql} from '@apollo/client';

const POSTS_LIST = gql`
  query postsList($limit: Int!, $offset: Int!, $project: ID!) {
    postsList(limit: $limit, offset: $offset, project: $project) {
      posts {
        id
        cover
        status
        description
      }
      count
    }
  }
`;

const POST = gql`
  query post($id: ID!) {
    post(id: $id) {
      id
      cover
      status
      description
      start_at
      revision
    }
  }
`;

export {POSTS_LIST, POST};
