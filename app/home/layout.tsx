import { DefaultLayout } from "@/components/layouts/default-layout";

export default function HomeLayout({ children }: React.PropsWithChildren) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
