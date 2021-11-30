<template>
<div class="homePC-wrapper">
  <promotion :banner="banner" :banner-mobile="bannerMobile" :is-home="true" class="home-promotion" />
  <!-- Quote -->
  <div class="swiper-container swiper-celeb-fans" v-swiper:mySwiperQuote="swiperOptionsQuote" v-show="componentsReady">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo-3.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote_3')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit_3')}}</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo-2.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote_2')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit_2')}}</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo-4.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote_4')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit_4')}}</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
  <!--Bedding-->
  <div class="bedding clearfix">
    <div class="branding-hero">
      <a :href="catUrl('bed-bedding')" id="HP_bed_bedding-image">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img src="~assets/images/banners/hp-bedding.jpg" :alt="i18n('$local.$category.bedding')">
          </picture>
        </div>
      </a>
    </div>
    <div class="outer-wrap">
      <div class="inner-wrap">

        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <h2>{{i18n('$local.$hpCopy.beddingHeading')}}</h2>
            <p>{{i18n('$local.$hpCopy.beddingText')}}</p>
            <a :href="catUrl('bed-bedding')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
        <div class="bedding-products">
          <a class="bedding-product-wrap" :href="catUrl('linens')" id="HP_bedding_bedding-set">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img src="~assets/images/banners/hp-bedding-sets.jpg" :alt="i18n('$local.$category.linens')">
            </picture>
            <p class="hover-content">
              <span class="btn-main">{{i18n('$local.$category.linens')}} ></span>
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!--Bath Body-->
  <!-- <div class="bath-body clearfix">
    <div class="outer-wrap">
      <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.fragranceHeading')}}</h2>
            <p>{{i18n('$local.$hpCopy.fragranceText')}}</p>
            <a :href="catUrl('fragrance')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
      </div>
    </div>
    <div class="branding-hero">
      <a :href="catUrl('fragrance')" id="HP_bath_spa">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/cinemagraphs/HP-Fragrance.jpg" :alt="i18n('$local.$hpCopy.bathBodyHeading')">
          </picture>
        </div>
      </a>
    </div>
  </div> -->
  <div class="bath-body clearfix">
    <div class="outer-wrap">
      <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.bathBodyHeading')}}</h2>
            <p>{{i18n('$local.$hpCopy.bathBodyText')}}</p>
            <a :href="catUrl('bath-spa')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
      </div>
    </div>
    <div class="branding-hero">
      <a :href="catUrl('bath-spa')" id="HP_bath_spa">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Bath-Spa.jpg" :alt="i18n('$local.$hpCopy.bathBodyHeading')">
          </picture>
        </div>
      </a>
    </div>
  </div>
  <!--Spa-->
  <div class="spa-wrapper">
    <div class="spa-products">
      <div class="spa-product-wrap">
        <div class="swiper-container swiper-spa" v-swiper:mySwiper="swiperOptionsSpa">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="spa clearfix">
                <div class="branding-hero">
                  <a :href="catUrl('bathrobes')" id="HP_robes-image">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Robes.jpg" :alt="i18n('$local.$hpCopy.bathSlideHeading_bathrobe')">
                      </picture>
                    </div>
                  </a>
                </div>
                <div class="outer-wrap">
                  <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="title">
                      <div class="bg-element"></div>
                      <div class="color-bg-element"></div>
                      <div class="inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.bathSlideHeading_bathrobe')}}</h2>
                        <p>{{i18n('$local.$hpCopy.bathSlideText_bathrobe')}}</p>
                        <a :href="catUrl('robes')" id="HP_robes"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                        <div class="swiper-button-wrapper">
                          <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                          <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="spa clearfix">
                <div class="branding-hero">
                  <a :href="catUrl('signature-towels')" id="HP_towels-image">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Towels.jpg" :alt="i18n('$local.$hpCopy.bathSlideHeading_towels')">
                      </picture>
                    </div>
                  </a>
                </div>
                <div class="outer-wrap">
                  <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="title">
                      <div class="bg-element"></div>
                      <div class="color-bg-element"></div>
                      <div class="inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.bathSlideHeading_towels')}}</h2>
                        <p>{{i18n('$local.$hpCopy.bathSlideText_towels')}}</p>
                        <a :href="catUrl('signature-towels')" id="HP_towels"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                        <div class="swiper-button-wrapper">
                          <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                          <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="spa clearfix">
                <div class="branding-hero">
                  <a :href="catUrl('fragrance')" id="HP_fragrance">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Fragrance.jpg" :alt="i18n('$local.$hpCopy.fragranceHeading')">
                      </picture>
                    </div>
                  </a>
                </div>
                <div class="outer-wrap">
                  <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="title">
                      <div class="bg-element"></div>
                      <div class="color-bg-element"></div>
                      <div class="inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.fragranceHeading')}}</h2>
                        <p>{{i18n('$local.$hpCopy.fragranceText')}}</p>
                        <a :href="catUrl('fragrance')" id="HP_fragrance"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                        <div class="swiper-button-wrapper">
                          <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                          <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Little Fans-->
  <div class="little-fans clearfix">
    <div class="outer-wrap">
      <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <div class="text-wrap">
            <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.littleFansHeading')}}</h2>
            <p v-html="i18n('$local.$hpCopy.littleFansText')"></p>
            <a :href="catUrl('little-fans')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="branding-hero">
      <a :href="catUrl('little-fans')" id="HP_little_fans-bedding">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-little-fans-bedding.jpg" :alt="i18n('$local.$category.littleFansBedding')">
          </picture>
        </div>
      </a>
      <a :href="prodUrl('little-fans_minimo-slippers')" id="HP_little_fans-slippers">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-little-fans-slippers.jpg" :alt="i18n('$local.$category.littleFansSlippers')">
          </picture>
        </div>
      </a>
    </div>
  </div>
  <!--Exclusives-->
  <div class="exclusives clearfix">
    <div class="branding-hero">
      <a :href="catUrl('m-o-signature-gifts')" id="HP_mo_signature_gifts-image">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-exclusives2.jpg" :alt="i18n('$local.$hpCopy.signatureHeading')">
          </picture>
        </div>
      </a>
    </div>
    <div class="outer-wrap">
      <div class="inner-wrap" data-aos="fade" data-aos-delay="30">

        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.signatureHeading')}}</h2>
            <p v-html="i18n('$local.$hpCopy.signatureText')"></p>
            <a :href="catUrl('m-o-signature-gifts')" id="HP_mo_slippers"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
        <div class="exclusives-products">
          <a class="exclusives-product-wrap" :href="prodUrl('slippers_aquazzura-slippers')" id="HP_bedding_bedding-set">
            <picture>
              <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
              <img data-aos="fade" data-aos-delay="400" src="~assets/images/banners/hp-slippers.jpg"
                :alt="i18n('$local.$category.slippers')">
            </picture>
            <p class="hover-content">
              <span class="btn-main">{{i18n('$local.$category.slippers')}} ></span>
            </p>
          </a>

        </div>
      </div>
    </div>
  </div>
  <!--Hotel Exclusives-->
  <div class="hotel-exclusives-wrapper">
    <div class="headline-wrap">
      <h2>{{i18n('$local.$hpCopy.exclusivesHeading')}}</h2>
      <p>{{i18n('$local.$hpCopy.exclusivesText')}}</p>
    </div>
    <div class="hotel-exclusives-products">
      <div class="hotel-exclusives-product-wrap">
        <div class="swiper-container swiper-hotel-exclusives" v-swiper:mySwiperHotel="swiperOptionsHotel">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-slide-fan">
              <div class="hotel-exclusives clearfix">
                <div class="swiper-button-wrapper">
                  <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                  <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                </div>
                <div class="outer-exc-wrap guangzhou">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_fan')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_fan')}}</p>
                        <a :href="prodUrl('hotel-exclusives_fan-by-vivienne-tam')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <a :href="prodUrl('hotel-exclusives_fan-by-vivienne-tam')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-fan.jpg" :alt="i18n('$local.$product.fan')">
                      </picture>
                    </div>
                  </a>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-scarf">
              <div class="hotel-exclusives clearfix">
                <div class="swiper-button-wrapper">
                  <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                  <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                </div>
                <div class="outer-exc-wrap bangkok">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_scarf')" />
                        <p v-html="i18n('$local.$hpCopy.exclusivesSlideText_scarf')"></p>
                        <a :href="prodUrl('hotel-exclusives_scarf-by-jim-thompson')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <a :href="prodUrl('hotel-exclusives_scarf-by-jim-thompson')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-scarf.jpg" :alt="i18n('$local.$product.scarf')">
                      </picture>
                    </div>
                  </a>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-yukatas">
              <div class="hotel-exclusives clearfix">
                <div class="swiper-button-wrapper">
                  <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                  <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                </div>
                <div class="outer-exc-wrap tokyo">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_yukatas')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_yukatas')}}</p>
                        <a :href="prodUrl('hotel-exclusives_japanese-yukata')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <a :href="prodUrl('hotel-exclusives_japanese-yukata')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-yukatas.jpg" :alt="i18n('$local.$product.japaneseYukata')">
                      </picture>
                    </div>
                  </a>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-towels">
              <div class="hotel-exclusives clearfix">
                <div class="swiper-button-wrapper">
                  <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                  <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                </div>
                <div class="outer-exc-wrap">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_towels')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_towels')}}</p>
                        <a :href="catUrl('moroccan-tassel-towels')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <a :href="catUrl('moroccan-tassel-towels')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-towels.jpg" :alt="i18n('$local.$category.tasselTowels')">
                      </picture>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div class="swiper-slide swiper-slide-bucket">
              <div class="hotel-exclusives clearfix">
                <div class="swiper-button-wrapper">
                  <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                  <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                </div>
                <div class="outer-exc-wrap hong-kong">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="600" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_bucket')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_bucket')}}</p>
                        <a :href="prodUrl('hotel-exclusives_classic-hong-kong-ice-bucket')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hotel-exc-img-wrap last-slide">
                  <a :href="prodUrl('hotel-exclusives_classic-hong-kong-ice-bucket')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/misc/fill.gif" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-ice-bucket.jpg" :alt="i18n('$local.$product.hongKongIceBucket')">
                      </picture>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { directive } from 'vue-awesome-swiper'
