import { DefaultLayout } from "@/components/layouts/default-layout";
import { AccountLayout } from "@/features/accounts/components/account-layout";

export default function AccountRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <AccountLayout>{children}</AccountLayout>
    </DefaultLayout>
  );
}
