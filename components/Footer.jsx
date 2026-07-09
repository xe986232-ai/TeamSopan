export default function Footer() {
  return (
    <footer
      id="gabung"
      className="relative px-6 sm:px-10 py-20 border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <h3 className="font-display text-3xl text-ink">Mau gabung?</h3>
          <p className="text-ink-muted mt-3 max-w-sm">
            Kami selalu buka ruang buat orang yang serius mau berkarya di
            Remix, Creator, atau Leadis. DM tim kami, ceritain karya kamu.
          </p>
          <a
            href="#top"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-ink-solid text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hubungi Kami
          </a>
        </div>

        <div className="flex gap-12">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-ink-dim">
              Divisi
            </span>
            <ul className="mt-4 space-y-2 text-ink-muted text-sm">
              <li>Remix</li>
              <li>Creator</li>
              <li>Leadis</li>
            </ul>
          </div>
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-ink-dim">
              Sosial
            </span>
            <ul className="mt-4 space-y-2 text-ink-muted text-sm">
              <li>Instagram</li>
              <li>TikTok</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="max-w-6xl mx-auto mt-16 text-xs text-ink-dim">
        &copy; {new Date().getFullYear()} SOPAN TEAM. Semua hak dilindungi.
      </p>
    </footer>
  );
}
