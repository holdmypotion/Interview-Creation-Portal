import Link from "next/link";

const Home = ({ interviews }) => {
  console.log(interviews);
  const interviewList = interviews.map((interview, index) => {
    const formattedStartTime = new Date(interview.startTime)
      .toString()
      .substring(0, 21);
    const formattedEndTime = new Date(interview.endTime)
      .toString()
      .substring(0, 21);
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
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Start Time</th>
          <th scope="col">End Time</th>
          <th scope="col">Participants</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>{interviewList}</tbody>
    </table>
  );
};
Home.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/interviews");

  return { interviews: data };
};

export default Home;
