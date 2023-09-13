import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Styles from "./signUpForm.module.scss";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import Swal from "sweetalert2";

import { ref, getDownloadURL } from "firebase/storage";

import { auth, storage } from "../../config/firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    iconColor: "#7364ff",
  });
  const onSubmit = async (data) => {
    Swal.showLoading();
    await createUserWithEmailAndPassword(auth, data.Email, data.Password);
    Toast.fire({
      icon: "success",
      title: "User Created!",
    });
    updateUserProfile(data);
    navigate("/");
  };

  const updateUserProfile = async (data) => {
    const user = auth.currentUser;
    const storageRef = ref(storage, `avatars/defaultAvatar.jpg`);
    const url = await getDownloadURL(storageRef);

    await updateProfile(user, { displayName: data.Name, photoURL: url });
  };

  return (
    <form className={Styles.signUp_form} onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <input
        className={Styles.input}
        placeholder="John Smith"
        {...register("Name", { required: true })}
      />
      {errors.Name && (
        <span className={Styles.required}>This field is required</span>
      )}
      <label>Email address</label>
      <input
        className={Styles.input}
        placeholder="Example@gmail.com"
        type="email"
        {...register("Email", { required: true })}
      />
      {errors.Email && (
        <span className={Styles.required}>This field is required</span>
      )}
      <label>Password</label>
      <div className={Styles.pass_wrapper}>
        <input
          className={Styles.input}
          type={showPass ? "text" : "password"}
          placeholder="Password"
          {...register("Password", { required: true, minLength: 6 })}
        />
        {showPass ? (
          <FaRegEye
            onClick={() => setShowPass((prev) => !prev)}
            className={Styles.show_hide_icon}
          />
        ) : (
          <FaRegEyeSlash
            onClick={() => setShowPass((prev) => !prev)}
            className={Styles.show_hide_icon}
          />
        )}
      </div>
      {((errors.Password && errors.Password.type === "minLength") ||
        errors.Password) && (
        <span className={Styles.required}>At least 6 characters</span>
      )}

      <input className={Styles.signUp_btn} type="submit" value="Sign Up" />
    </form>
  );
};

export default SignUpForm;
