-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;

-- CreateTable
CREATE TABLE "Anamnese" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "queixaPrincipal" TEXT,
    "hda" TEXT,
    "hppHf" TEXT,
    "habitos" TEXT,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "cirurgiasPrevias" TEXT,
    "vacinacao" TEXT,
    "observacoes" TEXT,
    "weightKg" REAL,
    "heightM" REAL,
    "patientId" TEXT NOT NULL,
    CONSTRAINT "Anamnese_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "certifications" TEXT,
    "professionalId" TEXT NOT NULL,
    CONSTRAINT "Curriculum_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Anamnese_patientId_key" ON "Anamnese"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_professionalId_key" ON "Curriculum"("professionalId");
