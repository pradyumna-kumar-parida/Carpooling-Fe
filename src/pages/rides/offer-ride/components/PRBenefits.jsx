import { FaCarAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";

const benefits = [
  {
    id: 1,
    title: "Drive.",
    description:
      "Keep your plans! Hit the road just as you planned and make the most of your vehicle's empty seats.",
    icon: <FaCarAlt />,
  },
  {
    id: 2,
    title: "Share.",
    description:
      "Travel with good company. Share a carpool ride with travellers from all walks of life.",
    icon: <FaUsers />,
  },
  {
    id: 3,
    title: "Save.",
    description:
      "Tolls, petrol, electricity... Easily divvy up all the costs with other passengers.",
    icon: <MdAttachMoney />,
  },
];

const PRBenefits = () => {
  return (
    <section className="pr-benefits">
      <h2 className="pr-benefits-title">Drive. Share. Save.</h2>

      <div className="pr-benefits-grid">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="pr-benefit-card">
            <div className="pr-benefit-icon">{benefit.icon}</div>
            <h3 className="pr-benefit-title">{benefit.title}</h3>
            <p className="pr-benefit-desc">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PRBenefits;