// import traveling from '../components/home/Traveling'
// import metaImage from '../statics/img/orient-express.jpg'

import promotion from './../components/promotion/Banner'
export default {
  components: {
    promotion
    // traveling,
  },
  data () {
    return {
      banner: '',
      bannerMobile: '',
      title: '',
      activeSwiper: 0,
      // swiper options
      swiperOptionsSpa: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.swiper-button-next.swiper-mod-1',
          prevEl: '.swiper-button-prev.swiper-mod-1'
        },
        breakpoints: {
          960: {
            slidesPerView: 1.1,
            spaceBetween: 1
          }
        }
      },
      swiperOptionsHotel: {
        slidesPerView: 1,
        spaceBetween: 1,
        loop: false,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.swiper-button-next.swiper-mod-2',
          prevEl: '.swiper-button-prev.swiper-mod-2'
        }
      },
      swiperOptionsQuote: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 7500
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  props: {
    componentsReady: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    swiper: directive
  },
  meta () {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        ogTitle: { name: 'og:title', content: this.title },
        ogDescription: { name: 'og:description', content: this.metaDescription },
        // ogType: { name: 'og:type', content: 'website' },
        ogUrl: { name: 'og:url', content: 'https://shopmo.com/' + this.lang }
        // ogImage: { name: 'og:image', content: metaImage }
        // ogSiteName: { name: 'og:site_name', content: 'shopmo.com' }
      },
      link: {
        'en': { rel: 'alternate', href: 'https://na.shopmo.com/', hreflang: 'en' },
        'en-ie': { rel: 'alternate', href: 'https://shopmo.com/en/', hreflang: 'en-ie' },
        'de': { rel: 'alternate', href: 'https://shopmo.com/de/', hreflang: 'de' },
        'x-default': { rel: 'alternate', href: 'https://shopmo.com/', hreflang: 'x-default' }
      }
    }
  },
  computed: {
    ...mapState({
      homePc: state => state.site.homePc,
      lang: state => state.lang.lang
    })
  },
  watch: {
    lang: function (val, oldVal) {
      this.setHomePc({})
    },
    currency: function (val, oldVal) {
      this.setHomePc({})
    },
    'homePc.banner': function (val, oldVal) {
      this.homeInit(this.homePc)
    },
    'homePc.page_title': function (val, oldVal) {
      this.homeInit(this.homePc)
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setHomePc'
      ]
    ),
    i18n (value) {
      return this.$i18n.t(value)
    },
    prodUrl (value) {
      return this.lang + '/p/' + value
    },
    catUrl (value) {
      return this.lang + '/c/' + value
    },
    hpCopy (value) {
      return this.$i18n.t('$local.$hpCopy.' + value)
    },
    initData () {
      if (!this.homePc.page_title) {
        let formdata = {}
        this.setHomePc(formdata)
      } else {
        this.homeInit(this.homePc)
      }
    },
    homeInit (data) {
      this.title = data.meta_title || data.page_title || ''
      this.metaDescription = data.meta_description || ''
      this.metaKeywords = data.meta_keyword || ''
      this.banner = data.banner || ''
      this.bannerMobile = data.banner_mobile || ''
      // console.log('homeInit', TimelineLite, Back, Elastic, Expo)
    }
  },
  mounted () {
    // this.isDev = process.env.NODE_ENV === 'development'
    this.isDev = false
  },
  created () {
    this.initData()
  }
}
</script>
