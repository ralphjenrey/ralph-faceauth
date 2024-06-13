"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */

    setErrorMessage(error.message);
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center">
      <h2>Something went wrong! {errorMessage}</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        &nbsp;Try again
      </button>
    </div>
  );
}
