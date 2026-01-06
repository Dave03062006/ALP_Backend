/*
  Warnings:

  - A unique constraint covering the columns `[gameId,eventName]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_gameId_eventName_key" ON "Event"("gameId", "eventName");
