import React, { Component } from 'react';
import Slider from 'react-slick';

// components
import Footer from '../components/Footer';
import Header from '../components/Header';

// assets
import circleChartIcon from 'assets/images/landing/circle-percent-chart.png';
import scanTravisIcon from 'assets/images/landing/scan-travis.png';
import user1BubbleIcon from 'assets/images/landing/user1-bubble.png';
import photo1 from 'assets/images/landing/photo1.png';
import chatmaticBubbleIcon from 'assets/images/landing/chatmatic-bubble.png';
import bkgIcons1 from 'assets/images/landing/bkg-icons1.png';
import arrowRightIcon from 'assets/images/landing/arrow-right.png';
import profile1Icon from 'assets/images/landing/profile1.png';
import userInfoIcon from 'assets/images/landing/icon-user-info.png';
import chatmaticIcon from 'assets/images/landing/icon-chatmatic.png';
import qualityScoreImg from 'assets/images/landing/quality-score.png';
import chart1Icon from 'assets/images/landing/chart1.png';
import chart2Icon from 'assets/images/landing/chart2.png';
import chatIcon from 'assets/images/landing/icon-chat.png';
import bkgIcons2 from 'assets/images/landing/bkg-icons2.png';
import sunglassIcon1 from 'assets/images/landing/icon-sunglass1.png';
import sunglassIcon2 from 'assets/images/landing/icon-sunglass2.png';
import downPointingHandIcon from 'assets/images/landing/down-pointing-hand.png';

import './styles.css';

