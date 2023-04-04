import gql from "graphql-tag";

export const CREATE_OVERLAY_THEMES_QUERY = gql`
    query createOverlayThemes($layoutJson: JSON, $pieceJson: JSON, $commonLayoutJson: JSON) {
        createOverlayThemes(layoutJson: $layoutJson, pieceJson: $pieceJson, commonLayoutJson: $commonLayoutJson) {
            fileName
            data
            mimetype
        }
    }
`;
