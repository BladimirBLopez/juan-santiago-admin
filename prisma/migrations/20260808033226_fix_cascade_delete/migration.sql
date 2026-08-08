-- DropForeignKey
ALTER TABLE "Pago" DROP CONSTRAINT "Pago_consultaId_fkey";

-- DropForeignKey
ALTER TABLE "Seguimiento" DROP CONSTRAINT "Seguimiento_consultaId_fkey";

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seguimiento" ADD CONSTRAINT "Seguimiento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
