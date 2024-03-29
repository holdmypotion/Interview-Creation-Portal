import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import Link from "next/link";

const SetupInterview = ({ currentUser, participantsList }) => {
  useEffect(() => {
    if (!currentUser) Router.push("/auth/signup");
  }, [currentUser]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const { doRequest, errors } = useRequest({
    url: "/api/interviews/create",
    method: "post",
    body: {
      startTime,
      endTime,
      participants,
    },
    onSuccess: () => Router.push("/interviews"),
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  const checkboxHandler = (e, participant) => {
    const checked = e.target.checked;
    if (checked) selectParticipantsHanlder(participant);
    else unselectParticipantsHandler(participant);
  };

  const selectParticipantsHanlder = participant => {
    const updatedParticipants = participants.concat(participant);
    setParticipants(updatedParticipants);
  };

  const unselectParticipantsHandler = participant => {
    const updatedParticipants = participants.filter(p => p !== participant);
    setParticipants(updatedParticipants);
  };

  let participantsJSX;
  if (participantsList && participantsList.length > 0) {
    participantsJSX = participantsList.map(participant => {
      return (
        <tr key={participant.email}>
          <th>
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={e => checkboxHandler(e, participant.email)}
            />
          </th>
          <td>{participant.name}</td>
          <td>{participant.email}</td>
          <td>
            {participant.interviews &&
              participant.interviews.map(interview => {
                const formattedStartTime = new Date(interview.startTime)
                  .toString()
                  .substring(0, 21);
                const formattedEndTime = new Date(interview.endTime)
                  .toString()
                  .substring(0, 21);
                return (
                  <div key={formattedStartTime}>
                    {formattedStartTime} - {formattedEndTime}
                  </div>
                );
              })}
          </td>
        </tr>
      );
    });
  }
  let formattedStartTime = new Date();
  formattedStartTime.setMinutes(formattedStartTime.getMinutes() + 30);
  formattedStartTime.setMinutes(0, 0, 0);

  return (
    <>
      {currentUser && (
        <form onSubmit={onSubmit}>
          <div className="d-flex justify-content-center py-3">
            <h1>Setup Interview</h1>
          </div>
          <div className="d-flex justify-content-center pt-3">
            <h5>Interviewees List</h5>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Booked Slots</th>
              </tr>
            </thead>
            <tbody>{participantsJSX}</tbody>
          </table>
          <div className="d-flex justify-content-center">
            <Link href="/participant" as="/participant">
              <a>
                <button className="btn btn-primary">Add Interviewee</button>
              </a>
            </Link>
          </div>
          <div className="d-flex justify-content-center pt-5">
            <div>
              <div className="pt-3 pd-3">
                <span>Start Time</span>
                <DateTimePickerComponent
                  id="datetimepicker"
                  min={formattedStartTime}
                  placeholder="From"
                  format="dd-MMM-yy HH:mm"
                  onChange={e => setStartTime(e.value)}
                  className=""
                />
              </div>
              <div className="pt-3 pd-3">
                <span>End Time</span>

                <DateTimePickerComponent
                  id="datetimepicker"
                  min={startTime}
                  placeholder="To"
                  format="dd-MMM-yy HH:mm"
                  onChange={e => setEndTime(e.value)}
                />
              </div>
            </div>
          </div>
          {errors}
          <div className="d-flex justify-content-center pt-5">
            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      )}
    </>
  );
};

SetupInterview.getInitialProps = async (context, client, currentUser) => {
  if (currentUser) {
    const { data } = await client.get("/api/participants");
    return { participantsList: data };
  }
  return { currentUser, interviews: {} };
};

export default SetupInterview;
