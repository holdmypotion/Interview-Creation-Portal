import { useState } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default function AddInterviewee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState();

  const { doRequest, errors } = useRequest({
    url: "/api/participants/create",
    method: "post",
    body: {
      name,
      email,
      // file,
    },
    onSuccess: () => Router.push("/interviews"),
    // fileUpload: true,
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  // console.log(file);

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
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
      {/* <div className="form-group">
        <label htmlFor="formFile" className="form-label">
          Resume
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          name="file"
          placeholder="Select file"
          onChange={e => setFile(e.target.files[0])}
        />
      </div> */}
      {errors}
      <button className="btn btn-primary">Add</button>
    </form>
  );
}
