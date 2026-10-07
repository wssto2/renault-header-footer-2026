<template>
    <section
        :id="'rna-panel-' + itemIndex"
        :class="['navigation-panel', { 'navigation-panel--vehicles': isVehicles, 'is-open': isActive }]"
        :aria-hidden="String(!isActive)"
    >
        <div class="MainHeaderV2__megaDropDownHeader">
            <button class="panel-back" type="button" aria-label="nazad" @click="$emit('back')">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="m5.85 1.95 12.6 9.45v1.2l-12.6 9.45-.9-1.2L16.75 12 4.95 3.15z" clip-rule="evenodd"></path></svg>
                <span>nazad</span>
            </button>
            <button class="panel-close" type="button" aria-label="zatvorite panel" @click="$emit('close')">
                <span>{{ closeTitle }}</span>
                <HeaderIcon icon="close" />
            </button>
        </div>

        <VehiclePanel v-if="isVehicles" :item="item" :isActive="isActive" />
        <LinksPanel v-else :item="item" />
    </section>
</template>

<script>
    import HeaderIcon from "@/components/HeaderIcon";
    import VehiclePanel from "@/components/VehiclePanel";
    import LinksPanel from "@/components/LinksPanel";
    import { meta } from "@/utils";

    export default {
        name: "Dropdown",
        components: { HeaderIcon, VehiclePanel, LinksPanel },

        props: {
            item: Object,
            itemIndex: Number,
            isActive: Boolean,
            closeTitle: { type: String, default: "zatvorite" }
        },

        computed: {
            // meta.type: "vehicles" renders the vehicle picker, anything else renders links.
            isVehicles() {
                return meta(this.item, "type") === "vehicles";
            }
        }
    }
</script>
