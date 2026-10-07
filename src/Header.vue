<template>
    <div class="rna-hf">
        <header :class="{ 'is-panel-open': activePanel !== null, 'is-open': mobileOpen, 'scroll': scrolled }">
            <div class="header-left-container">
                <div class="header-logo-wrapper">
                    <a :href="basicInformation.site_url || '#'" :title="basicInformation.site_title">
                        <img v-if="basicInformation.logo_url" :src="basicInformation.logo_url" :alt="basicInformation.site_title">
                        <HeaderIcon v-else icon="logo" viewBox="0 0 66 86" class="MainHeaderV2__logo is-renault" />
                    </a>
                </div>

                <nav id="main-nav">
                    <div class="mobile-close-container" @click="toggleMobileMenu">
                        <span class="close-btn-icon">
                            <HeaderIcon icon="close" class="MainHeaderV2__buttonIcon" />
                        </span>
                        <span class="close-btn-text">{{ metaText('mobile_close_title', 'zatvorite') }}</span>
                    </div>

                    <HeaderSwitch v-if="switchNavigation.length" :items="switchNavigation" mobile />

                    <ul>
                        <DropdownLink
                            v-for="(navigationItem, itemIndex) in mainNavigation"
                            :key="itemIndex"
                            :item="navigationItem"
                            :itemIndex="itemIndex"
                            :isActive="activePanel === itemIndex"
                            @toggleDropdown="toggleDropdown"
                        />
                    </ul>

                    <div class="mobile-secondary-cta">
                        <a v-for="(action, actionIndex) in mobileActions" :key="actionIndex" :href="action.url" :target="action.target || '_self'">
                            <span class="mobile-secondary-cta-icon">
                                <HeaderIcon :icon="action.icon" class="MainHeaderV2__secondaryLinkIcon" />
                            </span>
                            <span class="mobile-secondary-cta-text">{{ action.title }}</span>
                        </a>
                    </div>
                </nav>

                <HeaderSwitch v-if="switchNavigation.length" :items="switchNavigation" />
            </div>

            <div class="header-right-container">
                <template v-for="(action, actionIndex) in topNavigation">
                    <div class="secondary-dropdown-container" v-if="action.children && action.children.length" :key="actionIndex">
                        <a :href="action.url || '#'" :target="action.target || '_self'" class="has-secondary-dropdown">
                            <span class="icon"><HeaderIcon :icon="action.icon" class="MainHeaderV2__buttonIcon" /></span>
                            <span>{{ action.title }}</span>
                        </a>
                        <div class="secondary-dropdown-wrapper">
                            <a v-for="(child, childIndex) in action.children" :key="childIndex" :href="child.url" :target="child.target || '_self'">
                                <span class="icon"><HeaderIcon :icon="child.icon" class="MainHeaderEntry__iconItem" /></span>
                                <span>{{ child.title }}</span>
                            </a>
                        </div>
                    </div>
                    <a v-else :key="actionIndex" :href="action.url" :target="action.target || '_self'">
                        <span class="icon"><HeaderIcon :icon="action.icon" class="MainHeaderV2__buttonIcon" /></span>
                        <span>{{ action.title }}</span>
                    </a>
                </template>

                <div class="header-mobile-icon-wrapper" @click="toggleMobileMenu">
                    <span class="icon"><HeaderIcon icon="menu" class="MainHeaderV2__buttonIcon" /></span>
                    <span>{{ metaText('mobile_menu_title', 'meni') }}</span>
                </div>
            </div>

            <div id="navigation-panels">
                <Dropdown
                    v-for="(navigationItem, itemIndex) in mainNavigation"
                    :key="itemIndex"
                    :item="navigationItem"
                    :itemIndex="itemIndex"
                    :isActive="activePanel === itemIndex"
                    :closeTitle="metaText('mobile_close_title', 'zatvorite')"
                    @back="closePanels"
                    @close="closeAll"
                />
            </div>
        </header>
    </div>
</template>

<script>
    import axios from 'axios';
    import Dropdown from "@/components/Dropdown";
    import DropdownLink from "@/components/DropdownLink";
    import HeaderIcon from "@/components/HeaderIcon";
    import HeaderSwitch from "@/components/HeaderSwitch";
    import { meta, metaBool, activeItems } from "@/utils";

    export default {
        components: { Dropdown, DropdownLink, HeaderIcon, HeaderSwitch },
        name: 'Header',
        props: {
            url: String
        },
        created() {
            if ("HEADER_FOOTER_SETTINGS" in window) {
                this.fetchNavigation(window.HEADER_FOOTER_SETTINGS.apiUri);
            } else {
                if (this.url) {
                    this.fetchNavigation(this.url);
                }
            }

            window.addEventListener('click', this.del)
            window.addEventListener('scroll', this.updateScroll, { passive: true });
            this.updateScroll();
        },
        data() {
            return {
                mobileOpen: false,
                scrolled: false,
                basicInformation: {},
                topNavigation: [],
                mainNavigation: [],
                switchNavigation: [],
                activePanel: null
            }
        },
        beforeDestroy() {
            window.removeEventListener('click', this.del)
            window.removeEventListener('scroll', this.updateScroll)
            document.documentElement.classList.remove('no-scroll');
        },

        computed: {
            // Top navigation items flagged with meta.mobile are repeated in the mobile menu.
            mobileActions() {
                return this.topNavigation.filter((action) => metaBool(action, 'mobile'));
            }
        },

        watch: {
            activePanel(value) {
                document.documentElement.classList.toggle('no-scroll', value !== null);
            }
        },

        methods: {
            metaText(key, fallback) {
                return meta(this.basicInformation, key, fallback);
            },

            toggleDropdown(index) {
                this.activePanel = this.activePanel === index ? null : index;
            },

            closePanels() {
                this.activePanel = null;
            },

            closeAll() {
                this.activePanel = null;
                this.mobileOpen = false;
            },

            fetchNavigation(apiUri) {
                axios.get(apiUri)
                    .then((response) => {
                        const data = response.data;
                        this.basicInformation = data;
                        this.topNavigation = activeItems(data.top_navigation && data.top_navigation.schema);
                        this.mainNavigation = activeItems(data.main_navigation && data.main_navigation.schema);
                        this.switchNavigation = activeItems(data.switch_navigation && data.switch_navigation.schema);
                    })
            },

            toggleMobileMenu() {
                this.mobileOpen = !this.mobileOpen;
                if (!this.mobileOpen) {
                    this.closePanels();
                }
            },

            // Click outside of tabs and panels closes the open panel.
            del(event) {
                if (!event.target.closest('.navigation-panel, .tab, .mobile-close-container, .header-mobile-icon-wrapper')) {
                    this.closePanels();
                }
            },

            updateScroll() {
                this.scrolled = window.scrollY > 0;
            }
        }
    }
</script>

<style>
    @import './assets/css/main.css';
</style>
