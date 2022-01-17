import {gql} from "@apollo/client/core";

export const LOGOUT_MUTATION = gql`
    mutation logout {
        logout
    }
`;
