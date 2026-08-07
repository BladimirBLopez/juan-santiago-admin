-- CreateTable
CREATE TABLE "Precio" (
    "id" TEXT NOT NULL,
    "servicio" "ServicioTipo" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Precio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Precio_servicio_key" ON "Precio"("servicio");
