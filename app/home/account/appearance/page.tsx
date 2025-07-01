import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppearanceForm } from "@/features/accounts/components/appearance-form";

export default function AppearancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey={"account:dangerZone"} />
        </CardTitle>

        <CardDescription>
          <Trans i18nKey={"account:dangerZoneDescription"} />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AppearanceForm />
      </CardContent>
    </Card>
  );
}
