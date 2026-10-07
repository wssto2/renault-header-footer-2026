<template>
    <span v-if="isMarkup" class="footer-icon-markup" v-html="icon"></span>
    <HeaderIcon v-else :icon="icon" />
</template>

<script>
    import HeaderIcon from "@/components/HeaderIcon";

    // Footer icons can be an image url, an icon key or inline <svg> markup.
    export default {
        name: "FooterIcon",
        components: { HeaderIcon },

        props: {
            icon: String
        },

        computed: {
            isMarkup() {
                return /^\s*<svg/i.test(this.icon || "");
            }
        }
    }
</script>
