export default {
    utf8_only: (input: any) => {
        if (!input) return true;
        let output = "";
        input = input.toString();
        for (let i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return input === output || "Only UTF-8 characters are allowed";
    },
    description_length: (value: string) =>
        !value ||
        (value.trim().length >= 10 && value.trim().length <= 500) ||
        "A description must be between 10 and 500 characters long",
    name_length: (value: string) =>
        !value ||
        (value.trim().length >= 3 && value.trim().length <= 50) ||
        "A name must be between 3 and 50 characters long",
    required: (value: any) => !!value || "Required",
    category_length: (values: Array<string>) =>
        !values ||
        !values.some((v) => v.trim().length < 2) ||
        "A category must be 2 or more characters",
    min_category_amount: (values: Array<string>) =>
        !values || values.length > 0 || "At least 1 category is required",
    max_category_amount: (values: Array<string>) =>
        !values ||
        values.length <= 10 ||
        "A maximum of 10 categories is allowed",
    hex: (value: string) =>
        !value ||
        (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
            ? true
            : "Invalid HEX"),
    no_scripts: (value: string) =>
        !value ||
        !/< *script *>.*?< *\/ *script *>/gim.test(value) ||
        "Script tags are not allowed",
    banner_size: (file: File) =>
        !file || file.size < 1048576 || "Image size should be less than 1 MB!",
    logo_size: (file: File) =>
        !file || file.size < 1048576 || "Image size should be less than 1 MB!",
};
