<template>
    <div class="ContentWithLinks">
        <div class="ContentWithLinks__highlight" v-if="highlight">
            <div class="ContentWithLinks__highlightLinks">
                <p class="ContentWithLinks__title">{{ highlight.title }}</p>
                <p class="ContentWithLinks__highlightLink" v-for="(link, linkIndex) in highlightLinks" :key="linkIndex">
                    <HeaderIcon icon="arrow" class="ContentWithLinks__arrow" />
                    <a class="ContentWithLinks__highlightCta" :href="link.url" :target="link.target || '_self'" :rel="link.target === '_blank' ? 'noopener' : null">{{ link.title }}</a>
                </p>
            </div>
            <div class="ContentWithLinks__highlightImage" v-if="highlightImage">
                <img :src="highlightImage" alt="">
            </div>
        </div>
        <ul class="ContentWithLinks__links">
            <li v-for="(column, columnIndex) in columns" :key="columnIndex">
                <p class="ContentWithLinks__linksTitle">{{ column.title }}</p>
                <ul class="ContentWithLinks__sublinks">
                    <li v-for="(link, linkIndex) in activeItems(column.children)" :key="linkIndex">
                        <a :href="link.url" :target="link.target || '_self'" :rel="link.target === '_blank' ? 'noopener' : null">{{ link.title }}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    import HeaderIcon from "@/components/HeaderIcon";
    import { meta, activeItems } from "@/utils";

    export default {
        name: "LinksPanel",
        components: { HeaderIcon },

        props: {
            item: Object
        },

        computed: {
            children() {
                return activeItems(this.item.children);
            },
            // Child with meta.type "highlight": title + links + meta.image shown on the left.
            highlight() {
                return this.children.find((child) => meta(child, "type") === "highlight") || null;
            },
            highlightLinks() {
                return this.highlight ? activeItems(this.highlight.children) : [];
            },
            highlightImage() {
                return this.highlight ? meta(this.highlight, "image") : null;
            },
            // All other children are link columns.
            columns() {
                return this.children.filter((child) => meta(child, "type") !== "highlight");
            }
        },

        methods: { activeItems }
    }
</script>
