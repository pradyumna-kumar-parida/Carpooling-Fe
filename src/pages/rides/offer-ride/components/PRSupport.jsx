import React from "react";
import { RiCustomerServiceFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
const PRSupport = () => {
  const supports = [
    {
      id: 1,
      icon: <RiCustomerServiceFill />,
      title: "At your service 24/7",
      description:
        "Our team is at your disposal to answer any questions by email or social media. You can also have a live chat directly with experienced members.",
    },
    {
      id: 2,
      icon: <FaCar />,
      title: "Carpooling at your side",
      description:
        "For just 2 €, benefit from the reimbursement of up to 1,500€ of your excess when you publish a ride as a driver on Carpooling.",
    },
    {
      id: 3,
      icon: <MdSecurity />,
      title: "100% secure information",
      description:
        "Our team is dedicated to the protection of your data which is always 100% confidential thanks to monitoring, storage and encrypted data.",
    },
  ];

  return (
    <section className="pr-support">
      <h2 className="pr-support-title">
        We're here every step of the way
      </h2>

      <div className="pr-support-grid">
        {supports.map((support) => (
          <div key={support.id} className="pr-support-card">
            <div className="pr-support-icon">
              {support.icon}
            </div>
            <h3 className="pr-support-card-title">{support.title}</h3>
            <p className="pr-support-desc">{support.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PRSupport;
