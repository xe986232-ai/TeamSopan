import ProfileCard from "@/components/ui/profile-card";

export const metadata = {
  title: "Preview ProfileCard",
};

const samples = [
  {
    name: "Candra",
    title: "Divisi Remix",
    handle: "candra",
    status: "Online",
    contactText: "Contact Me",
    avatarUrl:
      "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Gatau dahh",
    title: "Divisi Creator",
    handle: "gataudahh",
    status: "Online",
    contactText: "Contact Me",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Apalagi ini",
    title: "Divisi Leadis",
    handle: "apalagiini",
    status: "Online",
    contactText: "Contact Me",
    avatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=800",
  },
];

export default function PreviewProfileCard() {
  return (
    <main className="min-h-screen bg-[#060010] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Preview ProfileCard
        </h1>
        <p className="text-white/60 mt-2 text-sm">
          Halaman sementara buat lihat tampilan komponen ProfileCard —
          gerakkan kursor di atas kartunya buat lihat efek tilt-nya.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {samples.map((s) => (
          <ProfileCard key={s.handle} {...s} />
        ))}
      </div>
    </main>
  );
}
