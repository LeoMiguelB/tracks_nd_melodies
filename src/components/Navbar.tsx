import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">MiguelBBeats</div>
        <ul className="flex space-x-4 gap-8">
          <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link href="/signup" className="hover:text-gray-300">Signup</Link></li>
          <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
        </ul>
      </div>
      <div className="w-full h-px bg-white mt-4"></div>
    </nav>
  );
};

export default Navbar;
