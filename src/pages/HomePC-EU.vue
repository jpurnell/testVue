<template>
<div class="homePC-wrapper">
  <!-- Quote -->
  <div class="swiper-container swiper-celeb-fans" ref="quoteSlider">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="hp-hero-wrap">
          <div class="swiper-button-wrapper">
            <div class="swiper-button-prev swiper-hero swiper-button-white"></div>
            <div class="swiper-button-next swiper-hero swiper-button-white"></div>
          </div>
          <a class="main-hp" :href="prodUrl('mattressBaseSet')" id="HP_hero_bed">
            <div class="img-wrap">
              <picture>
                <source srcset="~assets/images/banners/mo-bed-mob.jpg" media="(max-width: 768px)">
                <img data-aos="zoom-out" data-aos-delay="0" src="~assets/images/banners/mo-bed.jpg" :alt="i18n('$local.$hpCopy.heroHeading_1')" @load="emitTopImageLoaded" rel="preload">
              </picture>
            </div>
            <div data-aos="fade" data-aos-delay="500" class="stack">
              <h1 data-aos="fade-up" data-aos-delay="600">
                <span class="title-italic">{{i18n('$local.$hpCopy.heroHeading_1')}}</span> {{i18n('$local.$hpCopy.heroSubHeading_1')}}
              </h1>
              <p data-aos="fade-up" data-aos-delay="750" class="btn-main">
                <span>{{i18n('$common.$buttons.shopNow')}}</span>
              </p>
            </div>
          </a>
        </div>
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/banners/hp-fans-of-mo-mob.jpg" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit')}}</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="hp-hero-wrap">
          <div class="swiper-button-wrapper">
            <div class="swiper-button-prev swiper-hero swiper-button-white"></div>
            <div class="swiper-button-next swiper-hero swiper-button-white"></div>
            </div>
          <a class="main-hp" :href="catUrl('bathSpa')" id="HP_hero_bed">
            <div class="img-wrap">
              <picture>
                <source srcset="~assets/images/banners/mo-hero-bath-mob.jpg" media="(max-width: 768px)">
                <img data-aos="zoom-out" data-aos-delay="0" src="~assets/images/banners/mo-hero-bath.jpg" :alt="i18n('$local.$hpCopy.heroHeading_2')">
              </picture>
            </div>
            <div data-aos="fade" data-aos-delay="500" class="stack">
              <h1 data-aos="fade-up" data-aos-delay="600">
                <span class="title-italic">{{i18n('$local.$hpCopy.heroHeading_2')}}</span> {{i18n('$local.$hpCopy.heroSubHeading_2')}}
              </h1>
              <p data-aos="fade-up" data-aos-delay="750" class="btn-main">
                <span>{{i18n('$common.$buttons.shopNow')}}</span>
              </p>
            </div>
          </a>
        </div>
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/banners/hp-fans-of-mo-4-mob.jpg" media="(max-width: 768px)">
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
        <div class="hp-hero-wrap">
          <div class="swiper-button-wrapper">
            <div class="swiper-button-prev swiper-hero swiper-button-white"></div>
            <div class="swiper-button-next swiper-hero swiper-button-white"></div>
            </div>
          <a class="main-hp" :href="catUrl('fragrance')" id="HP_hero_bed">
            <div class="img-wrap">
              <picture>
                <source srcset="~assets/images/banners/mo-hero-spa-mob.jpg" media="(max-width: 768px)">
                <img data-aos="zoom-out" data-aos-delay="0" src="~assets/images/banners/mo-hero-spa.jpg" :alt="i18n('$local.$hpCopy.heroHeading_3')">
              </picture>
            </div>
            <div data-aos="fade" data-aos-delay="500" class="stack">
              <h1 data-aos="fade-up" data-aos-delay="600">
                <span class="title-italic">{{i18n('$local.$hpCopy.heroHeading_3')}}</span> {{i18n('$local.$hpCopy.heroSubHeading_3')}}
              </h1>
              <p data-aos="fade-up" data-aos-delay="750" class="btn-main">
                <span>{{i18n('$common.$buttons.shopNow')}}</span>
              </p>
            </div>
          </a>
          </div>
        <div class="fans-of-mo">
          <div class="fans-image-wrap">
            <picture>
              <source srcset="~assets/images/banners/hp-fans-of-mo-3-mob.jpg" media="(max-width: 768px)">
              <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-fans-of-mo-3.jpg">
            </picture>
          </div>
          <div class="fans-quote">
            <p>{{i18n('$local.$hpCopy.quote_3')}}</p>
            <p class="quote-credit">{{i18n('$local.$hpCopy.quoteCredit_3')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
  <!--Bedding-->
  <div class="bedding clearfix">
    <div class="branding-hero">
      <a :href="catUrl('bedBedding')" id="HP_bed_bedding-image">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/banners/hp-bedding-sets-mob.jpg" media="(max-width: 768px)">
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
            <a :href="catUrl('bedBedding')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
        <div class="bedding-products">
          <a class="bedding-product-wrap" :href="catUrl('linens')" id="HP_bedding_bedding-set">
            <picture>
              <source srcset="~assets/images/banners/hp-bedding-mob.jpg" media="(max-width: 768px)">
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
  <div class="bath-body clearfix">
    <div class="outer-wrap">
      <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
        <div class="title">
          <div class="bg-element"></div>
          <div class="color-bg-element"></div>
          <div class="inner-title">
            <h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.bathBodyHeading')}}</h2>
            <p>{{i18n('$local.$hpCopy.bathBodyText')}}</p>
            <a :href="catUrl('bathSpa')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
      </div>
    </div>
    <div class="branding-hero">
      <a :href="catUrl('bathSpa')" id="HP_bath_spa">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/banners/HP-Bath-Spa-mob.jpg" media="(max-width: 768px)">
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
        <div class="swiper-container swiper-spa" ref="spaSlider">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="spa clearfix">
                <div class="branding-hero">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                  </div>
                  <a :href="catUrl('bathBody')" id="HP_bath-body-image">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/banners/hp-bath-body-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Bath-Body.jpg" :alt="i18n('$local.$hpCopy.bathSlideHeading_bathBody')">
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
                        <span class="h2-wrap"><h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.bathSlideHeading_bathBody')}}</h2></span>
                        <p>{{i18n('$local.$hpCopy.bathSlideText_bathBody')}}</p>
                        <a :href="catUrl('bathBody')" id="HP_bath-body"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
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
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                  </div>
                  <a :href="catUrl('signatureTowels')" id="HP_towels-image">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/banners/HP-Towels-mob.jpg" media="(max-width: 768px)">
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
                        <span class="h2-wrap"><h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.bathSlideHeading_towels')}}</h2></span>
                        <p>{{i18n('$local.$hpCopy.bathSlideText_towels')}}</p>
                        <a :href="catUrl('signatureTowels')" id="HP_towels"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
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
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                  </div>
                  <a :href="catUrl('robes')" id="HP_robes-image">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/banners/HP-Robes-mob.jpg" media="(max-width: 768px)">
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
                        <span class="h2-wrap"><h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.bathSlideHeading_bathrobe')}}</h2></span>
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
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-1 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-1 swiper-button-white"></div>
                  </div>
                  <a :href="catUrl('fragrance')" id="HP_fragrance">
                    <div class="img-wrap-tall">
                      <picture>
                        <source srcset="~assets/images/banners/HP-Fragrance-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/HP-Fragrance.jpg" :alt="i18n('$local.$hpCopy.bathSlideHeading_fragrance')">
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
                        <span class="h2-wrap"><h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.bathSlideHeading_fragrance')}}</h2></span>
                        <p>{{i18n('$local.$hpCopy.bathSlideText_fragrance')}}</p>
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
            <h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.littleFansHeading')}}</h2>
            <p v-html="i18n('$local.$hpCopy.littleFansText')"></p>
            <a :href="catUrl('littleFans')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="branding-hero">
      <a :href="catUrl('minimoLinens')" id="HP_little_fans-bedding">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/banners/hp-little-fans-bedding-mob.jpg" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-little-fans-bedding.jpg" :alt="i18n('$local.$category.littleFansBedding')">
          </picture>
        </div>
      </a>
      <a :href="prodUrl('minimoSlippers')" id="HP_little_fans-slippers">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/banners/hp-little-fans-slippers-mob.jpg" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-little-fans-slippers.jpg" :alt="i18n('$local.$category.littleFansSlippers')">
          </picture>
        </div>
      </a>
    </div>
  </div>
  <!--Exclusives-->
  <div class="exclusives clearfix">
    <div class="branding-hero">
      <a :href="catUrl('signatureGifts')" id="HP_mo_signature_gifts-image">
        <div class="img-wrap-tall">
          <picture>
            <source srcset="~assets/images/banners/hp-slippers-mob.jpg" media="(max-width: 768px)">
            <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-exclusives.jpg" :alt="i18n('$local.$hpCopy.signatureHeading')">
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
            <h2 data-aos="fade-up" data-aos-delay="200">{{i18n('$local.$hpCopy.signatureHeading')}}</h2>
            <p v-html="i18n('$local.$hpCopy.signatureText')"></p>
            <a :href="catUrl('signatureGifts')" id="HP_mo_slippers"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
          </div>
        </div>
        <div class="exclusives-products">
          <a class="exclusives-product-wrap" :href="prodUrl('slippers')" id="HP_bedding_bedding-set">
            <picture>
              <source srcset="~assets/images/banners/hp-exclusives-mob.jpg" media="(max-width: 768px)">
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
        <div class="swiper-container swiper-hotel-exclusives" ref="hotelsSlider">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-slide-fan">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap guangzhou">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_fan')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_fan')}}</p>
                        <a :href="prodUrl('fanByVivienne')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="prodUrl('fanByVivienne')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-fan.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-fan.jpg" :alt="i18n('$local.$product.fanByVivienne')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-scarf-mob.jpg" :alt="i18n('$local.$product.scarf')">
                    </picture>
                  </div>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-scarf">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap bangkok">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_scarf')" />
                        <p v-html="i18n('$local.$hpCopy.exclusivesSlideText_scarf')"></p>
                        <a :href="prodUrl('scarfByJim')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="prodUrl('scarfByJim')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-scarf-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-scarf.jpg" :alt="i18n('$local.$product.scarf')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-yukatas-mob.jpg" :alt="i18n('$local.$product.japaneseYukata')">
                    </picture>
                  </div>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-yukatas">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap tokyo">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_yukatas')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_yukatas')}}</p>
                        <a :href="prodUrl('japaneseYukata')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="prodUrl('japaneseYukata')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-yukatas-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-yukatas.jpg" :alt="i18n('$local.$product.japaneseYukata')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-books-comp-mob.jpg" :alt="i18n('$local.$product.japaneseYukata')">
                    </picture>
                  </div>
                </div>

              </div>
            </div>
            <div class="swiper-slide swiper-slide-cookbook">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap books">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_cookbook')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_cookbook')}}</p>
                        <a :href="prodUrl('hestonCookbook')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="prodUrl('hestonCookbook')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-books-comp-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-books-comp.jpg" :alt="i18n('$local.$product.iceBucket')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-towels-mob.jpg" :alt="i18n('$local.$category.tasselTowels')">
                    </picture>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide swiper-slide-towels">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_towels')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_towels')}}</p>
                        <a :href="catUrl('tassleTowels')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="catUrl('tassleTowels')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-towels-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-towels.jpg" :alt="i18n('$local.$category.tasselTowels')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-ice-bucket-mob.jpg" :alt="i18n('$local.$product.hongKongIceBucket')">
                    </picture>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide swiper-slide-bucket">
              <div class="hotel-exclusives clearfix">
                <div class="outer-exc-wrap hong-kong">
                  <div class="inner-exc-wrap" data-aos="fade" data-aos-delay="30">
                    <div class="exc-title">
                      <div class="exc-inner-title">
                        <h2 data-aos="fade-up" data-aos-delay="200" v-html="i18n('$local.$hpCopy.exclusivesSlideHeading_bucket')" />
                        <p>{{i18n('$local.$hpCopy.exclusivesSlideText_bucket')}}</p>
                        <a :href="prodUrl('hongKongIceBucket')"><span class="btn-main">{{i18n('$common.$buttons.shopNow')}}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="hotel-exc-img-wrap last-slide">
                  <div class="swiper-button-wrapper">
                    <div class="swiper-button-prev swiper-mod-2 swiper-button-white"></div>
                    <div class="swiper-button-next swiper-mod-2 swiper-button-white"></div>
                  </div>
                  <a :href="prodUrl('hongKongIceBucket')" id="HP_tassel_towels-image">
                    <div class="hotel-exc-img">
                      <picture>
                        <source srcset="~assets/images/banners/hp-hotel-exclusives-ice-bucket-mob.jpg" media="(max-width: 768px)">
                        <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-hotel-exclusives-ice-bucket.jpg" :alt="i18n('$local.$product.hongKongIceBucket')">
                      </picture>
                    </div>
                  </a>
                  <div class="hotel-exc-img-preview">
                    <picture>
                      <source srcset="~assets/images/misc/fill.gif" media="(max-width: 1024px)">
                      <img src="~assets/images/banners/hp-hotel-exclusives-fan-mob.jpg" :alt="i18n('$local.$product.fan')">
                    </picture>
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
</template>
<script>
import { mapState, mapActions } from 'vuex'

