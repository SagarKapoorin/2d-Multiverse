import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state";
import Google from "../components/Google"


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
    console.log(loggedIn.token);
    if (loggedIn) {
      dispatch(
        setLogin({
        //   user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };
  const GoogleLogin=async()=>{
  window.location.href = 'http://localhost:3000/api/v1/auth/google';
 
  }
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
          <Box display="flex" flexDirection="column" gap="20px"  maxWidth="400px" margin="auto">
            <TextField
              label="Username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              name="username"
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#2C3E50", 
                    },
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2C3E50", 
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#2C3E50", 
                    },
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2C3E50", 
                },
              }}
            />
            {isRegister && (
              <TextField
                label="Role (Optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role || ""}
                name="role"
                error={Boolean(touched.role) && Boolean(errors.role)}
                helperText={touched.role && errors.role}
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#2C3E50", 
                        },
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2C3E50", 
                    },
                  }}
              />
            )}
            <Button type="submit" variant="contained"  sx={{
    backgroundColor: "#e14f5b", 
    color: "white",
    "&:hover": {
      backgroundColor: "#f5a3b1",
    },
  }}  fullWidth>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
            <Typography
            color="#2C3E50"
            fontSize="15px"
            ml="8px"
              onClick={() => {
                // resetForm();
                GoogleLogin();
              
              }}
              sx={{ textAlign: "center", }}
            >
             <Google/>
            </Typography>
            <Typography
            color="#2C3E50"
            fontSize="13px"
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{ textAlign: "center", textDecoration: "underline", cursor: "pointer" }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
