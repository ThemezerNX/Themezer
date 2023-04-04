import gql from "graphql-tag";

export const THEMES_QUERY = gql`
    query themes(
        $target: Target,
        $query: String, 
        $creators: [String!],
        $layouts: [Hexadecimal!], 
        $includeNSFW: Boolean,
        $looseOnly: Boolean, 
        $order: Order,
        $orderBy: OrderBy, 
        $limit: Int,
        $page: Int
    ) {
        themes(
            target: $target,
            query: $query,
            creators: $creators,
            layouts: $layouts,
            includeNSFW: $includeNSFW,
            looseOnly: $looseOnly,
            order: $order,
            orderBy: $orderBy,
            limit: $limit,
            page: $page
        ) {
            pageInfo {
                page
                limit
                pageCount
                itemCount
            }
            nodes {
                creator {
                    username
                }
                name
                description
                pageUrl
                isNSFW
                previews {
                    image720Url
                    image360Url
                    image240Url
                    image180Url
                    imageBlurHash
                }
            }
        }
    }
`;
