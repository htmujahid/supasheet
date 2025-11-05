import { LockIcon, ShieldIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadRolesPermissions } from "@/features/user/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

async function RolesPermissionsPage() {
  const rolesWithPermissions = await loadRolesPermissions();

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Roles & Permissions" }]} />
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        {rolesWithPermissions && rolesWithPermissions.length > 0 ? (
          rolesWithPermissions.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-1.5">
                    <ShieldIcon className="text-primary h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{role.role}</CardTitle>
                </div>
                <CardDescription className="mt-1.5">
                  This role grants {role.permissions.length}{" "}
                  {role.permissions.length === 1 ? "permission" : "permissions"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-3 flex items-center gap-2">
                  <LockIcon className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Permissions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map((permission, permIndex) => (
                      <Badge key={permIndex} variant="outline">
                        {permission.permission}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm italic">
                      No permissions defined
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted mb-4 rounded-full p-3">
                <ShieldIcon className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No roles assigned</h3>
              <p className="text-muted-foreground text-center text-sm">
                You haven&apos;t been assigned any roles yet. Contact your
                administrator if you need access.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default withI18n(RolesPermissionsPage);
