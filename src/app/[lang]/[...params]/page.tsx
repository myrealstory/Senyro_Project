import { ROUTES } from "@/constants"
import { ServerSidePageType } from "@/types/pageTypes";
import { redirect } from "next/navigation"

export default function NotFound({
  params,
}: {
  params: ServerSidePageType["params"];
}) {
  redirect(`/${params.lang}/${ROUTES.INDEX}`);
}