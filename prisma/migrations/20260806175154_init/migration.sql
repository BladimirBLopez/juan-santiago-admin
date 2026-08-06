-- CreateEnum
CREATE TYPE "ServicioTipo" AS ENUM ('AMARRE', 'ENDULZAMIENTO', 'RETORNO', 'ALEJAMIENTO', 'UNION_PAREJA');

-- CreateEnum
CREATE TYPE "ConsultaEstado" AS ENUM ('NUEVO', 'EN_PROCESO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "PagoEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "SeguimientoTipo" AS ENUM ('RECORDATORIO_AVANCE', 'TESTIMONIO', 'AVISO_PAGO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3),
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "servicio" "ServicioTipo" NOT NULL,
    "situacion" TEXT NOT NULL,
    "estado" "ConsultaEstado" NOT NULL DEFAULT 'NUEVO',
    "fechaInicio" TIMESTAMP(3),
    "diasTrabajo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "comprobanteUrl" TEXT NOT NULL,
    "estado" "PagoEstado" NOT NULL DEFAULT 'PENDIENTE',
    "aprobadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguimiento" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "tipo" "SeguimientoTipo" NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "fechaEnvio" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_usuario_key" ON "Admin"("usuario");

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seguimiento" ADD CONSTRAINT "Seguimiento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
