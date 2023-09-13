import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Styles from "./loginForm.module.scss";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

import { auth } from "../../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

const LoginForm = () => {
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
    await signInWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
        localStorage.setItem("user", JSON.stringify(auth.currentUser.email));

        navigate("/home");
        Toast.fire({
          icon: "success",
          title: "Welcome!",
        });
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error,
        });
      });
  };
  return (
    <form className={Styles.login_form} onSubmit={handleSubmit(onSubmit)}>
      <label>Email address</label>
      <input
        className={Styles.input}
        placeholder="Example@gmail.com"
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
          {...register("Password", { required: true })}
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

      {errors.Password && (
        <span className={Styles.required}>This field is required</span>
      )}

      <input className={Styles.login_btn} type="submit" value="Sign In" />
    </form>
  );
};

export default LoginForm;
