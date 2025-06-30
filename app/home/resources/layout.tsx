import { DefaultLayout } from '@/components/layouts/default-layout';
import { ResourceLayout } from '@/features/resources/components/resource-layout';

export default function HomeResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <ResourceLayout>{children}</ResourceLayout>
    </DefaultLayout>
  );
}
