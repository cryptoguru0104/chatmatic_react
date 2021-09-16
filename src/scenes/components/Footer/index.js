import React from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import arrowRightIcon from 'assets/images/landing/arrow-right.png';

import './styles.css';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer-container" data-aos="fade">
        <div className="d-flex footer-content-container">
          <div className="footer-content">
            <p>BUSINESS</p>
            <Link to="/" className="btn btn-link btn-footer-link">
              <span>HOME</span>
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </Link>
            <Link to="/" className="btn btn-link btn-footer-link">
              <span>GET STARTED</span>
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </Link>
            <Link to="/" className="btn btn-link btn-footer-link">
              <span>SUCCESS STORIES</span>
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </Link>
            <Link to="/" className="btn btn-link btn-footer-link">
              <span>ADVERTISING</span>
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </Link>
            <Link to="/" className="btn btn-link btn-footer-link">
              <span>NEWSROOM</span>
              <img src={arrowRightIcon} alt="" width={15} height={14} />
            </Link>
          </div>
          <div className="footer-content">
            <p>SHARE WITH US</p>
            <Link to="/" className="btn btn-link btn-footer-link">
              SHARE SUCCESS STORY
            </Link>
            <Link to="/" className="btn btn-link btn-footer-link">
              GIVE FEEDBACK
            </Link>
          </div>
        </div>
        <MediaQuery minWidth={1000}>
          <nav className="navbar justify-content-between footer-navbar">
            <ul className="flex-row navbar-nav">
              <li className="nav-item">
                <Link to="/">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Privacy</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Terms</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Data Policy</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Cookies</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Help</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Sitemap</Link>
              </li>
            </ul>
            <span>Chatmatic 2018 | Powered by Amazingness</span>
          </nav>
        </MediaQuery>
      </footer>
    );
  }
}
