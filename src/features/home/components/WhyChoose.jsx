import Image from "next/image";
import chooseUsimg1 from "../../../assets/images/choose-sec-Img1.png";
import chooseUsimg2 from "../../../assets/images/choose-sec-Img2.png";
import chooseUsimg3 from "../../../assets/images/choose-sec-Img3.png";
import chooseUsimg4 from "../../../assets/images/choose-sec-Img4.webp";

const reasons = [
  {
    id: 1,
    iconClass: "icon-blue",
    icon: chooseUsimg1,
    title: "Verified Profiles",
    description: "Trusted members with verified details.",
  },
  {
    id: 2,
    iconClass: "icon-green",
    icon: chooseUsimg2,
    title: "Ratings & Reviews",
    description: "See real reviews from other travelers.",
  },
  {
    id: 3,
    iconClass: "icon-purple",
    icon: chooseUsimg3,
    title: "Mobile Friendly",
    description: "Book anytime, anywhere, on the go.",
  },
  {
    id: 4,
    iconClass: "icon-yellow",
    icon: chooseUsimg4,
    title: "Instant Booking",
    description: "Quick and easy booking process.",
  },
];

const WhyChoose = () => {
  return (
    <section className="why-section">
      <h2>Why Choose Carpooling?</h2>

      <div className="why-grid">
        {reasons.map((reason) => (
          <article key={reason.id} className="why-card">
            <div className={`icon-wrap ${reason.iconClass}`}>
              <Image
                src={reason.icon}
                alt={`${reason.title} icon`}
       
              />
            </div>

            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;
