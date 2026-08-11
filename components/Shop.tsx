import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./Shop.module.css";

export default function Shop() {
  const { hat } = site;

  return (
    <section id="shop" className={`section ${styles.shop}`}>
      <div className="wrap">
        <div className={styles.panel}>
          <div className={styles.stage}>
            <Image
              src={hat.image}
              alt={hat.imageAlt}
              width={900}
              height={900}
              sizes="(max-width: 760px) 90vw, 420px"
              priority={false}
            />
          </div>
          <div className={styles.copy}>
            <p className={`eyebrow ${styles.eyebrowGold}`}>first drop</p>
            <h2>{hat.name}</h2>
            <p>{hat.copy}</p>
            <div className={styles.priceRow}>
              <span className={styles.price}>{hat.price}</span>
              <span className={styles.priceSub}>{hat.priceNote}</span>
            </div>
            <a href="#join" className={`btn btn-primary ${styles.cta}`}>
              Notify me when it&apos;s live
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
