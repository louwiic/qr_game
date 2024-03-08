import {gql} from '@apollo/client';

const LOST_PASSWORD = gql`
  mutation lostPassword($email: String!) {
    lostPassword(email: $email)
  }
`;

const NEW_PASSWORD = gql`
  mutation recreatePassword(
    $email: String!
    $resetCode: String!
    $password: String!
    $confirm: String!
  ) {
    recreatePassword(
      data: {
        email: $email
        resetCode: $resetCode
        password: $password
        confirm: $confirm
      }
    )
  }
`;

const SINGLE_UPLOAD = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      url
    }
  }
`;

const EXIST_USER = gql`
  query existUser($email: String) {
    existUser(email: $email)
  }
`;

const EXIST_PHONE_USER = gql`
  query existPhone($phone: String) {
    existPhone(phone: $phone)
  }
`;

const SEND_SMS = gql`
  query sendConfirmCodeSMS {
    sendConfirmCodeSMS
  }
`;

const CONFIRM_SMS = gql`
  mutation confirmSMS($phone: String!, $code: String!) {
    confirmSMS(phone: $phone, code: $code)
  }
`;

const EXIST_USER_NICKNAME = gql`
  query existNickname($nickname: String) {
    existNickname(nickname: $nickname)
  }
`;

const REGISTER_PROVIDER = gql`
  mutation registerProvider(
    $email: String!
    $firebase_id_token: String!
    $firebase_uid: String!
    $firebase_provider: String!
  ) {
    registerProvider(
      data: {
        email: $email
        firebase_id_token: $firebase_id_token
        firebase_uid: $firebase_uid
        firebase_provider: $firebase_provider
        role: USER
      }
    ) {
      access
      refresh
    }
  }
`;

const LOGIN_PROVIDER = gql`
  mutation loginProvider($firebase_uid: String, $firebase_id_token: String) {
    loginProvider(
      data: {firebase_uid: $firebase_uid, firebase_id_token: $firebase_id_token}
    ) {
      access
      refresh
    }
  }
`;

const REFRESH = gql`
  mutation refresh($token: String!) {
    refresh(token: $token) {
      access
      refresh
    }
  }
`;

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(data: {email: $email, password: $password}) {
      access
      refresh
    }
  }
`;

const REGISTER = gql`
  mutation register(
    $lastname: String!
    $firstname: String!
    $nickname: String!
    $phone: String!
    $email: String!
    $birthday: Date!
    $gender: Gender!
    $password: String!
    $confirm_password: String!
  ) {
    register(
      data: {
        lastname: $lastname
        firstname: $firstname
        nickname: $nickname
        phone: $phone
        email: $email
        birthday: $birthday
        gender: $gender
        password: $password
        confirm_password: $confirm_password
      }
    ) {
      access
      refresh
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUserProfile(
    $firstname: String!
    $lastname: String!
    $phone: String!
    $birthday: Date!
    $gender: Gender!
    $avatar: String
  ) {
    updateUserProfile(
      data: {
        firstname: $firstname
        lastname: $lastname
        phone: $phone
        birthday: $birthday
        gender: $gender
        avatar: $avatar
      }
    ) {
      id
    }
  }
`;

const UPDATE_EMAIL_USER = gql`
  mutation updateUserEmail($email: String!) {
    updateUserEmail(email: $email)
  }
`;

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      created_at
      firstname
      lastname
      email
    }
  }
`;

const USER_PROFIL = gql`
  query currentUser {
    currentUser {
      id
      created_at
      firstname
      lastname
      nickname
      email
      avatar
      is_premium
      iban
      bic
    }
  }
`;

const USER_EDIT_PROFIL = gql`
  query currentUser {
    currentUser {
      id
      firstname
      lastname
      nickname
      gender
      avatar
      phone
      email
      birthday
      is_premium
    }
  }
`;

const USER_HOME_PROFIL = gql`
  query currentUser {
    currentUser {
      id
      firstname
      lastname
      nickname
      gender
      avatar
      phone
      email
      gain_of_the_day
      wallet_amount
      birthday
      is_premium
      unread_notifications
      waiting_list {
        in_waiting
        current_position
        total_in_waiting
      }
    }
  }
`;

const WAITING_POSITION = gql`
  query currentUser {
    currentUser {
      waiting_list {
        in_waiting
        current_position
        total_in_waiting
      }
    }
  }
`;

export {
  LOGIN,
  LOST_PASSWORD,
  NEW_PASSWORD,
  REFRESH,
  SINGLE_UPLOAD,
  REGISTER,
  CURRENT_USER,
  UPDATE_USER,
  EXIST_USER,
  LOGIN_PROVIDER,
  REGISTER_PROVIDER,
  EXIST_USER_NICKNAME,
  EXIST_PHONE_USER,
  USER_PROFIL,
  USER_EDIT_PROFIL,
  UPDATE_EMAIL_USER,
  USER_HOME_PROFIL,
  WAITING_POSITION,
  CONFIRM_SMS,SEND_SMS
};
