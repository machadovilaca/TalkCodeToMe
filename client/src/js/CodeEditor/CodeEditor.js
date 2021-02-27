import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "./CodeEditor.css";
import FileSaver, { saveAs } from "file-saver";

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: "", name: "" };
  }

  openFile(e) {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      this.setState({
        code: e.target.result,
      });
    };
    this.setState({
      filename: e.target.files[0].name,
    });

    reader.readAsText(e.target.files[0]);
  };

  saveFile(event) {
    var blob = new Blob([this.state.code], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, this.state.filename);
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={(e) => this.openFile(e)} />
          <button onClick={(e) => this.saveFile(e)}>Save</button>
        </div>
        <div>
          <Editor
            value={this.state.code}
            onValueChange={(code) => this.setState({ code })}
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
