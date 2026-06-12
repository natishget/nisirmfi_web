CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE TABLE "news" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
  "summary" TEXT NOT NULL,
  "publishedDate" TIMESTAMP(3) NOT NULL,
  "readTime" INTEGER NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "careers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "responsibilities" TEXT[] NOT NULL,
  "qualification" TEXT[] NOT NULL,
  "salary" TEXT NOT NULL,
  "benefits" TEXT[] NOT NULL,
  "postDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);
