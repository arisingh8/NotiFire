"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { FooterStyles } from "./styles";

const Footer: React.FC = () => {
  return (
    <footer className={`${FooterStyles.container} ${FooterStyles.font}`}>
      <div className={FooterStyles.wrapper}>
        <div className={FooterStyles.content}>
          {/* Copyright */}
          <p className={FooterStyles.copyright}>
            &copy; {new Date().getFullYear()} NotifireAI
          </p>

          {/* Navigation Links */}
          <nav className={FooterStyles.nav}>
            <Link href="/privacy-policy" className={FooterStyles.link}>
              Privacy Policy
            </Link>
            <span className={FooterStyles.divider}>|</span>
            <Link href="/terms-of-service" className={FooterStyles.link}>
              Terms of Service
            </Link>
          </nav>

          {/* Social Media Icons */}
          <div className={FooterStyles.socialIcons}>
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
            >
              <Facebook size={20} className={FooterStyles.icon} />
            </Link>
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
            >
              <Twitter size={20} className={FooterStyles.icon} />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
            >
              <Instagram size={20} className={FooterStyles.icon} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
