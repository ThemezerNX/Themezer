import {gql} from "@apollo/client/core";

export const REGISTER_MUTATION = gql`
    mutation register($email: String!, $username: String!, $password: String!) {
        register(registerData: {email: $email, username: $username, password: $password}) {
            id
            username
            joinedTimestamp
            isAdmin
            roles
            profile {
                bio
                color
                avatarUrl
                bannerUrl
                avatarBlurHash
                bannerBlurHash
            }
            connections {
                discord {
                    username
                    discriminator
                    avatarHash
                }
            }
            csrfToken
            pageUrl
            email
            hasAccepted
            isBlocked
            preferences {
                showNSFW
                notificationEmails
                promotionEmails
            }
        }
    }
`;