class Landing extends Component {
  render() {
    return (
      <div className="bg-white">
        <div className="d-flex flex-column position-relative landing-scene-container">
          <div
            className="d-flex align-items-center position-relative content1-container"
            data-aos="fade"
          >
            <Header pathname={this.props.location.pathname} />
            <Slider className="w-100 slider-container" dots arrows={false}>
              <div className="d-flex flex-column justify-content-center slide1-container">
                <p>
                  Using Basic Automations To Get More Customers While Improving
                  Customers Service
                </p>
                <button className="btn btn-link p-0 d-flex align-items-center">
                  <span>CREATE YOUR FREE ACCOUNT</span>
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
              <div className="d-flex flex-column justify-content-center slide2-container">
                <p>
                  Messenger Doesn't Have To Be A Burden, It Can Be Your Biggest
                  Allie
                </p>
                <button className="btn btn-link p-0 d-flex align-items-center">
                  <span>CREATE YOUR FREE ACCOUNT</span>
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
              <div className="d-flex flex-column justify-content-center slide3-container">
                <p>
                  Get More Sales, Build Loyalty, Increase Customer Service, &
                  Reach Your Audience More Effectively
                </p>
                <button className="btn btn-link p-0 d-flex align-items-center">
                  <span>CREATE YOUR FREE ACCOUNT</span>
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
              <div className="d-flex flex-column justify-content-center slide4-container">
                <p>
                  Using CHatmatic Is Like Having A Full Time Marketing Team,
                  Working 24/7, But Is Easy Enough To Be Used By Every Business
                  Owner In Minutes
                </p>
                <button className="btn btn-link p-0 d-flex align-items-center">
                  <span>CREATE YOUR FREE ACCOUNT</span>
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
            </Slider>
          </div>
          <div
            className="position-relative d-flex align-items-center content2-container"
            data-aos="fade"
          >
            <img src={bkgIcons2} alt="" className="position-absolute" />
            <div className="d-flex flex-column container content2-left-container">
              <span className="content-title">Driving Sales</span>
              <span className="content-header">
                53% of consumers are more likely to shop with a business they
                can Message.
              </span>
              <span className="content-description">
                We live in a world that looks for instant feedback and Chatmatic
                gives you that opportunity through using automations,
                broadcasts, and more!
              </span>
              <span className="content-description">
                *Coming soon: A Rich Integration With Shopify Allowing You To
                Retarget to people who abandon their cart automatically through
                Messenger, Add them to a subscriber list allowing you to follow
                up with notifcations, and more!
              </span>
              <div className="d-inline-block">
                <button className="btn btn-link btn-content-action">
                  Use Chatmatic to Get More Sales
                </button>
              </div>
            </div>
            <div className="d-flex flex-column content2-right-container">
              <div className="d-flex justify-content-end product-container">
                <div className="d-flex flex-column product-content">
                  <img src={sunglassIcon1} alt="" />
                  <div className="d-flex flex-column product-info">
                    <span className="product-price">$123.00</span>
                    <span className="product-brand">
                      HOLBROOK
                      <sup>TM</sup> XL
                    </span>
                    <span className="product-color">Warm Gray</span>
                  </div>
                  <button className="btn btn-link btn-add-cart">
                    Add To Cart
                  </button>
                  <button className="btn btn-link btn-product-details">
                    Product Details
                  </button>
                  <button className="btn btn-link btn-reviews">Reviews</button>
                </div>
                <div className="d-flex flex-column product-content">
                  <img src={sunglassIcon2} alt="" />
                  <div className="d-flex flex-column product-info">
                    <span className="product-price">$153.00</span>
                    <span className="product-brand">
                      HOLBROOK
                      <sup>TM</sup> MIX
                    </span>
                    <span className="product-color">Gray</span>
                  </div>
                  <button className="btn btn-link btn-add-cart">
                    Add To Cart
                  </button>
                  <button className="btn btn-link btn-product-details">
                    Product Details
                  </button>
                  <button className="btn btn-link btn-reviews">Reviews</button>
                </div>
              </div>
              <div className="d-flex flex-column chat-container content2-chat-container">
                <div className="d-flex justify-content-end align-items-center">
                  <span className="chat-user1">Let me get you a link</span>
                  <img
                    src={chatmaticBubbleIcon}
                    alt=""
                    className="img-chat-bubble"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <img
                    src={user1BubbleIcon}
                    alt=""
                    className="img-chat-bubble"
                  />
                  <span className="chat-user2">
                    These are great! Where can I buy
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex align-items-center content3-container"
            data-aos="fade"
          >
            <div className="d-flex flex-column align-items-center content3-left-container">
              <div className="d-flex w-100 align-items-center content3-header">
                <div className="d-flex justify-content-between align-items-center user-info">
                  <div className="d-flex align-items-center">
                    <img src={profile1Icon} alt="" width={30} height={30} />
                    <span className="text-name">Robert Edwards</span>
                  </div>
                  <img
                    src={userInfoIcon}
                    className="img-user-info"
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="header-info text-subscriber">Subscriber</span>
                <span className="header-info text-sex">M</span>
                <span className="header-info text-location">CA, USA</span>
                <img
                  className="header-info"
                  src={chatmaticIcon}
                  alt=""
                  width={28}
                  height={20}
                />
              </div>

              <div className="d-flex justify-content-center chart-container">
                <div className="d-flex chart-content">
                  <img src={chart1Icon} alt="" />
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <p className="message-count">2,341</p>
                      <span className="message-type">MESSAGES SENT</span>
                    </div>
                    <div className="d-flex chat-percent">
                      <img src={chatIcon} alt="" />
                      <span>34%</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex chart-content">
                  <img src={chart2Icon} alt="" />
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <p className="message-count">1,813</p>
                      <span className="message-type">MESSAGES READ</span>
                    </div>
                    <div className="d-flex chat-percent">
                      <img src={chatIcon} alt="" />
                      <span>66%</span>
                    </div>
                  </div>
                </div>
              </div>

              <img src={qualityScoreImg} alt="" className="img-quality-score" />
            </div>
            <div className="d-flex flex-column container content3-right-container">
              <span className="content-title">Reaching Customers</span>
              <span className="content-header">
                80% of adults and 91% of teens use messaging apps every day
              </span>
              <span className="content-description">
                Yet more than 99% of all businesses aren’t taking advantage of
                this and reaching out to their customers through Messaging Apps.
                Whether you are a digital business, influencer, local brick and
                mortar or aspiring business… Chatmatic can help you get more
                from every single subscriber by simply reaching people on THEIR
                terms.
              </span>
              <div className="d-inline-block">
                <button className="btn btn-link btn-content-action">
                  Start Getting More From Messenger
                </button>
              </div>
            </div>
          </div>
          <div
            className="position-relative d-flex align-items-center content4-container"
            data-aos="fade"
          >
            <img className="position-absolute" src={bkgIcons1} alt="" />
            <div className="d-flex flex-column container content4-left-container">
              <span className="content-title">INSTANT CUSTOMER SERVICE</span>
              <span className="content-header">
                We Enable You To Automate Responses To Your Customers Most
                Common Issues
              </span>
              <span className="content-description">
                No More Losing Business Because You Weren’t Able To Give Someone
                Directions, Or Tell Someone Where To Subscribe. Not only can we
                automatically respond for you in a way that feels like you are
                personally offering assistance… we can use that as an
                opportunity to generate more sales for you through simple
                indoctrination.
              </span>
              <div className="d-inline-block">
                <button className="btn btn-link btn-content-action">
                  GET MORE DONE, BY DOING LESS
                </button>
              </div>
            </div>
            <div className="d-flex flex-column chat-container content4-chat-container">
              <div className="d-flex justify-content-end align-items-center">
                <span className="chat-user1">
                  Yes, actually you can do a lot more... wanna see?
                </span>
                <img
                  src={chatmaticBubbleIcon}
                  alt=""
                  className="img-chat-bubble"
                />
              </div>
              <div className="d-flex align-items-center">
                <img src={user1BubbleIcon} alt="" className="img-chat-bubble" />
                <span className="chat-user2">
                  Wait, you can really do that?
                </span>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <span className="d-flex chat-user1">
                  <img
                    src={downPointingHandIcon}
                    alt=""
                    width={26}
                    height={26}
                    style={{ marginRight: 12, objectFit: 'contain' }}
                  />
                  Keep scrolling!
                </span>
                <img
                  src={chatmaticBubbleIcon}
                  alt=""
                  className="img-chat-bubble"
                />
              </div>
              <div className="d-flex align-items-center">
                <img src={user1BubbleIcon} alt="" className="img-chat-bubble" />
                <span className="chat-user2">Heck yeah!</span>
              </div>
            </div>
          </div>
          <div className="d-flex content5-container" data-aos="fade">
            <div className="d-flex flex-column chat-container content5-chat-container">
              <div className="d-flex justify-content-end">
                <img src={photo1} alt="" className="img-user-photo" />
                <img
                  src={chatmaticBubbleIcon}
                  alt=""
                  className="img-chat-bubble"
                />
              </div>
              <div className="d-flex justify-content-end">
                <div className="d-flex flex-column chat-user1">
                  <span>Hey! thanks for scanning the code.</span>
                  <span>Pretty awesome how it works right!?</span>
                </div>
                <img
                  src={chatmaticBubbleIcon}
                  alt=""
                  className="img-chat-bubble"
                />
              </div>
              <div className="d-flex align-items-center">
                <img src={user1BubbleIcon} alt="" className="img-chat-bubble" />
                <span className="chat-user2">Yeah this is great!</span>
              </div>
              <div className="d-flex justify-content-end">
                <span className="chat-user1">
                  These can be used to bring people into your bot, generate a
                  subscriber, and further indoctrinate your users that visit in
                  person.
                </span>
                <img
                  src={chatmaticBubbleIcon}
                  alt=""
                  className="img-chat-bubble"
                />
              </div>
            </div>
            <div className="d-flex flex-column container content5-right-container">
              <img src={scanTravisIcon} alt="" />
              <span className="content-title">
                BRING CUSTOMERS TO YOU FROM ANYWHERE
              </span>
              <span className="content-header">
                Bring Customers To You From Anywhere
              </span>
              <span className="content-description">
                We help you build scan codes that allows you to instantly create
                a conversation between your user and your brand. Messenger Ref
                URLs that allow your users to type your URL into a browser and
                engage with your brand through Messenger. We enable you to place
                customer chat widgets on your website so your bot can help your
                customers in real time on your site… and much more!
              </span>
              <div className="d-inline-block">
                <button className="btn btn-link btn-content-action">
                  START USING CHATMATIC!
                </button>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-center align-items-center content6-container"
            data-aos="fade"
          >
            <img src={circleChartIcon} alt="" width={227} />
            <div className="content6-description">
              <p>
                56% Of Customers Would Rather Message A Business Than Call
                Customer Service.
              </p>
              <div className="d-flex">
                <span>
                  Not Using Messenger To It’s Fullest Extent Is Like Never
                  Answering Your Phone. Let Us Help You Manage This Process And
                  Create Automations To Help Your Customers Without Requiring
                  More Of Your Time
                </span>
                <span>
                  Messenger Brings You And Your Customers Closer Together And
                  Delivers Your Business To Your Customers In The Way THEY Want
                  It. Chatmatic Makes This Quick, Easy, And Puts The Power Of
                  1.4Billion Users In Your Hands.
                </span>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-center align-items-center need-help-building"
            data-aos="fade"
          >
            <button className="btn btn-link">
              NEED HELP BUILDING?
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Landing;
