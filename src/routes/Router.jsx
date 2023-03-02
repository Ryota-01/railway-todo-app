import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "../components/Home";
import { NotFound } from "../components/NotFound";
import { SignIn } from "../components/SignIn";
import { NewTask } from "../components/NewTask";
import { NewList } from "../components/NewList";
import { EditTask } from "../components/EditTask";
import { SignUp } from "../components/SignUp";
import { EditList } from "../components/EditList";

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn)

  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {auth ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/task/new" element={<NewTask />} />
            <Route path="/list/new" element={<NewList />} />
            <Route path="/lists/:listId/tasks/:taskId" element={<EditTask />} />
            <Route path="/lists/:listId/edit" element={<EditList />} />
          </>
        ) : (
          <Route path="/signin" element={<Navigate to="/signin" />} />
        )}
        <Route element={<NotFound />} />
      </Routes>
    // </BrowserRouter>
  )
}
