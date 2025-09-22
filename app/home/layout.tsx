import { DefaultLayout } from "@/components/layouts/default-layout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
