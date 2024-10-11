/* Components */
import Home from "@/components/Home/Home";

/* API */
import { fetchImagesApi } from "./api";

export default async function HomePage() {
  const images = await fetchImagesApi();

  return <Home images={images} />;
}
