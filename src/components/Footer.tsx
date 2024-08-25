import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-black fixed text-white p-4 mt-auto left-0 bottom-0">
      <div className="w-full h-px bg-white mb-4"></div>
      <div className="container mx-auto flex justify-center flex-col items-center">
        <div>&copy; 2024 MiguelBBeats. All rights reserved.</div>
        <ul className="flex space-x-4">
          <li><Link href="/terms_and_conditions.pdf" className="hover:text-gray-300">Terms and Conditions</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
