import ProfileCard from "@/components/ui/profile-card";

export const metadata = {
  title: "Preview ProfileCard",
};

const sample = {
  name: "Candra",
  title: "Divisi Remix",
  handle: "candra",
  status: "Online",
  contactText: "Contact Me",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=800",
};

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

      <div className="max-w-6xl mx-auto flex justify-center">
        <ProfileCard {...sample} />
      </div>
    </main>
  );
}
