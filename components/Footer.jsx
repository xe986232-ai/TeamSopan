export default function Footer() {
  return (
    <footer
      id="gabung"
      className="relative px-6 sm:px-10 py-20 border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <h3 className="font-display font-extrabold text-3xl text-ink">Mau gabung?</h3>
          <p className="font-body font-normal text-ink-muted mt-3 max-w-sm">
            Kami selalu buka ruang buat orang yang serius mau berkarya di
            Remix, Creator, atau Leadis. Daftar sekarang dan ceritain karya kamu.
          </p>
          <a
            href="/gabung"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-ink-solid text-white dark:bg-white dark:text-ink-solid text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Daftar Sekarang
          </a>
        </div>

        <div className="flex gap-12">
          <div>
            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-dim">
              Divisi
            </span>
            <ul className="font-body font-normal mt-4 space-y-2 text-ink-muted text-sm">
              <li>Remix</li>
              <li>Creator</li>
              <li>Leadis</li>
            </ul>
          </div>
          <div>
            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-dim">
              Sosial
            </span>
            <ul className="font-body font-normal mt-4 space-y-2 text-ink-muted text-sm">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="font-body font-normal max-w-6xl mx-auto mt-16 text-xs text-ink-dim flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>&copy; {new Date().getFullYear()} SOPAN TEAM. Semua hak dilindungi.</span>
        <a href="/privasi" className="hover:text-ink-muted transition-colors">
          Kebijakan Privasi
        </a>
        <a href="/ketentuan" className="hover:text-ink-muted transition-colors">
          Ketentuan Layanan
        </a>
      </p>
    </footer>
  );
}
