-- CreateTable
CREATE TABLE "User" (
    "userID" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "faceID" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);
