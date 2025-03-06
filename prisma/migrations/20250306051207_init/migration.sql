-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "pocName" TEXT NOT NULL,
    "pocContact" TEXT NOT NULL,
    "voiceName" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "parentTemple" TEXT NOT NULL,
    "counselorName" TEXT NOT NULL,
    "campName" TEXT NOT NULL,
    "firstMealDate" INTEGER NOT NULL,
    "firstMealType" TEXT NOT NULL,
    "lastMealDate" INTEGER NOT NULL,
    "lastMealType" TEXT NOT NULL,
    "dinnerType" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "emailId" TEXT,
    "paymentMode" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deductionSource" TEXT,
    "passcode" TEXT,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
