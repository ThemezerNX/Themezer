import {gql} from "@apollo/client/core";

export const CREATE_OVERLAY_QUERY = gql`
    query createOverlay($blackImage: Upload!, $whiteImage: Upload!) {
        createOverlay(blackImage: $blackImage, whiteImage: $whiteImage) {
            fileName
            data
            mimetype
        }
    }
`;
