-- CreateEnum
CREATE TYPE "TipoMedia" AS ENUM ('IMAGEN', 'VIDEO', 'AUDIO');

-- CreateTable
CREATE TABLE "Testimonio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "servicio" "ServicioTipo",
    "texto" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaTipo" "TipoMedia",
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonio_pkey" PRIMARY KEY ("id")
);
