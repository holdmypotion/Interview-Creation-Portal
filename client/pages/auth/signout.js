import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default function Signout() {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "get",
    body: {},
    onSuccess: () => Router.push("/auth/signup"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
}
