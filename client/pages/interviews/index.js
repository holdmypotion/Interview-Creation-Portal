import Link from "next/link";
import { useState } from "react";

const Home = ({ interviews }) => {
  const [latest, setLatest] = useState(true);
  const interviewList = interviews.map((interview, index) => {
    let formattedStartTime = new Date(interview.startTime);
    formattedStartTime.setMinutes(formattedStartTime.getMinutes() + 30);
    formattedStartTime.setMinutes(0, 0, 0);
    formattedStartTime = formattedStartTime.toString().substring(0, 21);
    let formattedEndTime = new Date(interview.endTime);
    formattedEndTime.setMinutes(formattedEndTime.getMinutes() + 30);
    formattedEndTime.setMinutes(0, 0, 0);
    formattedEndTime = formattedEndTime.toString().substring(0, 21);
    if (latest && new Date() > new Date(interview.endTime)) return;
    return (
      <tr key={interview.id}>
        <th>{index + 1}</th>
        <td>{formattedStartTime}</td>
        <td>{formattedEndTime}</td>
        <td>
          {interview.participants.map(participant => {
            return <div key={participant}>{participant}</div>;
          })}
        </td>
        <td>
          <Link
            href="/interviews/[interviewId]"
            as={`/interviews/${interview.id}`}
          >
            <a>
              <button className="btn btn-primary">edit</button>
            </a>
          </Link>
        </td>
      </tr>
    );
  });
  console.log(latest);
  return (
    <div className="container">
      <div class="d-flex justify-content-center pt-5">
        <div>
          <h1>Upcoming Interviews</h1>
          <div class="d-flex justify-content-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                onChange={() => setLatest(!latest)}
                checked={latest}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Only Latest
              </label>
            </div>
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col ">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Participants</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{interviewList}</tbody>
      </table>
      {interviews.length == 0 && (
        <div class="d-flex justify-content-center pt-3">
          <h5>you might want to setup some interviews first..</h5>
        </div>
      )}
    </div>
  );
};
Home.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/interviews");

  return { interviews: data };
};

export default Home;
