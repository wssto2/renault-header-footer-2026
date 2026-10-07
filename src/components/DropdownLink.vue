<template>
    <li
        class="tab"
        role="button"
        tabindex="0"
        :class="{ 'is-active': isActive }"
        :aria-controls="'rna-panel-' + itemIndex"
        :aria-expanded="String(isActive)"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
    >{{ item.title }}</li>
</template>

<script>
    export default {
        name: "DropdownLink",

        props: {
            item: Object,
            itemIndex: Number,
            isActive: Boolean
        },

        methods: {
            toggleDropdown() {
                // Items without children are plain links.
                if (this.item.url && !(this.item.children && this.item.children.length)) {
                    window.location.href = this.item.url;
                    return;
                }
                this.$emit("toggleDropdown", this.itemIndex)
            }
        }
    }
</script>
