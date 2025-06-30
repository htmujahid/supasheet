import pathsConfig from "@/config/paths.config";
import { permanentRedirect } from "next/navigation";

export default function Home() {
  permanentRedirect(pathsConfig.app.resources);
}