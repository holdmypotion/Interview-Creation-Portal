import { useState, useEffect } from "react";
import Router from "next/router";

export default ({ currentUser }) => {
  useEffect(() => {
    if (!currentUser) Router.push("/signup");
  });
};
