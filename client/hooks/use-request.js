import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess, fileUpload = false }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      let response;
      if (fileUpload) {
        const formData = new FormData();
        for (let [key, val] of body) {
          formData.append(key, val);
        }
        response = await axios[method](url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios[method](url, { ...body, ...props });
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
