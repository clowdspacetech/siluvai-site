import { Heart, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-800 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-bold text-white text-lg">Siluvai Media</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Propagating messages of love, salvation, and redemption through Christian
              broadcasting and community outreach.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-amber-400 transition-colors">
                  Videos
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-amber-400 transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="#donate" className="hover:text-amber-400 transition-colors">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>info@siluvaimedia.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {year} Siluvai Media. All rights reserved.</p>
          <p className="font-medium text-slate-400">
            UK Registered Charity No. 1205248
          </p>
        </div>
      </div>
    </footer>
  );
}
