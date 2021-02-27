import { useState } from "react";
import { Redirect } from "react-router-dom";

export default function Entry() {
  const [username, setUsername] = useState("");
  const [peerUsername, setPeerUsername] = useState("");
  const [submit, setSubmit] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePeerUsernameChange = (event) => {
    setPeerUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    setSubmit(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input onChange={handleUsernameChange} type="text" />
        </label>
        <label>
          Peer Username:
          <input onChange={handlePeerUsernameChange} type="text" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {submit ? (
        <Redirect
          to={{
            pathname: "/call",
            state: { username, peerUsername },
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
