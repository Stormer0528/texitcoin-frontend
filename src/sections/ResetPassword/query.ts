import { gql } from 'src/__generated__';

export const RESET_PASSWORD_REQUEST = gql(/* GraphQL */ `
  mutation ResetPasswordRequest($data: EmailInput!) {
    resetPasswordRequest(data: $data) {
      message
      result
    }
  }
`);

export const RESET_PASSWORD_TOKEN = gql(/* GraphQL */ `
  mutation ResetPasswordByToken($data: ResetPasswordTokenInput!) {
    resetPasswordByToken(data: $data) {
      message
      result
    }
  }
`);
