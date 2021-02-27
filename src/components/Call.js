import Peer from "peerjs";

export default function Call(props) {
  const username = props.location.state.username;
  const peerUsername = props.location.state.peerUsername;

  const peer = new Peer();
  console.log(peer);
  console.log("Created peer", username);

  if (peerUsername) {
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const call = peer.call(peerUsername, stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          console.log("lol");
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  } else {
    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
            console.log("lol");
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        }
      );
    });
  }

  return <div></div>;
}
