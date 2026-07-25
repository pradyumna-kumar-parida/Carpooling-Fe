import Image from "next/image";
import APPSTORE_BADGE_SRC from "@/assets/images/appstore.svg"
import PLAYSTORE_BADGE_SRC from "@/assets/images/playstore.png"
import SCANNER_PHONE_SRC from "@/assets/images/mobile.png"


export default function AppDownloadSection() {
  return (
    <section className="app-download" aria-labelledby="app-download-heading">
      <div className="app-download-inner">
        <div className="app-download-content">
          <span className="app-download-accentBar" aria-hidden="true"></span>
          <h2 id="app-download-heading" className="app-download-heading">
            Enjoy a better travel experience with the RideShare app
          </h2>
          <p className="app-download-desc">
            All your rides and tickets in one place, up-to-date info and exclusive mobile-only features.
          </p>

          <div className="app-download-badges">
            <a
              href="#"
              className="app-download-badgeLink app-download-badgeLink--appstore"
              aria-label="Download on the App Store"
            >
              <Image
                src={APPSTORE_BADGE_SRC}
                alt="Download on the App Store"
                width={160}
                height={48}
                className="app-download-badgeImg app-download-badgeImg--appstore"
              />
            </a>
            <a
              href="#"
              className="app-download-badgeLink app-download-badgeLink--playstore"
              aria-label="Get it on Google Play"
            >
              <Image
                src={PLAYSTORE_BADGE_SRC}
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="app-download-badgeImg app-download-badgeImg--playstore"
              />
            </a>
          </div>
        </div>

        <div className="app-download-scannerWrap">
          <Image
            src={SCANNER_PHONE_SRC}
            alt="Scan the QR code with your phone to download the app"
            width={377}
            height={451}
            className="app-download-scannerImg"
            priority
          />
        </div>
      </div>
    </section>
  );
}