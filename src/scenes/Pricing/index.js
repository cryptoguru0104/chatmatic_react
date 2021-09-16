import React from "react";

// Import components
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import assets
import backgroundImg from "assets/images/pricing/background.png";
import chartImg from "assets/images/pricing/chart.png";
import emailImg from "assets/images/pricing/email.png";
import "./styles.css";

export default class Pricing extends React.Component {
    handleClick = () => {
        const { history } = this.props;
        history.push("/login");
    };

    render() {
        return (
            <div className="d-flex flex-column position-relative pricing-container">
                <Header pathname={this.props.location.pathname} />
                <div
                    className="d-flex align-items-center content1-container"
                    data-aos="fade"
                >
                    <div className="d-flex flex-column content1-left-container">
                        <span className="title">
                            FREE for up to 500 subscribers
                        </span>
                        <span className="description">
                            Yes, Completely, Utterly and TOTALLY Free with ALL
                            Features Available To You!
                        </span>
                        <span className="description">
                            After You've reached 500 Messenger subscribers you
                            can choose between the two plans below.
                        </span>
                    </div>
                    <div>
                        <img src={chartImg} alt="" className="img-chart" />
                    </div>
                </div>
                <div
                    className="d-flex justify-content-center align-items-center content2-container"
                    data-aos="fade"
                >
                    <div>
                        <p>Select A Plan</p>
                        <div className="d-flex justify-content-between w-100 mt-0 card-container">
                            <div className="d-flex flex-column card-content">
                                <div className="d-flex justify-content-between mb-3 membership-info">
                                    <span>$97/ MONTHLY</span>
                                    <span>BASIC</span>
                                </div>
                                <span className="subscribers-count">
                                    Up to 60,000 Subscribers
                                </span>
                                <button
                                    className="btn btn-link"
                                    onClick={this.handleClick}
                                >
                                    Start Your Trial
                                </button>
                            </div>
                            <div className="d-flex flex-column card-content">
                                <div className="d-flex justify-content-between mb-3 membership-info">
                                    <span>$997/ YEAR</span>
                                    <span>PREMIUM</span>
                                </div>
                                <span className="subscribers-count">
                                    Up to 60,000 Subscribers
                                </span>
                                <button
                                    className="btn btn-link"
                                    onClick={this.handleClick}
                                >
                                    Start Your Trial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="position-relative content3-container"
                    data-aos="fade"
                >
                    <img
                        src={backgroundImg}
                        alt=""
                        className="position-absolute"
                    />
                    <div className="d-flex align-items-center">
                        <div className="d-flex flex-column content3-left-container">
                            <span>
                                Are you an agency looking to manage 10 or more
                                Fan Pages?
                            </span>
                            <span>
                                For Commercial Usage, Over 60,000 Subscribers.
                            </span>
                        </div>
                        <img src={emailImg} alt="" width={470} height={100} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
