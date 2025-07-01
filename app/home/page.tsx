import { permanentRedirect } from "next/navigation";

import pathsConfig from "@/config/paths.config";

export default function Home() {
  permanentRedirect(pathsConfig.app.resources);
}
