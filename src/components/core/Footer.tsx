import React from "react";

import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer">
      <p>
        Made with ❤️ by {" "}
        <a href="https://codemeapixel.dev" target={"_blank"} rel="noreferrer">
          CodeMeAPixel
        </a>
      </p>
      <div className="icons">
        <a target={"_blank"} href="https://github.com/CodeMeAPixel/Lexi" aria-label="Github">
          <FaGithub size={24} color="#fff" />
        </a>
        <div></div>
        <a target={"_blank"} href="https://twitter.com/HeyLexicon" aria-label="Twitter">
          <FaTwitter size={24} color="#fff" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
