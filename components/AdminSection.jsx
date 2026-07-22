import Image from "next/image";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

// Fallback kalau Supabase belum di-setup / lagi error / foto belum diupload,
// biar halaman tetap tampil bagus.
const DEFAULT_ADMINS = [
  {
    slug: "remix",
    name: "Candra",
    role: "Divisi Remix",
    image_url:
      "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=1160",
    description: "Admin Divisi Remix, mengelola karya dan koordinasi kreator remix.",
  },
  {
    slug: "creator",
    name: "Gatau dahh",
    role: "Divisi Creator",
    image_url:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1160",
    description: "Admin Divisi Creator, mengelola karya dan koordinasi video editor.",
  },
  {
    slug: "leadis",
    name: "Apalagi ini",
    role: "Divisi Leadis",
    image_url:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=1160",
    description: "Admin Divisi Leadis, mengelola karya dan koordinasi kreator konten perempuan.",
  },
];

async function getDivisionAdmins() {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("division_admins")
      .select("*")
      .order("slug");

    if (error || !data || data.length === 0) {
      throw error || new Error("empty");
    }

    // pakai foto default kalau admin belum pernah upload foto
    return data.map((admin) => {
      const fallback = DEFAULT_ADMINS.find((d) => d.slug === admin.slug);
      return {
        slug: admin.slug,
        name: admin.name,
        role: admin.role,
        description: admin.description,
        image_url: admin.image_url || fallback?.image_url,
      };
    });
  } catch {
    return DEFAULT_ADMINS;
  }
}

export default async function AdminSection() {
  const admins = await getDivisionAdmins();

  return (
    <section className="bg-base py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="font-body font-semibold text-sm tracking-widest text-pink-500 uppercase">
            Meet The Team
          </p>
          <h2 className="font-display font-extrabold mt-2 text-3xl text-ink sm:text-4xl">
            Admin Divisi
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <a
              key={admin.slug}
              href="#"
              className="group relative block overflow-hidden rounded-xl border border-black/10 shadow-sm"
            >
              <Image
                alt={admin.name}
                src={admin.image_url}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* gradient overlay supaya teks tetap terbaca di atas foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="relative p-4 sm:p-6 lg:p-8 min-h-[320px] flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body font-semibold text-sm tracking-widest text-pink-400 uppercase">
                      {admin.role}
                    </p>
                    <p className="font-display font-bold text-xl text-white sm:text-2xl">
                      {admin.name}
                    </p>
                  </div>
                  <span className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-white/90 shadow-md">
                    <Image
                      alt="Sopan Team"
                      src="/sopan-logo-black.png"
                      width={18}
                      height={23}
                    />
                  </span>
                </div>

                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-body font-normal text-sm text-white/90">{admin.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
