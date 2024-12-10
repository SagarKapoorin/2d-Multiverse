import { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setAvatarId, setRole, setName, setType } from "../state";
import { User, Lock, UserCircle } from 'lucide-react';
import './LoginForm.css'
import './login.css'
import { AnimatedBackground } from "./AnimatedBackground";
import { showErrorToast, showSuccessToast } from "../components/Message";


interface RegisterValues {
  username: string;
  password: string;
  role?: string;
}

interface LoginValues {
  username: string;
  password: string;
  role?: string;
}

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().oneOf(["user", "admin", ""], "Role must be 'user' or 'admin'").notRequired(),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister: RegisterValues = {
  username: "",
  password: "",
  role: "",
};

const initialValuesLogin: LoginValues = {
  username: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState<"login" | "register">("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (
    values: RegisterValues,
    onSubmitProps: FormikHelpers<RegisterValues>
  ) => {
    const response = await fetch("http://localhost:3000/api/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        type: values.role || "user",
      }),
    });
    const savedUser = await response.json();
    if(savedUser){
      showSuccessToast({message:"Successfully Created Profile"});
    }else{
      showErrorToast({message:`Error in Creating Profile`});
    }
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (
    values: LoginValues,
    onSubmitProps: FormikHelpers<LoginValues>
  ) => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await response.json();
    onSubmitProps.resetForm();
    
    if (loggedIn) {
      dispatch(setLogin({ token: loggedIn.token }));
      dispatch(setAvatarId({ avatarId: loggedIn.avatarId || undefined }));
      dispatch(setRole({ role: loggedIn.role }));
      dispatch(setName({ name: loggedIn.name }));
      dispatch(setType());
      showSuccessToast({message:"Successfully Loggedin"});
      setTimeout(() => navigate("/home"), 1000);
    }else{
      showErrorToast({message:"Loggedin Failed"})
    }
  };

  const GoogleLogin = async () => {

    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  const handleFormSubmit = async (
    values: RegisterValues | LoginValues,
    onSubmitProps: FormikHelpers<RegisterValues | LoginValues>
  ) => {
    if (isLogin) {
      await login(values as LoginValues, onSubmitProps);
    } else {
      await register(values as RegisterValues, onSubmitProps);
    }
  };

  return (
    <div className="app-container-login">
      <AnimatedBackground></AnimatedBackground>
    <div className="form-container-login">
      <div className="form-header-login">
        <h1 className="form-title-login">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className="form-subtitle-login">
          {isLogin ? "Please sign in to continue" : "Please fill in your details"}
        </p>
      </div>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group-login">
              <User className="input-icon-login" size={20} />
              <input
                className={`form-input-login ${
                  touched.username && errors.username ? "input-error-login" : ""
                }`}
                type="text"
                placeholder="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
              />
              {touched.username && errors.username && (
                <div className="error-message-login">{errors.username}</div>
              )}
            </div>

            <div className="form-group-login">
              <Lock className="input-icon-login" size={20} />
              <input
                className={`form-input-login ${
                  touched.password && errors.password ? "input-error-login" : ""
                }`}
                type="password"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
              />
              {touched.password && errors.password && (
                <div className="error-message-login">{errors.password}</div>
              )}
            </div>

            {isRegister && (
              <div className="form-group-login">
                <UserCircle className="input-icon-login" size={20} />
                <input
                  className={`form-input-login ${
                    touched.role && errors.role ? "input-error-login" : ""
                  }`}
                  type="text"
                  placeholder="Role (Optional)"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role || ""}
                  name="role"
                />
                {touched.role && errors.role && (
                  <div className="error-message-login">{errors.role}</div>
                )}
              </div>
            )}

            {isLogin && (
              <div className="form-actions-login">
                <label className="checkbox-group-login">
                  <input type="checkbox" className="checkbox-input-login" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link-login">
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="submit-button-login">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>

            {isLogin && (
              <div className="google-button-login" onClick={GoogleLogin}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
                />
                Sign in with Google
              </div>
            )}

            <div className="signup-link-login">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <a
                href="#"
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </a>
            </div>
          </form>
        )}
      </Formik>
    </div>
  
    </div>
  );
};

export default Form;