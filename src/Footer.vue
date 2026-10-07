<template>
    <div class="rna-hf">
        <footer>
            <div class="footer-top-container">
                <a href="#" class="return-to-top-button" @click.prevent="scrollToTop">
                    <span>{{ metaText('back_to_top_title', 'vratite se na početak stranice') }}</span>
                    <span class="footer-icon"></span>
                </a>

                <div class="footer-cta-container" v-if="ctaNavigation.length">
                    <a v-for="(cta, ctaIndex) in ctaNavigation" :key="ctaIndex" :href="cta.url" :target="cta.target || '_self'">
                        <span class="footer-cta-icon">
                            <FooterIcon :icon="cta.icon" />
                        </span>
                        <span>{{ cta.title }}</span>
                    </a>
                </div>

                <div class="footer-links-container">
                    <div class="footer-links-wrapper">
                        <div
                            v-for="(item, itemIndex) in mainFooter"
                            :key="itemIndex"
                            :class="['footer-links-column', { 'is-open': isVisible(itemIndex) }]"
                        >
                            <div class="title" @click.prevent="toggle(itemIndex)">
                                <span>{{ item.title }}</span>
                                <span class="icon-chevron-down">
                                    <HeaderIcon icon="chevron-down" class="FooterColumn__SvgIcon" />
                                </span>
                            </div>
                            <ul>
                                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                                    <a :title="child.title" :href="child.url" :target="child.target || '_self'">{{ child.title }}</a>
                                </li>
                            </ul>
                        </div>

                        <div class="footer-links-column" v-if="socialGroup">
                            <div class="footer-social-container">
                                <span class="title">{{ socialGroup.title }}</span>
                                <div class="footer-social-wrapper">
                                    <a v-for="(social, socialIndex) in socialGroup.children" :key="socialIndex" :href="social.url" :title="social.title" target="_blank" rel="nofollow noopener">
                                        <FooterIcon :icon="social.icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bottom-container">
                <div class="footer-bottom-links-container">
                    <div class="footer-bottom-links">
                        <a v-for="(legalItem, legalItemIndex) in legalNavigation" :key="legalItemIndex" :title="legalItem.title" :href="legalItem.url" :target="legalItem.target ? legalItem.target : '_self'">{{ legalItem.title }}</a>
                    </div>
                    <div class="footer-bottom-copy">{{ footer_trademark }}</div>
                </div>
                <div class="footer-bottom-extra" v-if="footer_disclaimer">
                    <p>{{ footer_disclaimer }}</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import axios from "axios";
    import HeaderIcon from "@/components/HeaderIcon";
    import FooterIcon from "@/components/FooterIcon";
    import { meta, activeItems } from "@/utils";

    export default {
        name: "Footer",
        components: { HeaderIcon, FooterIcon },
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
        },

        data() {
            return {
                visibleIndex: null,
                basicInformation: {},
                ctaNavigation: [],
                mainFooter: [],
                socialNavigation: [],
                legalNavigation: []
            }
        },

        computed: {
            footer_trademark() {
                return meta(this.basicInformation, 'footer_trademark', '');
            },
            footer_disclaimer() {
                return meta(this.basicInformation, 'footer_disclaimer', '');
            },
            // First group of social_navigation holds the title and the social links.
            socialGroup() {
                return this.socialNavigation[0] || null;
            }
        },
        methods: {
            metaText(key, fallback) {
                return meta(this.basicInformation, key, fallback);
            },

            fetchNavigation(apiUri) {
                axios.get(apiUri)
                    .then((response) => {
                        const data = response.data;
                        this.basicInformation = data;
                        this.ctaNavigation = activeItems(data.footer_cta_navigation && data.footer_cta_navigation.schema);
                        this.mainFooter = activeItems(data.mainfooter && data.mainfooter.schema);
                        this.socialNavigation = activeItems(data.social_navigation && data.social_navigation.schema);
                        this.legalNavigation = activeItems(data.legal_navigation && data.legal_navigation.schema);
                    })
            },
            isVisible(itemIndex) {
                return this.visibleIndex === itemIndex;
            },

            // Accordion on mobile, columns are always open on desktop.
            toggle(itemIndex) {
                if (this.visibleIndex === itemIndex) {
                    this.visibleIndex = null;
                } else {
                    this.visibleIndex = Number(itemIndex);
                }
            },

            scrollToTop() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
</script>

<style>
    @import './assets/css/main.css';
</style>
