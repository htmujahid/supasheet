import { permanentRedirect } from "next/navigation";

async function HomeUsersPage() {
  permanentRedirect("/home/user/accounts");
}

export default HomeUsersPage;
