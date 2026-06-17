import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaCarAlt } from "react-icons/fa";

const links = [
  { text: "About Us", href: "/about" },
  { text: "How It Works", href: "/how-it-works" },
  { text: "Help", href: "/help" },
  { text: "Contact", href: "/contact" },
  { text: "Terms", href: "/terms" },
  { text: "Privacy", href: "/privacy" },
];

const socialMedia = [
  { icon: <FaFacebookF />, title: "Facebook", href: "#" },
  { icon: <FaInstagram />, title: "Instagram", href: "#" },
  { icon: <FaTwitter />, title: "Twitter", href: "#" },
  { icon: <FaLinkedinIn />, title: "LinkedIn", href: "#" },
  { icon: <FaYoutube />, title: "YouTube", href: "#" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <div>
            <FaCarAlt />
          </div>
          Carpooling
        </div>

        <div className="footer-copy">
          © 2026 Carpooling India. All rights reserved.
        </div>
      </div>

      <div className="footer-links">
        {links.map((link, index) => (
          <Link key={index} href={link.href}>
            {link.text}
          </Link>
        ))}
      </div>

      <div className="footer-social">
        {socialMedia.map((social, index) => (
          <a
            key={index}
            className="social-icon"
            href={social.href}
            title={social.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.icon}
          </a>
        ))}
      </div>
      <div className="footer-copys">
        © 2026 Carpooling India. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
