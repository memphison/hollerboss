import { site } from "@/lib/site";
import Wordmark from "./Wordmark";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={`wrap ${styles.inner}`}>
        <Wordmark href="#top" />
        <div className={styles.links}>
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
