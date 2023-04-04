// Source: https://stackoverflow.com/a/60801428/12314121
// the issue here is that this project uses @nuxtjs/apollo > vue-apollo,
// while apollo-upload-client uses @apollo/client. These two packages are different.
// Never use the use @apollo/client package directly!
import {createUploadLink} from "apollo-upload-client";

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
        link: uploadLink,
    };
}
