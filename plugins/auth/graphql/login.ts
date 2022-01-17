import {gql} from "@apollo/client/core";

export const LOGIN_MUTATION = gql`
    mutation login($email: String!, $password: String!) {
        login(loginData: {email: $email, password: $password}) {
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
