import Link from 'next/link';
import { Instagram, Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white p-4">
      <div className="w-full h-px bg-white mb-4"></div>
      <div className="container mx-auto flex gap-2 justify-center flex-col items-center text-center">
        <div className="">&copy; 2024 MiguelBBeats. All rights reserved.</div>
        <ul className="">
          <li><Link href="/terms_and_conditions.pdf" className="hover:text-gray-300">Terms and Conditions</Link></li>
        </ul>
        <ul className="flex space-x-6 mb-4">
          <li>
            <a href="https://www.beatstars.com/miguelbbeats" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex items-center">
              <Music size={20} className="mr-1" /> BeatStars
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/miguelbbeats" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex items-center">
              <Instagram size={20} className="mr-1" /> Instagram
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;