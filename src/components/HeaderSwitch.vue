<template>
    <div :class="['header-switch-container', { 'mobile-header-switch': mobile }]">
        <div :class="['header-switch', { 'is-second': activeIndex === 1 }]" @click="select(activeIndex === 0 ? 1 : 0)">
            <div class="header-switch-toggle"></div>
        </div>
        <div class="header-switch-text-container">
            <span
                v-for="(item, itemIndex) in items.slice(0, 2)"
                :key="itemIndex"
                :class="{ active: activeIndex === itemIndex }"
                @click="select(itemIndex)"
            >{{ item.title }}</span>
        </div>
    </div>
</template>

<script>
    import { metaBool } from "@/utils";

    // Two-state switch (e.g. private / business customers). If the item has a url the page navigates there.
    export default {
        name: "HeaderSwitch",

        props: {
            items: Array,
            mobile: Boolean
        },

        data() {
            const activeIndex = this.items.findIndex((item) => metaBool(item, "active"));
            return { activeIndex: activeIndex === -1 ? 0 : activeIndex };
        },

        methods: {
            select(index) {
                if (index === this.activeIndex) {
                    return;
                }
                const item = this.items[index];
                if (item && item.url) {
                    window.location.href = item.url;
                    return;
                }
                this.activeIndex = index;
            }
        }
    }
</script>
