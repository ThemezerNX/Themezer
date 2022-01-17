// Source: https://stackoverflow.com/a/60801428/12314121
import {createUploadLink} from "apollo-upload-client";
import {ApolloLink} from "@apollo/client/core";

export default ({app}: { app: any }) => {
    const uploadLink = createUploadLink({
        uri: process.env.API_ENDPOINT,
        includeExtensions: true,
        fetch: (uri: any, options: any) => {
            options.headers["Accept-Language"] = app.i18n.locale;
            return fetch(uri, options);
        },
    });

    return {
        inMemoryCacheOptions: {
            addTypename: false,
        },
        defaultHttpLink: false,
        link: ApolloLink.from([uploadLink]),
    };
}
