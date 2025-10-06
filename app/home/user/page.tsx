import { UserIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeUsersPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserIcon />
          </EmptyMedia>
          <EmptyTitle>No Item Selected</EmptyTitle>
          <EmptyDescription>
            Please select a sidebar item from the sidebar to view its contents or
            update your profile.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default withI18n(HomeUsersPage);
