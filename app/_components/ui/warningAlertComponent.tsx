"use client";

import { useState } from "react";
import Alert from "./alert";
import Button from "./button";
import { regenerateToken } from "../utils/regenerateToken";
import Message from "./message";

interface WarningAlertComponentProps {
  token: string;
  error: string;
  origin: string;
}

export default function WarningAlertComponent({
  token,
  error,
  origin,
}: WarningAlertComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleRegenerateToken = async () => {
    setIsLoading(true);
    setIsSuccess(null);
    setResponseMessage("");

    try {
      const response = await regenerateToken(token, origin);
      const responseData = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setResponseMessage(
          responseData.message || "A new link has been sent to your email.",
        );
      } else {
        setIsSuccess(false);
        setResponseMessage(
          responseData.error || "Failed to regenerate the token.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSuccess(false);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(null);
        setResponseMessage("");
      }, 5000);
    }
  };

  if (error) {
    const isExpiredError = error.toLowerCase().includes("expire");

    return (
      <div>
        <Alert type="warning" message={error} />
        {isExpiredError && (
          <div className="mt-4">
            <Button
              variant="secondary"
              isLoading={isLoading}
              isSuccess={isSuccess}
              onClick={handleRegenerateToken}
            >
              Regenerate Token
            </Button>
            <Message
              type={isSuccess ? "success" : "error"}
              message={responseMessage}
            />
          </div>
        )}
      </div>
    );
  }
}
