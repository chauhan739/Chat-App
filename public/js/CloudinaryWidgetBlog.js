const myWidget = cloudinary.createUploadWidget(
    {
        cloudName: "aryan-cloud",
        uploadPreset: "upload-image",
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            console.log("Done! Here is the blog image info: ", result);
            document.getElementById("img-url").value = result.info.secure_url;
            document.getElementById("uploaded-img-thumbnail").innerHTML = `
              <img
                  src="${result.info.thumbnail_url}"
                  width="80px"
                  height="50px"
              />
          `;
        }
    }
);

document.getElementById("upload_widget").addEventListener(
    "click",
    function () {
        myWidget.open();
    },
    false
);

document.getElementById("upload-pfp").addEventListener(
    "click",
    function () {
        customWidget.open();
    },
    false
);

const customWidget = cloudinary.createUploadWidget(
    {
        cloudName: "aryan-cloud",
        uploadPreset: "upload-image",
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            console.log("Done! Here is the PFP image info: ", result);
            document.getElementById("popupPfpUrl").value =
                result.info.secure_url;
            document.getElementById("displayPFP").src = result.info.secure_url;
        }
    }
);
