import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/pages/AppPages";

export const Route = createFileRoute("/$")({ component: CatchAll });

function CatchAll() {
  const { _splat = "" } = Route.useParams();
  return <AppPage path={`/${_splat}`} />;
}
