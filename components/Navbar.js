import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-background-light shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-light">Filmiora</span>
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/all">
                <a className="border-transparent text-gray-300 hover:border-primary-light hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Movies
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;