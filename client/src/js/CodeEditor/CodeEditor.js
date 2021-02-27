import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "./CodeEditor.css";
import { fileOpen, fileSave } from "browser-fs-access";
import CanvasDraw from "react-canvas-draw";

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      name: "",
      socket: props.socket,
      filename: "",
      blob: null,
    };

    this.inputchange = this.props.inputchange.bind(this);
    this.canvasinputchange = this.props.canvasinputchange.bind(this);

    this.openFile = this.openFile.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
  }

  componentDidMount() {
    this.state.socket
      .on("file", (data) => {
        this.setState({ code: data.data });
      })
      .on("canvas", (data) => {
        this.setState({
          canvas: data.data,
        });
      });
  }

  async openFile() {
    const blob = await fileOpen({
      mimeTypes: ["text/plain"],
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      this.setState({
        code: e.target.result,
      });
      this.inputchange(e.target.result);
    };
    this.setState({
      filename: blob.name,
      blob: blob,
    });

    reader.readAsText(blob);
  }

  saveFile(event) {
    var blob = new Blob([this.state.code], {
      type: "text/plain;charset=utf-8",
    });
    const handle = this.state.blob.handle;
    fileSave(blob, {}, handle);
  }

  updateEditor(code) {
    this.setState({
      code: code,
    });
    this.inputchange(code);
  }

  closeFile() {
    this.inputchange("");
    this.setState({ blob: null, code: "" });
  }

  updateCanvas(canvas) {
    this.setState({
      canvas: canvas.getSaveData(),
    });
    this.canvasinputchange(canvas.getSaveData());
  }

  loadCanvas(event) {
    console.log("reloading canvas");
    event.loadSaveData(this.state.canvas, true);
  }

  render() {
    return (
      <div>
        <div>
          <button type="file" onClick={this.openFile}>
            Edit file
          </button>
          {this.state.blob ? (
            <div>
              <button onClick={(e) => this.saveFile(e)}>Save</button>
              <button onClick={(e) => this.closeFile()}>Close</button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <CanvasDraw
            gridColor="rgba(255,255,255,0)"
            onLoad={(event) => this.loadCanvas(event)}
            onChange={this.updateCanvas}
            hideGrid={true}
            canvasWidth={400}
            canvasHeight={400}
            brushRadius={2}
          />
        </div>
        <div className="draw-canvas">
          <Editor
            value={this.state.code}
            onValueChange={(code) => this.updateEditor(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
      </div>
    );
  }
}

export default CodeEditor;
