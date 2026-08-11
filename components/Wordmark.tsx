import { site } from "@/lib/site";
import styles from "./Wordmark.module.css";

/** Small lockup used in the nav and footer. Always one word, never wrapped. */
export default function Wordmark({ href }: { href?: string }) {
  const inner = (
    <>
      <span className={styles.dot} aria-hidden="true" />
      {site.name}
    </>
  );

  return href ? (
    <a className={styles.wordmark} href={href}>
      {inner}
    </a>
  ) : (
    <div className={styles.wordmark}>{inner}</div>
  );
}
