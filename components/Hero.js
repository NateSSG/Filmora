import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

const Hero = () => {
  return (
    <div className="text-center relative">
      <div className="w-full h-96 relative">
        <img
          src="/hero-cinema.svg"
          alt="Cinema background"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        <TypeAnimation
          sequence={[
            "Welcome to Filmiora",
            2000,
            "Discover Amazing Films",
            2000,
            "Explore Cinema's Best",
            2000,
          ]}
          wrapper="h1"
          cursor={true}
          repeat={Infinity}
          style={{ fontSize: "2.5em", fontWeight: "bold", color: "white" }}
        />
        <p className="text-primary-light text-xl mt-4 font-bold">Explore the world of cinema with us.</p>
        <Link href="/all">
          <a>
            <button className="bg-primary-light hover:bg-red-700 text-white py-3 px-6 rounded-full text-lg mt-6 font-bold transition duration-300 ease-in-out transform hover:scale-105">
              EXPLORE MOVIES
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
