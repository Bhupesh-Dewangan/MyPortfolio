import { mySocials } from "../constants";

const Footer = () => {
  return (
    <section className="c-space flex flex-col items-center gap-5 pb-6 pt-2 text-sm text-neutral-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="mb-2 h-px w-full bg-linear-to-r from-transparent via-neutral-700 to-transparent" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>
      <div className="flex gap-1">
        {mySocials.map((social, index) => (
          <a
            href={social.href}
            key={index}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition hover:bg-white/5"
            aria-label={social.name}
          >
            <img src={social.icon} className="h-5 w-5" alt="" />
          </a>
        ))}
      </div>
      <p className="text-center sm:text-left">
        © 2026 Bhupesh Dewangan. All rights reserved.
      </p>
    </section>
  );
};

export default Footer;
