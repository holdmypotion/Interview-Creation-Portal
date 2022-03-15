import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

const SetupInterview = ({ currentUser, participantsList }) => {
  console.log(participantsList);
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

  const participantsJSX = participantsList.map(participant => {
    return (
      <tr key={participant.email}>
        <th>
          <input
            class="form-check-input"
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
                <div>
                  {formattedStartTime} - {formattedEndTime}
                </div>
              );
            })}
        </td>
      </tr>
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <h1>Set up Interview</h1>
      <h5>Select At least one Participant</h5>
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
      <DateTimePickerComponent
        id="datetimepicker"
        min={new Date()}
        placeholder="From"
        format="dd-MMM-yy HH:mm"
        onChange={e => setStartTime(e.value)}
      />
      <DateTimePickerComponent
        id="datetimepicker"
        min={startTime}
        placeholder="To"
        format="dd-MMM-yy HH:mm"
        onChange={e => setEndTime(e.value)}
      />
      {errors}
      <button className="btn btn-primary">Setup</button>
    </form>
  );
};

SetupInterview.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/participants");

  return { participantsList: data };
};

export default SetupInterview;