import metaImage from './../assets/images/products/shopmo-firm-feather-down-pillow-man.jpeg'

// import promotion from './../components/Promotion'
export default {
  components: {
    // promotion
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
        loop: true,
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
        loop: true,
        loopAdditionalSlides: 1,
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
        navigation: {
          nextEl: '.swiper-button-next.swiper-hero',
          prevEl: '.swiper-button-prev.swiper-hero'
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
  // directives: {
  //   swiper: directive
  // },
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
        ogUrl: { name: 'og:url', content: 'https://shopmo.com/' + this.lang },
        ogImage: { name: 'og:image', content: metaImage }
        // ogSiteName: { name: 'og:site_name', content: 'shopmo.com' }
      },
      link: {
        'canonical': { rel: 'canonical', href: 'https://shopmo.com/' + this.lang + '/' },
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
      // Destroy and create swipers to fix lang bug with duplicate slide
      this.quoteSlider.destroy()
      this.spaSlider.destroy()
      this.hotelsSlider.destroy()
      this.$nextTick(() => {
        this.quoteSlider = new window.Swiper(this.$refs.quoteSlider, this.swiperOptionsQuote)
        this.spaSlider = new window.Swiper(this.$refs.spaSlider, this.swiperOptionsSpa)
        this.hotelsSlider = new window.Swiper(this.$refs.hotelsSlider, this.swiperOptionsHotel)
      })
    },
    currency: function (val, oldVal) {
      this.setHomePc({})
    },
    'homePc.banner': function (val, oldVal) {
      this.homeInit(this.homePc)
    },
    'homePc.page_title': function (val, oldVal) {
      this.homeInit(this.homePc)
    },
    componentsReady: function (newVal, oldVal) {
      this.quoteSlider = new window.Swiper(this.$refs.quoteSlider, this.swiperOptionsQuote)
      this.spaSlider = new window.Swiper(this.$refs.spaSlider, this.swiperOptionsSpa)
      this.hotelsSlider = new window.Swiper(this.$refs.hotelsSlider, this.swiperOptionsHotel)
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
      return this.lang + '/p/' + this.$i18n.t('$local.$urls.$product.' + value)
    },
    catUrl (value) {
      return this.lang + '/c/' + this.$i18n.t('$local.$urls.$category.' + value)
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
    },
    emitTopImageLoaded () {
      this.$emit('topImageLoaded')
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
