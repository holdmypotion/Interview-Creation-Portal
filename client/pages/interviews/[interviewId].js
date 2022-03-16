import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Link from "next/link";

const InterviewShow = ({ interview, participantsList }) => {
  const [startTime, setStartTime] = useState(new Date(interview.startTime));
  const [endTime, setEndTime] = useState(new Date(interview.endTime));
  const [participants, setParticipants] = useState(interview.participants);
  const { doRequest, errors } = useRequest({
    url: `/api/interviews/${interview.id}`,
    method: "put",
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

  const checkIfPresent = participant => {
    console.log(participant);
    if (participants.includes(participant)) return true;
    else return false;
  };

  console.log(participants);

  const participantsJSX = participantsList.map(participant => {
    return (
      <tr key={participant.email}>
        <th>
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={checkIfPresent(participant.email)}
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
                <div key={interview.startTime}>
                  {formattedStartTime} - {formattedEndTime}
                </div>
              );
            })}
        </td>
      </tr>
    );
  });

  const formattedStartTime = new Date();
  formattedStartTime.setMinutes(formattedStartTime.getMinutes() + 30);
  formattedStartTime.setMinutes(0, 0, 0);

  return (
    <form onSubmit={onSubmit}>
      <div className="d-flex justify-content-center py-3">
        <h1>Update Interview</h1>
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
              value={new Date(interview.startTime)}
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
              value={new Date(interview.endTime)}
            />
          </div>
        </div>
      </div>
      {errors}
      <div className="d-flex justify-content-center pt-5">
        <button className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
};

InterviewShow.getInitialProps = async (context, client) => {
  const { interviewId } = context.query;
  const { data } = await client.get(`/api/interviews/${interviewId}`);
  const participantsList = await client.get("/api/participants");

  return { interview: data, participantsList: participantsList.data };
};

export default InterviewShow;
