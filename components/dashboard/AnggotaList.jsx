"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DivisionBadge from "./DivisionBadge";
import StatusBadge from "./StatusBadge";
import AvatarInitials from "./AvatarInitials";
import RowActionsMenu from "./RowActionsMenu";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useToast } from "@/components/ui/toast";
import { deleteMember } from "@/app/dashboard/anggota/actions";

export default function AnggotaList({ initialMembers }) {
  const { toast } = useToast();
  const [members, setMembers] = React.useState(initialMembers);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteMember(deleteTarget.id);
    setIsDeleting(false);

    if (result.error) {
      toast({ variant: "error", title: "Gagal menghapus anggota", description: result.error });
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast({ variant: "success", title: "Anggota dihapus" });
  };

  return (
    <>
      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {members.length === 0 && (
          <p className="p-6 text-center text-sm text-black/40">
            Belum ada anggota. Terima pendaftar di halaman Pendaftar Baru dulu.
          </p>
        )}

        {members.map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center gap-4 p-4 ${
              i !== members.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <AvatarInitials name={member.name} size={40} />

            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-[#111827] truncate">
                {member.name}
              </p>
              <p className="text-xs text-black/50 truncate">{member.email}</p>
            </div>

            <div className="hidden sm:block text-xs text-black/50 w-32 shrink-0">
              {member.role}
            </div>

            <div className="shrink-0">
              <DivisionBadge divisionId={member.division} />
            </div>

            <div className="hidden md:block shrink-0">
              <StatusBadge status={member.status} />
            </div>

            <div className="hidden lg:block text-xs text-black/40 w-24 shrink-0 text-right">
              {member.joinedAt}
            </div>

            <RowActionsMenu
              label={`Aksi lainnya untuk ${member.name}`}
              items={[
                {
                  label: "Hapus anggota",
                  icon: <Trash2 size={14} />,
                  danger: true,
                  onClick: () => setDeleteTarget(member),
                },
              ]}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDeleteModal
            title={`Hapus ${deleteTarget.name}?`}
            description="Akun login & data anggota ini akan dihapus permanen dan tidak bisa dikembalikan."
            isPending={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
