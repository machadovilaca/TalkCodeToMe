import React, { useState } from "react";
import PropTypes from "prop-types";
import Background from "./Background";
import { Button, Checkbox, Form } from "semantic-ui-react";

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="container main-window">
      <Background className="background" />
      <h1 className="line-1 anim-typewriter">Talk Code To Me</h1>
      <p className="description">Free calls with code sharing</p>
      <p className="towho">{clientId}, who do you wanna talk to?</p>
      <div>
        <div className="ui middle aligned center aligned grid">
          <Form className="ui big form">
            <Form.Field>
              <input
                type="text"
                className="txt-clientId"
                spellCheck={false}
                placeholder="Your friend ID"
                onChange={(event) => setFriendID(event.target.value)}
              />
            </Form.Field>
            <div className="icons">
              <button
                type="button"
                className="btn-action fa fa-video-camera"
                onClick={callWithVideo(true)}
              />
              <button
                type="button"
                className="btn-action fa fa-phone"
                onClick={callWithVideo(false)}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default MainWindow;
