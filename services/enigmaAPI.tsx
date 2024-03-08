import {gql} from '@apollo/client';

const ENIGMAS_ANSWERS = gql`
  query storeScan($id: ID!) {
    storeScan(id: $id) {
      id
      logo
      name
      category {
        name
      }
      enigmas {
        count_enigmas
        qr_coins
        enigmas {
          question
          answers
          reward
          image
          is_star
          user_answer(store_id: $id) {
            id
            user_answer_is_correct
            answers
            attempt
          }
        }
      }
    }
  }
`;

const CHECK_QR = gql`
  query storeScan($id: ID!) {
    storeScan(id: $id) {
      id
    }
  }
`;

const UPDATE_ANSWER = gql`
  mutation updateAnswer($user_answer_id: ID!, $value: String!) {
    updateAnswer(user_answer_id: $user_answer_id, value: $value) {
      id
      user_answer_is_correct
      attempt
    }
  }
`;

export {ENIGMAS_ANSWERS, CHECK_QR, UPDATE_ANSWER};
