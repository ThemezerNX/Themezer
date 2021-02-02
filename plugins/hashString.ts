import hash from "object-hash";

export default (context: any, inject: any) => {
    const $hashString = (s: any) => {
        return hash(s);
    };

    inject("hashString", $hashString);
    context.$snackbar = $hashString;
}
