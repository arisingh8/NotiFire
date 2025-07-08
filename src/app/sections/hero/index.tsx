import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="w-full rounded-lg bg-linear-to-r from-orange-300 to-orange-100 text-white text-center py-24 px-6">
      <div className="container mx-auto">
        <h1 className="text-5xl text-black font-extrabold mb-4">
          Welcome to Notifire
        </h1>
        <p className="text-xl text-black mb-6">
          Your trusted partner in fire safety and prevention.
        </p>
        <a
          href="#learn-more"
          className="inline-block bg-white text-red-600 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default Hero;
