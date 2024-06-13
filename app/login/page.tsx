"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { button, user } from "@nextui-org/theme";
import { useState } from "react";

import { title } from "@/components/primitives";
import FaceRecognitionModal from "@/components/face-recognition-modal";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userInfo = await response.json();

        setUserInfo(userInfo);
        setIsOk(true);
        console.log("User:", userInfo);
      } else {
        console.error("Failed to sign in");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className={title()}>Sign In</h1>

      <form className="space-y-4">
        <Input
          label="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />{" "}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={`w-full ${button({
            color: "warning",
            variant: "shadow",
            radius: "full",
          })}`}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <FaceRecognitionModal
          isOpen={isOk}
          password={password}
          userInfo={userInfo}
          username={username}
          onClose={() => setIsOk(false)}
          onOpen={() => setIsOk(true)}
        />
      </form>
    </div>
  );
}
