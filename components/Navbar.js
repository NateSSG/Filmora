import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-black border-black border-2 shadow-black">
      <div className="font-bold shadow-2xl text-neutral-100 p-4 max-w-7xl mx-auto container tracking-widest font-neue">
        <Link href="/" passHref>
          <a className="text-base md:text-2xl">
            Nathaniel <span className="text-red-600">Ssendagire</span>
          </a>
        </Link>

        <Link href="/movies" passHref>
            <a className="text-base text-center md:text-2xl ml-5 hover:text-red-600">
              Movies
            </a>
          </Link>
          <Link href="/all" passHref>
            <a className="text-base text-center md:text-2xl ml-5 hover:text-red-600">
              All
            </a>
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
