import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import FolderIcon from "@material-ui/icons/Folder";
import Avatar from "@material-ui/core/Avatar";

import withStyles from "@material-ui/core/styles/withStyles";
import customImageInputStyle from "./CustomImageInputStyls";
import classnames from "classnames";

class CustomImageInput extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  state = {
    file: undefined,
    imagePreviewUrl: undefined,
  };

  showFileUpload() {
    if (this.fileUpload) {
      this.fileUpload.current.click();
    }
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
      this.props.setFieldValue(this.props.field.name, file);
    }
  }

  showPreloadImage(filesRec) {
    // console.log("llfile", filesRec.value.name);
    const { errorMessage, classes } = this.props;
    const { name } = this.props.field;
    const { file, imagePreviewUrl } = this.state;

    let comp = null;

    if (errorMessage) {
      comp = <Icon style={{ fontSize: 16 }}>err</Icon>;
    } else if (file) {
      comp = <FolderIcon style={{ fontSize: 36 }}></FolderIcon>;
    } else {
      comp = <FolderIcon style={{ fontSize: 36 }}></FolderIcon>;
    }
    return comp;
  }

  componentDidMount() {
    console.log(this.fileUpload.current);
  }

  render() {
    const { errorMessage, title, classes } = this.props;
    const files = this.props.field;
    console.log(files);

    const avatarStyle = classnames(
      classes.bigAvatar,
      this.state.file ? [classes.whiteBack] : [classes.primaryBack],
      { [classes.errorBack]: errorMessage }
    );

    return (
      <div className={classes.container}>
        <div
          style={{
            display: "flex",
            paddingLeft: "0%",
            width: "100%",
          }}
        >
          <input
            className={classes.hidden}
            id={files.name}
            name={files.name}
            type="file"
            onChange={this.handleImageChange}
            ref={this.fileUpload}
            accept="image/*, .pdf"
            // onBlur={onBlur}
            //className="form-control"
          />
          <div
            style={{
              fontSize: "14px",
              paddingLeft: "0%",
              width: "160px",
              justifyContent: "flex-start",
              marginLeft: "-170px",
            }}
          >
            <strong> Note:</strong> Please upload files in the format of pdf,
            jpg, jpeg, png only.
          </div>
          <div>
            <Avatar className={avatarStyle} onClick={this.showFileUpload}>
              {this.showPreloadImage(files)}
            </Avatar>
            <Typography className={classes.title} variant="h6">
              {files.value.name}
            </Typography>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                paddingLeft: "42%",
                marginTop: "-14px",
              }}
            >
              Browse
            </p>
            {/* <p
              onClick={() =>
                this.setState({ file: undefined, imagePreviewUrl: undefined })
              }
            >
              X
            </p> */}
          </div>

          {errorMessage ? (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(customImageInputStyle)(CustomImageInput);
