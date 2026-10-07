<template>
    <img v-if="isUrl" :src="icon" alt="" aria-hidden="true">
    <svg v-else-if="markup" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" :viewBox="viewBox" v-html="markup"></svg>
</template>

<script>
    import icons from "@/icons";

    // Renders an icon from the API "icon" field: a key from icons.js or an image url.
    export default {
        name: "HeaderIcon",

        props: {
            icon: String,
            viewBox: { type: String, default: "0 0 24 24" }
        },

        computed: {
            isUrl() {
                return /^(https?:)?\/\/|^\//.test(this.icon || "");
            },
            markup() {
                return icons[this.icon] || "";
            }
        }
    }
</script>
