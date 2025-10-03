import { SQL } from "@/features/sql/components/sql";
import { withI18n } from "@/lib/i18n/with-i18n";

function SqlPage() {
  return <SQL />;
}

export default withI18n(SqlPage);
