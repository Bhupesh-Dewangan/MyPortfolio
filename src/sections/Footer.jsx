import { Heart } from "lucide-react";
import { mySocials } from "../constants";
import ViewCounter from "../components/ViewCounter";

const Footer = () => {
  return (
    <section className="c-space flex flex-col items-center gap-5 pb-6 pt-2 text-sm text-neutral-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="mb-2 h-px w-full bg-linear-to-r from-transparent via-neutral-700 to-transparent" />
      <div className="flex items-center justify-center gap-1.5">
        <span>Made with</span>
        <Heart className="size-4 fill-red-500 text-red-500 inline-block animate-pulse" />
        <span>by Bhupesh Dewangan</span>
      </div>
      <div className="flex gap-1">
        {mySocials.map((social, index) => {
          const href = social.href.startsWith("mailto:")
            ? `https://mail.google.com/mail/?view=cm&fs=1&to=${social.href.replace("mailto:", "")}`
            : social.href;

          return (
            <a
              href={href}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition hover:bg-white/5"
              aria-label={social.name}
            >
              <img src={social.icon} className="h-5 w-5" alt={social.name} loading="lazy" />
            </a>
          );
        })}
      </div>
      <div>
        <ViewCounter />
      </div>
    </section>
  );
};

export default Footer;
