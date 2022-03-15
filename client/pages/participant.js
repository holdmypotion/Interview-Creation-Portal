import { useState } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default function AddInterviewee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/participants/create",
    method: "post",
    body: {
      name,
      email,
    },
    onSuccess: () => Router.push("/interviews"),
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Add Interviewee</h1>
      <div className="form-group">
        <label>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Add</button>
    </form>
  );
}
