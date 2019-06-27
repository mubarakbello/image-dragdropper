import React, { Component } from 'react';
import DropZone from 'react-dropzone';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableItem = SortableElement(
  ({file, onclic}) => (
    <div className="sort-item" onClick={() => file.id ? onclic() : null}>
      <div>
        <h3>{file.id}</h3>
        <h2>{file.name}</h2>
        <h4>{file.type} <br /> {file.size ? `(${file.size} bytes)` : null}</h4>
      </div>
    </div>
  )
);

const SortableList = SortableContainer(({files, onclic}) => {
  if (files && files.length) {
    return (
      <div className="sort-section">
        {files.map((file, index) => (
          <SortableItem key={`${index}-${file.name}`} file={file} index={index} />
        ))}
        <SortableItem
          key="0-empty"
          index={files.length + 1}
          file={{name: "+", type: "Click on me to add files"}}
          onclic={onclic}
          disabled={true}
        />
      </div>
    );
  } else {
    return (
      <div className="sort-section">
        <div className="sort-item" style={{margin: "50px auto"}}>
          <div>
            <h2>Empty!!!</h2>
            <h4>Click on the dropzone to add files</h4>
          </div>
        </div>
      </div>
    );
  }
})

class Dropper extends Component {
  state = {
    files: []
  };

  onDrop = acceptedFiles => {
    acceptedFiles = acceptedFiles.map((file, index) => {
      file.id = this.state.files.length + index + 1;
      return file;
    })
    this.setState(({files}) => ({
      files: [...files, ...acceptedFiles]
    }));
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({files}) => ({
      files: arrayMove(files, oldIndex, newIndex)
    }));
  }

  render() {
    return (
      <div>
        <DropZone ref={"dropzone"} onDrop={this.onDrop} multiple>
          {({getRootProps, getInputProps}) => (
            <section className="drag-section">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </DropZone>
        <SortableList
          axis="xy"
          onSortEnd={this.onSortEnd}
          files={this.state.files}
          onclic={() => this.refs.dropzone.open()}
        />
      </div>
    )
  }
}

export default Dropper
