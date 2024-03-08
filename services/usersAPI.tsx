import {gql} from '@apollo/client';

const USERS_LIST = gql`
  query usersList($limit: Int!, $offset: Int!) {
    usersList(limit: $limit, offset: $offset) {
      users {
        id
        firstname
        lastname
      }
      count
    }
  }
`;
const EDIT_RIB = gql`
  mutation updateUserRib(
    $firstname: String!
    $lastname: String!
    $iban: String!
    $bic: String!
  ) {
    updateUserRib(
      data: {firstname: $firstname, lastname: $lastname, iban: $iban, bic: $bic}
    )
  }
`;

const CHECK_IBAN = gql`
  query testIban($test_iban: String!) {
    ibanIsValid(test_iban: $test_iban)
  }
`;

export {USERS_LIST, EDIT_RIB, CHECK_IBAN};
