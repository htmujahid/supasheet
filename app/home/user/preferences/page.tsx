"use client";

import { DefaultHeader } from "@/components/layouts/default-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppearanceForm } from "@/features/user/components/appearance-form";

function PreferencesPage() {
  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Preferences" }]} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>

            <CardDescription>
              Some actions cannot be undone. Please be careful.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AppearanceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PreferencesPage;
