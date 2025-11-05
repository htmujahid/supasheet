"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Edit, FileJson, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";

import { BanAccountDialog } from "./ban-account-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { UnbanAccountButton } from "./unban-account-button";

type AccountsDetailViewProps = {
  user: User;
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
  };
  currentUserId: string | null;
};

export function AccountsDetailView({ user, permissions, currentUserId }: AccountsDetailViewProps) {
  // Check if user is viewing their own account
  const isOwnAccount = currentUserId === user.id;

  // Check if user is currently banned
  const isBanned = user.banned_until && user.banned_until !== "none" && new Date(user.banned_until) > new Date();
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Account Details</h1>
          <p className="text-muted-foreground text-sm">
            View and manage account information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isOwnAccount && permissions.canUpdate && (
            <>
              {isBanned ? (
                <UnbanAccountButton user={user} />
              ) : (
                <BanAccountDialog user={user} />
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/home/user/accounts/${user.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </>
          )}
          {!isOwnAccount && permissions.canDelete && (
            <DeleteAccountDialog user={user} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Details</CardTitle>
              {user.email_confirmed_at ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-green-600 text-green-600"
                >
                  Email Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  Email Not Verified
                </Badge>
              )}
            </div>
            <CardDescription>
              {user.created_at &&
                formatDistanceToNow(new Date(user.created_at), {
                  addSuffix: true,
                })}
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <p className="text-muted-foreground text-sm">ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Created At</p>
              <p className="text-sm">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Updated At</p>
              <p className="text-sm">
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <Mail className="h-3 w-3" />
                Email
              </p>
              <p className="text-sm">{user.email || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Email Confirmed At</p>
              <p className="text-sm">
                {user.email_confirmed_at
                  ? new Date(user.email_confirmed_at).toLocaleString()
                  : "Not confirmed"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Phone</p>
              <p className="text-sm">{user.phone || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Phone Confirmed At</p>
              <p className="text-sm">
                {user.phone_confirmed_at
                  ? new Date(user.phone_confirmed_at).toLocaleString()
                  : "Not confirmed"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Last Sign In</p>
              <p className="text-sm">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "Never"}
              </p>
            </div>
            {
              isBanned && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Banned Until</p>
                  <p className="text-sm">
                    {user.banned_until
                      ? new Date(user.banned_until).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              )
            }
          </div>

          {user.app_metadata?.provider && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold">Provider</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {user.app_metadata.provider}
                  </Badge>
                  {user.app_metadata.providers &&
                    user.app_metadata.providers.length > 0 && (
                      <>
                        {user.app_metadata.providers.map((provider: string) => (
                          <Badge key={provider} variant="secondary">
                            {provider}
                          </Badge>
                        ))}
                      </>
                    )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {(user.app_metadata || user.user_metadata) && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>
              Additional metadata associated with this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {user.app_metadata &&
                Object.keys(user.app_metadata).length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <FileJson className="h-4 w-4" />
                      App Metadata
                    </p>
                    <ScrollArea className="h-64 w-full rounded-md border">
                      <pre className="p-3 text-xs">
                        {JSON.stringify(user.app_metadata, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              {user.user_metadata &&
                Object.keys(user.user_metadata).length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <FileJson className="h-4 w-4" />
                      User Metadata
                    </p>
                    <ScrollArea className="h-64 w-full rounded-md border">
                      <pre className="p-3 text-xs">
                        {JSON.stringify(user.user_metadata, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {user.identities && user.identities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Identities</CardTitle>
            <CardDescription>
              Authentication identities linked to this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-md border">
              <pre className="p-3 text-xs">
                {JSON.stringify(user.identities, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
