import React from "react";

const professionals = [
  {
    name: "PROF. C. C. NWOSU (OON, FAS, NNOM)",
    title: "PROFESSOR OF AGRONOMY",
    desc: "Former Minister of Science & Tech, Former Vice Chancellor, University on the Niger",
    img: "/about/prof-nwosu.jpg",
  },
  {
    name: "PROFESSOR MICHAEL OYIBOCHA",
    title: "BOARD CHAIRMAN",
    desc: "Former Director of NTC (NAEC), Current Deputy Vice Chancellor, University of Calabar",
    img: "/about/prof-oyibocha.jpg",
  },
  {
    name: "PROFESSOR C.K. NWAKA",
    title: "",
    desc: "Associate Dean, Faculty of Agriculture, University of Nigeria Nsukka",
    img: "/about/prof-nwaka.jpg",
  },
  {
    name: "ENGR. GREGORY CHUKA",
    title: "EXECUTIVE DIRECTOR, BUSINESS DEVELOPMENT",
    desc: "Former Project Engineer, National Electric Power Authority (NEPA)",
    img: "/about/engr-chuka.jpg",
  },
  {
    name: "PROF. PATRICK NNAJI (NNOM)",
    title: "EXECUTIVE DIRECTOR, RESEARCH AND INNOVATION",
    desc: "Research Professor, National Biotechnology Development (NAB), National Secretary General, Science and Society of Nigeria",
    img: "/about/prof-nnaji.jpg",
  },
  {
    name: "ENGR. KEVIN NWOKE UKOJI",
    title: "TECHNICAL ADVISER (R&D), MAINTENANCE AND REPAIRS",
    desc: "",
    img: "/about/engr-kevin.jpg",
  },
  {
    name: "SAM NWANKWO NWOKOMA",
    title: "DIRECTOR, PROJECT IMPLEMENTATION & COORDINATION",
    desc: "Lecturer and Solicitor of the Supreme Court of Nigeria, environmental law and renewable energy education.",
    img: "/about/sam-nwankwo.jpg",
  },
  {
    name: "CHUMA LEE OBIKONU",
    title: "DIRECTOR",
    desc: "Green energy enthusiast & wireless data security professional.",
    img: "/about/chuma-lee.jpg",
  },
  {
    name: "MRS. CHINWE AKANDA",
    title: "DIRECTOR",
    desc: "Senior Admin Officer (Special Duties) Research Group, Research Ethics Umbrella",
    img: "/about/chinwe-akanda.jpg",
  },
  {
    name: "BARR. CHINWE NWOKOJI",
    title: "COMPANY SECRETARY / LEGAL ADVISER",
    desc: "Barrister and Solicitor of the Supreme Court of Nigeria",
    img: "/about/chinwe-nwokoji.jpg",
  },
  {
    name: "ANN CHUKWUKAOMA",
    title: "SALES SUPERVISOR",
    desc: "Former Sales Manager Offgrid Solar Solutions Ltd",
    img: "/about/ann-chukwukaoma.jpg",
  },
];

export default function About() {
  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">About Us</h1>
        <p className="text-gray-700 text-sm mb-2">
          LightUp Nigeria Solar Power Ltd was incorporated in August 2020 with the Corporate Affairs Commission under the Company and Allied Matters Act Laws of the Federation of Nigeria with RC: 1700485.
        </p>
        <p className="text-gray-700 text-sm mb-4">
          We offer innovative, affordable, and sustainable solar energy solutions to power homes and businesses across Nigeria, reducing energy costs and promoting environmental responsibility with the use of lithium phosphate technology.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <img src="/about/solar-install.jpg" alt="Installation" className="rounded-lg w-full h-64 object-cover mb-2" />
            <div className="font-bold text-sm text-center">Installation & Maintenance</div>
            <div className="text-xs text-gray-700 text-center">
              LightUp Nigeria offers solar panel installations to provide clean, renewable energy across Nigeria. We aim to brighten the country's future through sustainable solar solutions.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img src="/about/products.jpg" alt="Products" className="rounded-lg w-full h-64 object-cover mb-2" />
            <div className="font-bold text-sm text-center">Products & Services</div>
            <div className="text-xs text-gray-700 text-center">
              LightUp Nigeria Solar Power Ltd is a leading provider of solar energy solutions in Nigeria. We offer a range of high-quality solar power products and services to meet the growing demand for renewable energy in the country.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img src="/about/training.jpg" alt="Training" className="rounded-lg w-full h-64 object-cover mb-2" />
            <div className="font-bold text-sm text-center">Training, Research & Innovation</div>
            <div className="text-xs text-gray-700 text-center">
              We provide training, research, and innovation in solar energy solutions, empowering individuals and organizations to adopt clean energy technologies.
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-green-800 mb-4 text-center">MEET WITH PROFESSIONALS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {professionals.map((pro, idx) => (
            <div key={idx} className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4">
              <img
                src={pro.img}
                alt={pro.name}
                className="w-32 h-32 object-cover rounded-full mb-2 border-4 border-green-100"
              />
              <div className="font-bold text-green-800 text-center text-sm">{pro.name}</div>
              {pro.title && <div className="text-xs text-gray-700 font-semibold text-center">{pro.title}</div>}
              <div className="text-xs text-green-700 text-center">{pro.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}