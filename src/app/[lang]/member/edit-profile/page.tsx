import { LocaleKeysType } from "@/app/i18n";
import { EditProfileContainer } from "@/components/member/EditProfileContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default function EditProfile({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <div>
      <EditProfileContainer lang={params.lang} />
    </div>
  );
}
