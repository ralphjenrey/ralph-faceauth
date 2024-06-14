import { useActionState, useEffect, useRef, useState } from "react";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import {
  FaceMatcher,
  LabeledFaceDescriptors,
  detectSingleFace,
  loadFaceExpressionModel,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
} from "face-api.js";
import { useRouter } from "next/navigation";

import { title } from "./primitives";
import FormButton from "./form-button";

import { createAccount } from "@/app/actions";
import { useFormState } from "react-dom";

interface FaceID {
  label: string;
  descriptors: Float32Array[];
}

type UserInfo = {
  faceID: FaceID;
  username: string;
};

type FaceRecognitionModalProps = {
  isOpen: boolean;
  password: string;
  userInfo: UserInfo;
  onClose: () => void;
  onOpen: () => void;
  username: string;
};

export default function FaceRecognitionModal({
  isOpen,
  password,
  userInfo,
  onClose,
  onOpen,
  username,
}: FaceRecognitionModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState("");
  const [faceDescriptorJson, setFaceDescriptorJson] = useState({});
  const [captured, setCaptured] = useState(false);
  const [formState, formAction] = useFormState(
    (prevState: any, formData: FormData) => createAccount(prevState, formData),
    {
      message: "",
    },
  );
  const router = useRouter();
  let isHappy = false;
  let isCapture = false;

  const { faceID } = userInfo ?? {};

  useEffect(() => {
    if (formState.message !== "") {
      console.log("Form state:", formState);
      setTimeout(() => {
        onClose(); // Call onClose after a 3-second delay
      }, 3000);
    }
  }, [formState]);

  useEffect(() => {
    loadModels();
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the webcam:", err);
      }
    };

    const stopVideo = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();

        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };

    if (isOpen) {
      startVideo();
      detectFaces();
    } else {
      stopVideo();
    }

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      stopVideo();
    };
  }, [isOpen]); // Depend on isOpen to start/stop video based on modal state

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await loadSsdMobilenetv1Model(MODEL_URL);
    await loadFaceLandmarkModel(MODEL_URL);
    await loadFaceRecognitionModel(MODEL_URL);
    await loadFaceExpressionModel(MODEL_URL);

    console.log("Face API models loaded");
  };

  const detectFaces = async () => {
    setInterval(async () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended &&
        !isCapture
      ) {
        try {
          if (videoRef.current && canvasRef.current) {
            const detection = await detectSingleFace(videoRef.current)
              .withFaceLandmarks()
              .withFaceExpressions()
              .withFaceDescriptor();

            if (!detection) {
              console.log("No face detected");
              setError("No face detected");
              return;
            }

            if (detection.detection.score < 0.7) {
              console.log("Face might not be fully visible");
              setError("Face might not be fully visible");
            }

            if (
              !detection ||
              detection.expressions.happy < 0.7 ||
              detection.detection.score < 0.7
            ) {
              console.log("Please smile for the camera");
              setError("Please smile for the camera");
            }
            if (detection.expressions.happy > 0.7) {
              // adjust the threshold as needed
              console.log("Happy Meal");
              isHappy = true;
            }
            console.log("Is happy:", isHappy);
            if (isHappy) {
              const faceDescriptor = [detection.descriptor];
              //   const faceDescriptorString = JSON.stringify(
              //     Array.from(faceDescriptor),
              //   );

              const faceDescriptorJson = new LabeledFaceDescriptors(
                username,
                faceDescriptor,
              );

              // Define constants for readability
              const SUCCESS_MESSAGE_SIGNUP =
                "Successfully captured face, Please click submit to create account";
              const SUCCESS_MESSAGE_LOGIN = "Successfully verify";
              const FAILURE_MESSAGE = "Face does not match. Please try again.";
              const MATCH_THRESHOLD = 0.5;

              // Function to handle successful capture
              const handleSuccessCapture = (message: string) => {
                setFaceDescriptorJson(faceDescriptorJson);
                isCapture = true;
                setError(message);
                setCaptured(true);
              };

              if (Object.keys(userInfo).length > 0) {
                console.log("Face descriptor:", faceDescriptorJson.descriptors);
                const faceMatcher = new FaceMatcher(
                  [faceDescriptorJson],
                  MATCH_THRESHOLD,
                );
                const bestMatch = faceMatcher.findBestMatch(
                  faceID.descriptors[0],
                );

                if (bestMatch && bestMatch.label !== "unknown") {
                  console.log("Best match found:", bestMatch.toString());
                  handleSuccessCapture(SUCCESS_MESSAGE_LOGIN);
                  router.push("/home");
                } else {
                  setError(FAILURE_MESSAGE);
                  setCaptured(false);
                }
              } else {
                handleSuccessCapture(SUCCESS_MESSAGE_SIGNUP);
              }

              console.log("Face descriptor:", faceDescriptorJson);
            }

            // detectBlink(detection.landmarks);

            // const resizedDetection = resizeResults(detection, {
            //   width: videoRef.current.videoWidth,
            //   height: videoRef.current.videoHeight,
            // });

            // const context = canvasRef.current.getContext("2d");

            // if (context) {
            //   context.clearRect(
            //     0,
            //     0,
            //     canvasRef.current.width,
            //     canvasRef.current.height,
            //   );

            //   draw.drawDetections(canvasRef.current, [resizedDetection]);
            //   draw.drawFaceLandmarks(canvasRef.current, [resizedDetection]);
            //   draw.drawFaceExpressions(canvasRef.current, [resizedDetection]);
            // }
          } else {
            console.error(
              "videoRef.current or canvasRef.current is not properly set",
            );
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    }, 1000);
  };

  const handleClose = async (e: any) => {
    e.preventDefault();
    // Wait until pending is false

    onClose(); // Call onClose after pending is false
  };

  return (
    <Modal
      className="p-10"
      isOpen={isOpen}
      placement="center"
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="flex justify-center items-center">
          <h1
            className={`${title({
              size: "sm",
            })} text-center`}
          >
            Face Identity Registration
          </h1>
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              controls={false}
              disablePictureInPicture={true}
              style={{
                borderRadius: "50%",
                width: "300px",
                height: "300px",
                objectFit: "cover",
              }}
            />
            <canvas
              ref={canvasRef}
              id="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
          {error ? <p>{error}</p> : <Spinner />}
          {Object.keys(userInfo).length == 0 && (
            <form action={formAction} method="POST">
              <input name="username" type="hidden" value={username} />
              <input name="password" type="hidden" value={password} />
              <input
                name="faceID"
                type="hidden"
                value={JSON.stringify(faceDescriptorJson)}
              />
              <FormButton color="primary">Submit</FormButton>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
