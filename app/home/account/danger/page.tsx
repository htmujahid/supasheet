import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountDangerZone } from "@/features/accounts/components/account-danger-zone";

export default function DangerPage() {
  return (
    <Card className={"border-destructive"}>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey={"account:dangerZone"} />
        </CardTitle>

        <CardDescription>
          <Trans i18nKey={"account:dangerZoneDescription"} />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AccountDangerZone />
      </CardContent>
    </Card>
  );
}
