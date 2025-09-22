import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadRolesPermissions } from "@/features/users/lib/loaders";
import { LockIcon, ShieldIcon } from "lucide-react";

export default async function RolesPermissionsPage() {
  const rolesWithPermissions = await loadRolesPermissions();

  return (
    <div className="space-y-4">
      {rolesWithPermissions && rolesWithPermissions.length > 0 ? (
        rolesWithPermissions.map((role, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <ShieldIcon className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">{role.role}</CardTitle>
              </div>
              <CardDescription className="mt-1.5">
                This role grants {role.permissions.length}{' '}
                {role.permissions.length === 1
                  ? 'permission'
                  : 'permissions'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
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
                  <span className="text-sm text-muted-foreground italic">
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
            <div className="rounded-full bg-muted p-3 mb-4">
              <ShieldIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No roles assigned</h3>
            <p className="text-sm text-muted-foreground text-center">
              You haven't been assigned any roles yet. Contact your
              administrator if you need access.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
