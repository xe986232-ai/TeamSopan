"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Users, Sparkles, User, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import { useOutsideClick } from "@/hooks/use-outside-click";

function initialsOf(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

// Avatar bulat kecil buat navbar — foto asli kalau ada, fallback ke
// inisial nama (mirip AvatarInitials di dashboard, versi ringan).
function NavAvatar({ name, avatarUrl, size = 28 }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-remix-from to-leadis-to text-white font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}

export const SiteNavbar = ({ navItems, mobileGroups, className }) => {
  const [open, setOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(57);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef(null);
  const groups = mobileGroups || [{ label: "Menu", items: navItems }];
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  // Status login: null = belum dicek / belum login, object = sudah login
  // (berisi full_name & avatar_url dari tabel members).
  const [member, setMember] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cek sesi login begitu navbar dimuat (dipakai di semua halaman publik),
  // lalu ambil profil member (nama + foto) buat ditampilkan di navbar kalau
  // sudah login. Dengarkan juga perubahan sesi (login/logout dari tab lain).
  useEffect(() => {
    const supabase = createPublicSupabaseClient();
    let active = true;

    async function loadMember() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setMember(null);
        setAuthChecked(true);
        return;
      }

      const { data } = await supabase
        .from("members")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      setMember(data || { full_name: user.email, avatar_url: null });
      setAuthChecked(true);
    }

    loadMember();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setMember(null);
        setAuthChecked(true);
        return;
      }
      loadMember();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createPublicSupabaseClient();
    await supabase.auth.signOut();
    setMember(null);
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.getBoundingClientRect().bottom);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
    };
  }, [open]);

  return (
    <>
      <div
        ref={navRef}
        className={cn(
          "sticky top-0 z-[5000] w-full",
          className
        )}
      >
      <div className="border-b border-black/5 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-xl backdrop-saturate-150 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
            className="sm:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

        <a href="#top" className="flex items-center gap-2.5">
  <span className="relative h-8 w-8 shrink-0 flex items-center justify-center">
    <motion.span
      animate={{
        borderRadius: [
          "60% 40% 55% 45% / 50% 60% 40% 50%",
          "45% 55% 40% 60% / 55% 45% 60% 40%",
          "55% 45% 60% 40% / 45% 55% 45% 55%",
          "60% 40% 55% 45% / 50% 60% 40% 50%",
        ],
        scale: [1, 1.08, 0.95, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 blur-md opacity-80"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #7C3AED, #EC4899 45%, #22D3EE 100%)",
      }}
    />
    <motion.span
      animate={{
        borderRadius: [
          "60% 40% 55% 45% / 50% 60% 40% 50%",
          "45% 55% 40% 60% / 55% 45% 60% 40%",
          "55% 45% 60% 40% / 45% 55% 45% 55%",
          "60% 40% 55% 45% / 50% 60% 40% 50%",
        ],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-full w-full flex items-center justify-center text-white font-black text-sm overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #A855F7, #F472B6 50%, #38BDF8 100%)",
      }}
    >
      S
    </motion.span>
  </span>
  <span className="font-body font-semibold text-ink text-xs whitespace-nowrap">
    Sopan Team
  </span>
</a>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          {navItems.map((item, idx) => (
            <a
              key={`nav-${idx}`}
              href={item.link}
              className="font-body font-medium text-xs text-ink-muted hover:text-ink transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden md:flex items-center gap-1.5 text-xs text-ink-muted border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5">
            <Users size={13} />
            180+
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-xs text-ink-muted border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Rekrutmen buka
          </span>
          {mounted && (
            <AnimatedThemeToggler
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              onThemeChange={(t) => setTheme(t)}
            />
          )}
          {mounted && authChecked && member ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                aria-label="Menu profil"
                className="flex items-center rounded-full border border-black/10 dark:border-white/10 p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <NavAvatar name={member.full_name} avatarUrl={member.avatar_url} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-base-elevated shadow-lg py-1"
                  >
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/10">
                      <p className="text-xs font-semibold text-ink truncate">
                        {member.full_name}
                      </p>
                    </div>
                    <a
                      href="/profil"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <User size={14} />
                      Lihat Profil
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            mounted &&
            authChecked && (
              <a
                href="/gabung"
                className="flex items-center gap-1 text-xs font-medium border border-black/10 dark:border-white/10 text-white bg-ink-solid dark:bg-white dark:text-ink-solid px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity"
              >
                <Sparkles size={12} />
                Gabung
              </a>
            )
          )}
        </div>
      </div>
      </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ top: `${navHeight}px` }}
            data-lenis-prevent
            className="sm:hidden fixed inset-x-0 bottom-0 z-[4999] bg-white dark:bg-base overflow-y-auto"
          >
            <div className="flex flex-col px-6 pt-6 pb-10">
              {groups.map((group, gIdx) => (
                <div key={`group-${gIdx}`} className={gIdx > 0 ? "mt-8" : ""}>
                  <span className="text-xs tracking-[0.3em] uppercase text-ink-dim mb-3 block">
                    {group.label}
                  </span>
                  <div className="flex flex-col">
                    {group.items.map((item, idx) => (
                      <a
                        key={`mnav-${gIdx}-${idx}`}
                        href={item.link}
                        onClick={() => setOpen(false)}
                        className="font-body font-semibold tracking-tight text-xl text-ink py-1.5 transition-colors hover:text-ink-muted"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 mt-8">
                <span className="flex items-center gap-1.5 text-xs text-ink-muted border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5">
                  <Users size={13} />
                  180+
                </span>
                <span className="flex items-center gap-1.5 text-xs text-ink-muted border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Rekrutmen buka
                </span>
                {mounted && (
                  <AnimatedThemeToggler
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    onThemeChange={(t) => setTheme(t)}
                    className="border border-black/10 dark:border-white/10"
                  />
                )}
              </div>

              {authChecked && member ? (
                <div className="flex flex-col gap-3 mt-6">
                  <a
                    href="/profil"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <NavAvatar name={member.full_name} avatarUrl={member.avatar_url} size={32} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-ink truncate">
                        {member.full_name}
                      </span>
                      <span className="block text-xs text-ink-muted">Lihat Profil</span>
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 text-sm font-medium text-rose-500 border border-rose-500/20 px-4 py-3 rounded-full hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Keluar
                  </button>
                </div>
              ) : (
                <a
                  href="/gabung"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-ink-solid dark:bg-white dark:text-ink-solid px-4 py-3 rounded-full hover:opacity-90 transition-opacity mt-6"
                >
                  <Sparkles size={14} />
                  Gabung
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
