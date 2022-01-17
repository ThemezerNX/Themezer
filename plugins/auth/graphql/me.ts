import {gql} from "@apollo/client/core";

export const ME_QUERY = gql`
    query me {
        me {
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
