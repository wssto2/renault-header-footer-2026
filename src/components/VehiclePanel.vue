<template>
    <div class="VehicleRangeCards">
        <div class="VehicleRangeCards__sidebar">
            <div :class="['VehicleRangeCards__filters', { 'is-open': filtersOpen }]">
                <div
                    class="VehicleRangeCards__filtersTitle"
                    role="button"
                    tabindex="0"
                    :aria-expanded="String(filtersOpen)"
                    :aria-controls="uid + '-filters'"
                    @click="toggleFilters"
                    @keydown.enter.prevent="toggleFilters"
                    @keydown.space.prevent="toggleFilters"
                >{{ text('filters_title', 'filtriraj vozila') }}</div>

                <div class="RangeFiltersContent" :id="uid + '-filters'">
                    <div class="RangeFiltersContent__category">
                        <span class="RangeFiltersContent__label" :id="uid + '-category'">{{ text('category_label', 'kategorije') }}</span>
                        <span
                            class="Tooltip__trigger"
                            role="button"
                            tabindex="0"
                            :aria-expanded="String(tooltip.trigger === 'category')"
                            @mouseenter="showTooltip('category', text('category_tooltip', 'filtriraj model po kategoriji'), $event)"
                            @mouseleave="hideTooltip"
                            @focus="showTooltip('category', text('category_tooltip', 'filtriraj model po kategoriji'), $event)"
                            @blur="hideTooltip"
                            @click.stop="toggleTooltip('category', text('category_tooltip', 'filtriraj model po kategoriji'), $event)"
                        ><HeaderIcon icon="info" class="InfoIcon" style="--InfoIcon-size-default: 14px; --InfoIcon-size-medium: 14px; --InfoIcon-size-large: 14px;" /></span>
                    </div>
                    <div class="RadioGroupButton" role="radiogroup" :aria-labelledby="uid + '-category'">
                        <div class="RadioGroupButton__item" v-for="(category, categoryIndex) in categories" :key="categoryIndex">
                            <div class="RadioGroupButton__tick" v-if="categoryIndex === activeCategory">
                                <div class="Indicator is-tick">
                                    <div class="Indicator__status"></div>
                                </div>
                            </div>
                            <div class="RadioGroupButton__button">
                                <input
                                    class="RadioGroupButton__input"
                                    type="radio"
                                    :id="uid + '-category-' + categoryIndex"
                                    :name="uid + '-category'"
                                    :value="categoryIndex"
                                    :tabindex="categoryIndex === activeCategory ? 0 : -1"
                                    :checked="categoryIndex === activeCategory"
                                    @change="selectCategory(categoryIndex)"
                                >
                                <label :for="uid + '-category-' + categoryIndex" class="RadioGroupButton__label">
                                    <span class="RadioGroupButton__textContainer">{{ category.title }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="RangeFiltersContent__energy" v-if="energyFilters.length">
                        <span class="RangeFiltersContent__label" :id="uid + '-energy'">{{ text('energy_label', 'motori') }}</span>
                        <span
                            class="Tooltip__trigger"
                            role="button"
                            tabindex="0"
                            :aria-expanded="String(tooltip.trigger === 'energy')"
                            @mouseenter="showTooltip('energy', text('energy_tooltip', 'filtriraj model po tipu motora'), $event)"
                            @mouseleave="hideTooltip"
                            @focus="showTooltip('energy', text('energy_tooltip', 'filtriraj model po tipu motora'), $event)"
                            @blur="hideTooltip"
                            @click.stop="toggleTooltip('energy', text('energy_tooltip', 'filtriraj model po tipu motora'), $event)"
                        ><HeaderIcon icon="info" class="InfoIcon" style="--InfoIcon-size-default: 14px; --InfoIcon-size-medium: 14px; --InfoIcon-size-large: 14px;" /></span>
                    </div>
                    <div class="RadioGroupButton" role="radiogroup" :aria-labelledby="uid + '-energy'" v-if="energyFilters.length">
                        <button
                            class="RangeFiltersContent__energyButton"
                            type="button"
                            v-for="energy in energyFilters"
                            :key="energy.value"
                            @click.prevent="toggleEnergy(energy.value)"
                        >
                            <div class="RadioGroupButton__item">
                                <div class="RadioGroupButton__button">
                                    <input
                                        class="RadioGroupButton__input"
                                        type="radio"
                                        tabindex="-1"
                                        :id="uid + '-energy-' + energy.value"
                                        :name="uid + '-energy'"
                                        :value="energy.value"
                                        :checked="activeEnergy === energy.value"
                                    >
                                    <label :for="uid + '-energy-' + energy.value" class="RadioGroupButton__label">
                                        <span class="RadioGroupButton__textContainer">{{ energy.title }}</span>
                                    </label>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div class="VehicleRangeCards__shortcuts">
                <a
                    v-for="(shortcut, shortcutIndex) in shortcuts"
                    :key="shortcutIndex"
                    class="VehicleRangeCards__shortcutLink"
                    :href="shortcut.url"
                    :target="shortcut.target || '_self'"
                    :rel="shortcut.target === '_blank' ? 'noopener' : null"
                ><HeaderIcon :icon="shortcut.icon" class="VehicleRangeCards__iconSvg" />{{ shortcut.title }}</a>
            </div>
        </div>

        <div class="VehicleRangeCards__cards">
            <div
                v-for="vehicle in visibleVehicles"
                :key="vehicle.key"
                :class="['VehicleModelCard', { 'is-pro': vehicle.isPro, 'is-centered': centeredKey === vehicle.key }]"
                @click="onCardClick(vehicle.key, $event)"
            >
                <div class="VehicleModelCard__close">
                    <button type="button" title="">
                        <HeaderIcon icon="close" class="VehicleModelCard__closeIcon" />
                        <div class="VehicleModelCard__closeLabel">{{ text('card_close_title', 'zatvorite') }} </div>
                    </button>
                </div>
                <div class="VehicleModelCard__modelName_price">{{ vehicle.title }}
                    <div class="ModelStartingPrice">
                        <div class="ModelStartingPrice__price" v-if="vehicle.price">
                            <span class="ModelStartingPrice__priceWrapper">
                                <span class="NormalizedPrice is-small">{{ vehicle.price }}<span class="ModelStartingPrice__SvgIconInfo"></span></span>
                            </span>
                        </div>
                        <div class="EnvironmentalData is-horizontal"></div>
                    </div>
                </div>
                <figure class="VehicleModelCard__image">
                    <picture class="PictureElement Image" style="--image-default-aspect-ratio:3/2;--image-medium-aspect-ratio:3/2;--image-large-aspect-ratio:3/2;--image-default-width:100%;--image-medium-width:100%;--image-large-width:100%;--image-default-height:auto;--image-medium-height:auto;--image-large-height:auto;--image-object-fit:contain">
                        <source v-if="vehicle.imageLarge" :srcset="vehicle.imageLarge" media="(min-width: 641px)">
                        <img v-if="vehicle.image" :src="vehicle.image" class="PictureElement__imgDefault" loading="lazy" alt="" aria-hidden="true">
                    </picture>
                </figure>
                <div class="VehicleModelCard__tagsList">
                    <div v-for="badge in vehicle.badges" :key="badge.value" :class="['EnergyBadgeList__text', { 'is-ev': badge.isEv }]">{{ badge.title }}</div>
                </div>
                <div class="VehicleModelCard__ctas">
                    <div class="VehicleModelCard__specs"></div>
                    <a class="VehicleModelCard__ctaPrimaryCustom" :href="vehicle.url" :target="vehicle.target || '_self'">{{ vehicle.ctaTitle }}</a>
                    <div class="VehicleModelCard__ctasContainer"></div>
                </div>
            </div>

            <div class="VehicleRangeCards__extraCard" v-if="activeCategoryItem && activeCategoryItem.url">
                <a class="VehicleRangeCards__moreCta" :href="activeCategoryItem.url">{{ moreTitle }}</a>
                <HeaderIcon icon="plus" class="VehicleRangeCards__moreIcon" />
            </div>

            <div class="VehicleModelCard__overlay" v-if="centeredKey !== null" @click.stop="closeCard"></div>
        </div>

        <div :class="['Tooltip__content', { 'is-visible': tooltip.visible }]" role="tooltip" :style="tooltip.style">{{ tooltip.text }}</div>
    </div>
</template>

<script>
    import HeaderIcon from "@/components/HeaderIcon";
    import { meta, metaList, activeItems } from "@/utils";

    const DEFAULT_ENERGY_FILTERS = [
        { value: "electric", title: "electric" },
        { value: "hybrid", title: "hibrid" },
        { value: "hybridPlugin", title: "plug-in hibrid" }
    ];
    const EV_ENERGIES = ["electric", "hybrid", "hybridPlugin"];

    export default {
        name: "VehiclePanel",
        components: { HeaderIcon },

        props: {
            item: Object,
            isActive: Boolean
        },

        data() {
            return {
                activeCategory: 0,
                activeEnergy: null,
                filtersOpen: false,
                centeredKey: null,
                tooltip: { visible: false, trigger: null, text: "", style: {} }
            }
        },

        computed: {
            uid() {
                return "rna-vehicles-" + this._uid;
            },
            children() {
                return activeItems(this.item.children);
            },
            // Children with meta.type "category" (default type) hold the vehicles.
            categories() {
                return this.children.filter((child) => !["shortcut", "energy_filter"].includes(meta(child, "type")));
            },
            shortcuts() {
                return this.children.filter((child) => meta(child, "type") === "shortcut");
            },
            energyFilters() {
                const configuredFilters = this.children
                    .filter((child) => meta(child, "type") === "energy_filter")
                    .map((child) => ({ value: meta(child, "value", child.title), title: child.title }));
                const vehicles = activeItems(this.activeCategoryItem && this.activeCategoryItem.children);
                const availableValues = [];
                vehicles.forEach((vehicle) => {
                    metaList(vehicle, "energy").forEach((value) => {
                        if (!availableValues.includes(value)) {
                            availableValues.push(value);
                        }
                    });
                });
                const configuredTitles = {};
                DEFAULT_ENERGY_FILTERS.concat(configuredFilters).forEach((filter) => {
                    configuredTitles[filter.value] = filter.title;
                });
                const orderedValues = configuredFilters
                    .filter((filter) => availableValues.includes(filter.value))
                    .map((filter) => filter.value)
                    .concat(availableValues.filter((value) => !configuredFilters.some((filter) => filter.value === value)));

                return orderedValues.map((value) => {
                    const vehicle = vehicles.find((item) => metaList(item, "energy").includes(value));
                    return {
                        value,
                        title: configuredTitles[value] || meta(vehicle, "energy_label_" + value, value)
                    };
                });
            },
            activeCategoryItem() {
                return this.categories[this.activeCategory] || null;
            },
            moreTitle() {
                if (this.activeEnergy) {
                    const energyTitles = {
                        electric: "saznajte više o E-Tech električnim vozilima",
                        hybrid: "saznajte više o E-Tech hibridnim vozilima",
                        hybridPlugin: "saznajte više o E-Tech hibridnim vozilima",
                        petrol: "saznajte više o benzinskim vozilima",
                        diesel: "saznajte više"
                    };
                    return this.text("more_title_" + this.activeEnergy, energyTitles[this.activeEnergy] || "saznajte više");
                }
                return meta(this.activeCategoryItem, "more_title", this.activeCategoryItem && this.activeCategoryItem.title);
            },
            visibleVehicles() {
                if (!this.activeCategoryItem) {
                    return [];
                }
                const energyTitles = {};
                this.energyFilters.forEach((energy) => { energyTitles[energy.value] = energy.title; });

                return activeItems(this.activeCategoryItem.children)
                    .map((vehicle, vehicleIndex) => {
                        const energies = metaList(vehicle, "energy");
                        return {
                            key: this.activeCategory + "-" + vehicleIndex,
                            title: vehicle.title,
                            url: vehicle.url,
                            target: vehicle.target,
                            price: meta(vehicle, "price"),
                            image: meta(vehicle, "image"),
                            imageLarge: meta(vehicle, "image_large"),
                            isPro: meta(this.activeCategoryItem, "pro") === "true",
                            ctaTitle: meta(vehicle, "cta_title", this.text("card_cta_title", "oktrijte ga")),
                            energies,
                            badges: energies.map((value) => ({
                                value,
                                title: energyTitles[value] || meta(vehicle, "energy_label_" + value, value),
                                isEv: EV_ENERGIES.includes(value)
                            }))
                        };
                    })
                    .filter((vehicle) => !this.activeEnergy || vehicle.energies.includes(this.activeEnergy));
            }
        },

        watch: {
            isActive(value) {
                if (!value) {
                    this.closeCard();
                    this.hideTooltip();
                }
            }
        },

        mounted() {
            document.addEventListener("click", this.hideTooltip);
            this.$el.parentElement.addEventListener("scroll", this.hideTooltip, true);
        },

        beforeDestroy() {
            document.removeEventListener("click", this.hideTooltip);
            if (this.$el.parentElement) {
                this.$el.parentElement.removeEventListener("scroll", this.hideTooltip, true);
            }
        },

        methods: {
            text(key, fallback) {
                return meta(this.item, key, fallback);
            },

            toggleFilters() {
                this.filtersOpen = !this.filtersOpen;
            },

            selectCategory(index) {
                this.activeCategory = index;
                this.activeEnergy = null;
                this.closeCard();
            },

            toggleEnergy(value) {
                this.activeEnergy = this.activeEnergy === value ? null : value;
                this.closeCard();
            },

            isMobileLayout() {
                return window.matchMedia("(max-width: 1279px)").matches;
            },

            // On mobile a tapped card is shown centered with an overlay.
            onCardClick(key, event) {
                if (!this.isMobileLayout() || event.target.closest(".VehicleModelCard__ctas")) {
                    return;
                }
                if (event.target.closest(".VehicleModelCard__close")) {
                    this.closeCard();
                    return;
                }
                this.centeredKey = key;
            },

            closeCard() {
                this.centeredKey = null;
            },

            showTooltip(trigger, text, event) {
                const element = event.currentTarget;
                this.tooltip = { visible: false, trigger, text, style: {} };
                this.$nextTick(() => {
                    const tooltipElement = this.$el.querySelector(".Tooltip__content");
                    const rect = element.getBoundingClientRect();
                    const margin = 8;
                    const centerX = rect.left + rect.width / 2;
                    const left = Math.min(Math.max(centerX - tooltipElement.offsetWidth / 2, margin), window.innerWidth - tooltipElement.offsetWidth - margin);
                    this.tooltip = {
                        visible: true,
                        trigger,
                        text,
                        style: {
                            left: left + "px",
                            top: (rect.top - tooltipElement.offsetHeight - 12) + "px",
                            "--tooltip-tick-left": (centerX - left) + "px"
                        }
                    };
                });
            },

            hideTooltip() {
                if (this.tooltip.visible || this.tooltip.trigger) {
                    this.tooltip = { visible: false, trigger: null, text: this.tooltip.text, style: this.tooltip.style };
                }
            },

            toggleTooltip(trigger, text, event) {
                if (this.tooltip.trigger === trigger) {
                    this.hideTooltip();
                } else {
                    this.showTooltip(trigger, text, event);
                }
            }
        }
    }
</script>
