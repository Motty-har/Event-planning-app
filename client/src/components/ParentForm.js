import React, { useEffect } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { useGlobalState } from "./Context";

function ParentForm() {
  const { logIn, setLogIn} = useGlobalState();

  useEffect(() => {
    setLogIn(false);
  }, []);
  console.log(logIn)
  return logIn ? (
    <LogIn />
  ) : (
    <SignUp />
  );
}

export default ParentForm;