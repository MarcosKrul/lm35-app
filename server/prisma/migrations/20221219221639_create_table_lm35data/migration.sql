-- CreateTable
CREATE TABLE "lm35_data" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "analog" INTEGER NOT NULL,

    CONSTRAINT "lm35_data_pkey" PRIMARY KEY ("id")
);
