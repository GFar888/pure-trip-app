import React, { useRef, useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase.js";
import Profile_Skeleton from "./Profile_skeleton.jsx";

import { MdChangeCircle, MdOutlineCancel } from "react-icons/md";

import Swal from "sweetalert2";

const Profile = ({ setShowProfile, currentUser, avatar, setAvatar }) => {
  const [name, setName] = useState("");
  const [newAvatar, setNewAvatar] = useState();
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
    }
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    iconColor: "#7364ff",
  });
  const changeInfo = async () => {
    const storageRef = ref(storage, `avatars/${currentUser.uid}.jpg`);
    if (name.length < 4) {
      return;
    }
    Swal.showLoading();
    if (newAvatar) {
      await uploadBytes(storageRef, newAvatar);
      const url = await getDownloadURL(storageRef);
      await updateProfile(currentUser, { displayName: name, photoURL: url });
      setAvatar(URL.createObjectURL(newAvatar));
    }

    await updateProfile(currentUser, { displayName: name });

    setShowProfile(false);
    Toast.fire({
      icon: "success",
      title: "Profile Updated!",
    });
  };

  const refFile = useRef();
  const handleClick = (e) => {
    refFile.current.click();
  };

  const getImage = (event) => {
    setNewAvatar(event);
  };
  const handleNameInput = (e) => {
    setName(e.target.value);
  };
  return (
    <div className="profile-backdrop">
      <div className="profile-wrapper">
        <MdOutlineCancel
          className="cancel-icon"
          onClick={() => setShowProfile(false)}
        />

        <div className="photo-wrapper">
          <Profile_Skeleton
            style={{ display: !avatarLoaded ? "block" : "none" }}
          />
          <img
            style={{ display: avatarLoaded ? "block" : "none" }}
            onLoad={() => setAvatarLoaded(true)}
            className="profile-photo"
            src={newAvatar ? URL.createObjectURL(newAvatar) : avatar}
          />
          <MdChangeCircle
            className="change-avatar-icon"
            onClick={handleClick}
          />
        </div>
        <input
          type="text"
          className="profile-name"
          onChange={handleNameInput}
          defaultValue={name}
        />
        {name.length < 4 && <span className="not-valid"></span>}

        <h2 className="profile-email">{currentUser.email}</h2>
        <button onClick={changeInfo}>Save</button>
        <input
          id="file"
          type="file"
          ref={refFile}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => getImage(event.target.files[0])}
        />
      </div>
    </div>
  );
};

export default Profile;
