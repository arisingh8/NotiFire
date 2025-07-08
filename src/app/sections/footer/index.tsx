"use client";

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
