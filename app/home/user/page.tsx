import { Metadata } from "next";

import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User",
};

async function HomeUsersPage() {
  permanentRedirect("/home/user/profile");
}

export default HomeUsersPage;
