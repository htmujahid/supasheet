import { permanentRedirect } from "next/navigation";

export default function UsersPage() {
  permanentRedirect("/home/users/accounts");
}
