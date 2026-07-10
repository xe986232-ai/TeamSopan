"use client";

const admins = [
  {
    name: "Tony Wayne",
    role: "Founder",
    image:
      "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=1160",
    desc: "Pendiri SOPAN TEAM, bertanggung jawab atas visi dan arah pengembangan komunitas.",
  },
  {
    name: "Nama Admin 2",
    role: "Co-Founder",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1160",
    desc: "Mengelola operasional harian dan koordinasi antar divisi.",
  },
  {
    name: "Nama Admin 3",
    role: "Admin",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=1160",
    desc: "Mengurus komunikasi member dan konten komunitas.",
  },
];

export default function AdminSection() {
  return (
    <section className="bg-base py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="font-body font-semibold text-sm tracking-widest text-pink-500 uppercase">
            Meet The Team
          </p>
          <h2 className="font-display font-extrabold mt-2 text-3xl text-ink sm:text-4xl">
            Admin & Pendiri
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin, i) => (
            <a
              key={i}
              href="#"
              className="group relative block overflow-hidden rounded-xl border border-black/10 shadow-sm"
            >
              <img
                alt={admin.name}
                src={admin.image}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* gradient overlay supaya teks tetap terbaca di atas foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="relative p-4 sm:p-6 lg:p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <p className="font-body font-semibold text-sm tracking-widest text-pink-400 uppercase">
                    {admin.role}
                  </p>
                  <p className="font-display font-bold text-xl text-white sm:text-2xl">
                    {admin.name}
                  </p>
                </div>

                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-body font-normal text-sm text-white/90">{admin.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}