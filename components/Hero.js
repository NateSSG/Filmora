import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="text-center">
      <div className="w-60 mx-auto">
        <Image
          className="rounded-full border-black border-4 bg-white"
          src={"/pfp.jpg"}
          width={200}
          height={200}
          layout="responsive"
          alt="home cinema"
        />
      </div>
      <TypeAnimation
        className="font-bold text-white text-2xl"
        sequence={[
          "Nate's Movies",
          1000,
          "Welcome To ",
          { text: "To", speed: 50 },
          1000,
        ]}
        wrapper="span"
        cursor={true}
        repeat={Infinity}
        style={{ fontSize: "2em", display: "inline-block" }}
      />
      <p className="text-red-600 text-bold">See all the popular movies here.</p>
      <Link href="/contact" passHref>
        <button className="bg-black hover:bg-red-600 text-white py-3 px-6 rounded text-sm mt-4 text-bold">
          CONTACT ME
        </button>
      </Link>
    </div>
  );
};

export default Hero;
