import React, { useState } from "react";
import { View } from "react-native";

const ImageUploader = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      // const response = await axios.post("/upload", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // console.log("Image uploaded:", response.data.filename);
      console.log("Image uploaded:", formData);
      // You can do something with the response here, like displaying a success message.
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       setImage(reader.result);
  //     }
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleCameraButtonClick = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById("camera-preview");
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  return (
    // <>
    //   <div className={classes.Camera}>
    //     <h3 id="titulo">{props.title}</h3>
    //     {/* <input type="file" accept="image/*" onChange={handleImageUpload} />
    //     {image && <img src={image} alt="Uploaded" />}
    //     <div className={classes.CameraButton}>
    //       <button onClick={handleCameraButtonClick}>Abrir cámara</button>
    //     </div> */}
    //     <div>
    //       <input type="file" onChange={handleImageChange} />
    //       <button onClick={handleCameraButtonClick}>
    //         <Icon icon={faCamera} className={classes.cameraIcon} />
    //       </button>
    //       <button
    //         className={classes.btn}
    //         type="button"
    //         // onClick={handleImageUpload}
    //         onClick={props.handleImageUpload}
    //       >
    //         Subir archivo
    //       </button>
    //     </div>
    //   </div>
    // </>
    <View>
      <Text>
        CameraUploader
      </Text>
    </View>
  );
};

export default ImageUploader;
