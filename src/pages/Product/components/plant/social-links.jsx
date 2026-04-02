import { FaFacebook as Facebook, FaTwitter as Twitter, FaInstagram as Instagram } from "react-icons/fa";

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function SocialLinks() {
  return (
    <div className="inline-flex items-center gap-4 bg-[#C8E6C9]/40 backdrop-blur-md p-3 rounded-[2rem] border border-white/30 shadow-sm">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-sm transition-transform cursor-pointer"
        >
          <social.icon className="w-5 h-5 text-[#2D5A3D]" />
        </a>
      ))}
    </div>
  );
}
