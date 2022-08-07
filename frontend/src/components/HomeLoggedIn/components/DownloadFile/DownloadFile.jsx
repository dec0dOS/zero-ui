import { useState } from "react";
import { useLocalStorage } from "react-use";
import { TextField, Button, Snackbar } from "@material-ui/core";

import axios from "axios";

function DownloadFile() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [filename, setFilename] = useState("planet");
  const [errormsg, setErrormsg] = useState("");

  const [token] = useLocalStorage("token", null);

  const downloadFile = async (fileName) => {
    if (!!!token) {
      await handleDownFileErr(`Invalid token`);
      return;
    }
    if (typeof filename === "undefined" || filename.length === 0) {
      await handleDownFileErr(`Invalid file name [${filename}]`);
      return;
    }
    let ret;
    ret = await axios
      .create({
        baseURL: `/downfile/`,
        responseType: "arraybuffer",
        withCredentials: "true",
        headers:
          localStorage.getItem("disableAuth") === "true"
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              },
      })
      .get(`${fileName}`)
      .then((resp) => {
        const blobUrl = window.URL.createObjectURL(
          new Blob([resp.data], { type: "application/octet-stream" })
        );
        const tmpLink = document.createElement("a");
        tmpLink.style.display = "none";
        tmpLink.href = blobUrl;
        tmpLink.setAttribute("download", `${fileName}`);
        if (typeof tmpLink.download === "undefined") {
          tmpLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tmpLink);
        tmpLink.click();
        document.body.removeChild(tmpLink);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(async (e) => {
        let errmsg = `downfile(${fileName}): ${e}: ${ret}`;
        await handleDownFileErr(errmsg);
      });
  };

  const handleDownFileBtnClick = async () => {
    await downloadFile(filename);
  };

  const handleDownFileErr = async (errormsg) => {
    setErrormsg(errormsg);
    setSnackbarOpen(true);
    let sleep = function (ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    await sleep(3 * 1000);
    setSnackbarOpen(false);
    setErrormsg("");
  };

  return (
    <>
      <TextField
        value={filename}
        onChange={(e) => {
          setFilename(e.target.value);
        }}
        margin="dense"
        label="File name to download"
        type="text"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownFileBtnClick}
      >
        Download file
      </Button>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={errormsg}
      />
    </>
  );
}

export default DownloadFile;
