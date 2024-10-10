import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-background-light shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16"> {/* Centering items vertically */}
          <Link href="/">
            <a className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-light">Filmiora</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;