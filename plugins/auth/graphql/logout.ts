import gql from "graphql-tag";

export const LOGOUT_MUTATION = gql`
    mutation logout {
        logout
    }
`;
