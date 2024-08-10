import React, { Component } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default class FireBase extends Component {
  constructor(props) {
    super(props);

    // Firebase configuration and initialization
    const firebaseConfig = {
      apiKey: "AIzaSyDzhEOgAygWwG_e9afHGSWxUntz0iRDi28",
      authDomain: "story-sketch-490e4.firebaseapp.com",
      projectId: "story-sketch-490e4",
      storageBucket: "story-sketch-490e4.appspot.com",
      messagingSenderId: "524516664763",
      appId: "1:524516664763:web:7c5039fc6b1b0b52f3509e",
      measurementId: "G-0DG8NHH080"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Storage
    this.storage = getStorage(app);
  }

  componentDidMount() {
    if (this.props.file) {
      this.uploadImage(this.props.file);
    }
  }

  uploadImage = async (file) => {
    if (!file) return;

    // Create a reference to 'images/file.name'
    const storageRef = ref(this.storage, `images/${file.name}`);
    console.log("Uploading file:", file.name); // Log the file name being uploaded

    // Upload the file
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at", downloadURL);
      return downloadURL; // You can use this URL to display the image on the web
    } catch (error) {
      console.error("Error uploading file:", error); // Log any errors that occur
    }
  };

  render() {
    return (
      <div>
        {/* UI elements or messages to indicate the upload status can go here */}
      </div>
    );
  }
}
