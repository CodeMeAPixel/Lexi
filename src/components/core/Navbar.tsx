import React from "react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

function Navbar() {
  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" className="brand">
          <Image alt="Logo" src="/logo.png" width={32} height={32} />
          <span className="brand">Lexi</span>
        </Link>
      </div>
      <a target={"_blank"} rel="noreferrer" href="https://github.com/CodeMeAPixel/LexiAI" aria-label="Github">
        <FaGithub size={24} color="#fff" />
        <span className="sm:hidden">Star on GitHub</span>
      </a>
    </div>
  );
}

export default Navbar;