<template>
    <a
        :href="to"
        rel="noopener"
        :target="newTab ? '_blank' : ''"
        :title="title"
    >
        <slot/>
    </a>
</template>

<script>
export default {
    name: 'OpenLink',
    props: {
        to: {
            type: String,
            required: true,
        },
        newTab: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: undefined,
        },
    },
};
</script>
