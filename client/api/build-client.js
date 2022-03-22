import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      // baseURL: "http://holdmypotion.tech",
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
}
