import React, { useEffect, useState, useRef } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "./CodeEditor.css";
import { fileOpen, fileSave } from "browser-fs-access";
import CanvasDraw from "react-canvas-draw";

function CodeEditor(props) {
  const [code, setCode] = useState("");
  const socket = props.socket;
  const [blob, setBlob] = useState(null);
  const [useCanvas, setUseCanvas] = useState(true);
  const clientId = props.clientId;
  const canvasRef = useRef(null);
  const [canvasData, setCanvasData] = useState({
    data: null,
    userChange: false,
  });

  socket
    .on("file", (data) => {
      setCode(data.data);
    })
    .on("canvas", (data) => {
      if (data.to === clientId) {
        setCanvasData({ data: data.data, userChange: true });
      }
    });

  useEffect(() => {
    if (canvasData.userChange) {
      canvasRef.current.loadSaveData(canvasData.data, true);
    }
  }, [canvasData.userChange]);

  const openFile = async () => {
    const blob = await fileOpen({
      mimeTypes: ["text/plain"],
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      setCode(e.target.result);
      props.inputchange(e.target.result);
    };

    setBlob(blob);

    reader.readAsText(blob);
  };

  const saveFile = () => {
    var blob = new Blob([code], {
      type: "text/plain",
    });
    const handle = blob.handle;
    fileSave(blob, {}, handle);
  };

  const updateEditor = (codeUpdate) => {
    setCode(codeUpdate);
    props.inputchange(codeUpdate);
  };

  const closeFile = () => {
    props.inputchange("");
    setCode("");
    setBlob(null);
  };

  const updateCanvas = (canvas) => {
    if (!canvasData.userChange) {
      props.canvasinputchange(canvas.getSaveData());
    } else {
      setCanvasData({ userChange: false });
    }
  };

  const changeTop = () => {
    setUseCanvas(!useCanvas);
  };

  return (
    <div>
      <div className="buttons">
        <button type="file" onClick={openFile}>
          Edit file
        </button>
        {blob ? (
          <>
            <button onClick={(e) => saveFile(e)}>Save</button>
            <button onClick={(e) => closeFile()}>Close</button>
          </>
        ) : (
          ""
        )}
        {code ? (
          <button onClick={(e) => changeTop()}>
            {useCanvas ? "Use code" : "Use canvas"}
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="iteractive">
        {code ? (
          <div className={"canvas" + (useCanvas ? " top" : "")}>
            <CanvasDraw
              gridColor="none"
              backgroundColor="none"
              ref={canvasRef}
              onChange={updateCanvas}
              hideGrid={true}
              canvasWidth={1200}
              canvasHeight={600}
              brushRadius={2}
            />
          </div>
        ) : (
          ""
        )}
        <div className={"editor" + (useCanvas ? "" : " top")}>
          <Editor
            value={code}
            onValueChange={(code) => updateEditor(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
