"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { button } from "@nextui-org/theme";
import { useDisclosure } from "@nextui-org/modal";
import { useState } from "react";
import dynamic from "next/dynamic";

import { createAccount } from "../actions";

import { title } from "@/components/primitives";
import FaceRecognitionModal from "@/components/face-recognition-modal";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;

    if (confirmPassword === password) {
      setErrorMessage("");

      return;
    }

    setErrorMessage("Passwords do not match");
  };

  return (
    <div className="space-y-4">
      <h1 className={title()}>Sign Up</h1>

      <Input
        isRequired
        label="Username"
        name="username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        isRequired
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        isRequired
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          handleConfirmPassword(e);
        }}
      />
      <h3 className="text-sm text-warning-500">{errorMessage}</h3>
      <Button
        className={`w-full ${button({
          color: "warning",
          variant: "shadow",
          radius: "full",
        })}`}
        onClick={onOpen}
      >
        Sign Up
      </Button>

      <FaceRecognitionModal
        isOpen={isOpen}
        password={password}
        userInfo={{}}
        username={username}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
}
