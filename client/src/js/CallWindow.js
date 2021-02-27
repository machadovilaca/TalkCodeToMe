import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import CodeEditor from "./CodeEditor/CodeEditor";
import GridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  endCall,
  writeFile,
  writeCanvas,
  socket,
  clientId,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "video") {
      setVideo(!video);
      mediaDevice.toggle("Video");
    }
    if (deviceType === "audio") {
      setAudio(!audio);
      mediaDevice.toggle("Audio");
    }
  };

  const inputChange = (data) => {
    writeFile(data);
  };

  const canvasInputChange = (data) => {
    writeCanvas(data);
  };

  const layout = [
    { i: "localVideo", x: 2, y: 6, w: 2, h: 4 },
    { i: "video-controller", x: 5, y: 15, w: 2, h: 4 },
    { i: "peerVideo", x: 8, y: 6, w: 2, h: 4 },
    { i: "code", x: 0, y: 0, w: 11, h: 20, static: true },
  ];

  const getButtonClass = (icon, enabled) => {
    return classnames(`btn-action fa ${icon}`, { disable: !enabled });
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={window.innerWidth - 10}
    >
      <div key="code">
        <CodeEditor
          socket={socket}
          inputchange={inputChange}
          canvasinputchange={canvasInputChange}
          clientId={clientId}
        />
      </div>
      <div key="peerVideo">
        <video className="peerVideo" ref={peerVideo} autoPlay />
      </div>
      <div key="localVideo">
        <video className="localVideo" ref={localVideo} autoPlay muted />
      </div>
      <div key="video-controller">
        <div className="video-control">
          <button
            key="btnVideo"
            type="button"
            className={getButtonClass("fa-video-camera", video)}
            onClick={() => toggleMediaDevice("video")}
          />
          <button
            key="btnAudio"
            type="button"
            className={getButtonClass("fa-microphone", audio)}
            onClick={() => toggleMediaDevice("audio")}
          />
          <button
            type="button"
            className="btn-action hangup fa fa-phone"
            onClick={() => endCall(true)}
          />
        </div>
      </div>
    </GridLayout>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
