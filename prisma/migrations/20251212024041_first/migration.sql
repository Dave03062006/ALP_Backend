-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "profilePictureId" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "achievementCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "eventId" INTEGER,
    "transactionTypeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionType" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "pointsMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "TransactionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyRate" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "currencyName" TEXT NOT NULL,
    "toIDR" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CurrencyRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isMilestone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileItem" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GachaPool" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "costPerRoll" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GachaPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GachaPoolItem" (
    "id" SERIAL NOT NULL,
    "gachaPoolId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "dropRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GachaPoolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GachaHistory" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "gachaPoolId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "pointsSpent" INTEGER NOT NULL,
    "rolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GachaHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "voucherName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT -1,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherPurchase" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "pointsSpent" INTEGER NOT NULL,
    "voucherCode" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VoucherPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_username_idx" ON "Profile"("username");

-- CreateIndex
CREATE INDEX "Profile_email_idx" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE INDEX "Game_name_idx" ON "Game"("name");

-- CreateIndex
CREATE INDEX "Transaction_profileId_idx" ON "Transaction"("profileId");

-- CreateIndex
CREATE INDEX "Transaction_gameId_idx" ON "Transaction"("gameId");

-- CreateIndex
CREATE INDEX "Transaction_purchaseDate_idx" ON "Transaction"("purchaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionType_typeName_key" ON "TransactionType"("typeName");

-- CreateIndex
CREATE INDEX "Event_gameId_idx" ON "Event"("gameId");

-- CreateIndex
CREATE INDEX "Event_eventName_idx" ON "Event"("eventName");

-- CreateIndex
CREATE INDEX "CurrencyRate_gameId_idx" ON "CurrencyRate"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRate_gameId_currencyName_key" ON "CurrencyRate"("gameId", "currencyName");

-- CreateIndex
CREATE INDEX "Item_rarity_idx" ON "Item"("rarity");

-- CreateIndex
CREATE INDEX "ProfileItem_profileId_idx" ON "ProfileItem"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileItem_profileId_itemId_key" ON "ProfileItem"("profileId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "GachaPool_gameId_key" ON "GachaPool"("gameId");

-- CreateIndex
CREATE INDEX "GachaPoolItem_gachaPoolId_idx" ON "GachaPoolItem"("gachaPoolId");

-- CreateIndex
CREATE UNIQUE INDEX "GachaPoolItem_gachaPoolId_itemId_key" ON "GachaPoolItem"("gachaPoolId", "itemId");

-- CreateIndex
CREATE INDEX "GachaHistory_profileId_idx" ON "GachaHistory"("profileId");

-- CreateIndex
CREATE INDEX "GachaHistory_rolledAt_idx" ON "GachaHistory"("rolledAt");

-- CreateIndex
CREATE INDEX "Voucher_gameId_idx" ON "Voucher"("gameId");

-- CreateIndex
CREATE INDEX "Voucher_pointsCost_idx" ON "Voucher"("pointsCost");

-- CreateIndex
CREATE INDEX "VoucherPurchase_profileId_idx" ON "VoucherPurchase"("profileId");

-- CreateIndex
CREATE INDEX "VoucherPurchase_voucherId_idx" ON "VoucherPurchase"("voucherId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyRate" ADD CONSTRAINT "CurrencyRate_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileItem" ADD CONSTRAINT "ProfileItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileItem" ADD CONSTRAINT "ProfileItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaPool" ADD CONSTRAINT "GachaPool_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaPoolItem" ADD CONSTRAINT "GachaPoolItem_gachaPoolId_fkey" FOREIGN KEY ("gachaPoolId") REFERENCES "GachaPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaPoolItem" ADD CONSTRAINT "GachaPoolItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaHistory" ADD CONSTRAINT "GachaHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaHistory" ADD CONSTRAINT "GachaHistory_gachaPoolId_fkey" FOREIGN KEY ("gachaPoolId") REFERENCES "GachaPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherPurchase" ADD CONSTRAINT "VoucherPurchase_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherPurchase" ADD CONSTRAINT "VoucherPurchase_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
