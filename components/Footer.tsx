import { site } from "@/lib/site";
import Wordmark from "./Wordmark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <Wordmark />
        <div className={styles.socials}>
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
        </div>
        <p className={styles.fine}>{site.disclaimer}</p>
      </div>
    </footer>
  );
}
