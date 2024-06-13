"use server";

import {
  loadFaceExpressionModel,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
} from "face-api.js";

const loadModels = async () => {
  const MODEL_URL = "/models";

  await loadSsdMobilenetv1Model(MODEL_URL);
  await loadFaceLandmarkModel(MODEL_URL);
  await loadFaceRecognitionModel(MODEL_URL);
  await loadFaceExpressionModel(MODEL_URL);

  console.log("Face API models loaded");
};
