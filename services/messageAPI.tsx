import {gql} from '@apollo/client';

const MESSAGES_LIST = gql`
  query messagesList($limit: Int!, $offset: Int!, $post_id: ID!) {
    messagesList(limit: $limit, offset: $offset, post_id: $post_id) {
      messages {
        id
        created_at
        name
        text
        updated
      }
      count
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription messageSubscription($post_id: ID!) {
    messagePublished(post_id: $post_id) {
      id
      created_at
      name
      text
      updated
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation createMessage($post_id: ID!, $text: String!, $name: String!) {
    createMessage(post_id: $post_id, data: {text: $text, name: $name})
  }
`;

export {MESSAGES_LIST, MESSAGE_SUBSCRIPTION, SEND_MESSAGE};
