import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div>&copy; 2024 Your Company Name. All rights reserved.</div>
      <div>
        <a href="/about">About Us</a> |<a href="/contact"> Contact</a> |
        <a href="/privacy">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
