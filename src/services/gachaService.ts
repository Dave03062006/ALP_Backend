import { prismaClient } from "../utils/database-util";
import config from "../config/index";

type GachaItemResult = {
  itemId: number;
  itemName: string;
};

type GachaResult = {
  success: boolean;
  message: string;
  data?: GachaItemResult[];
};

const RARITY_DISTRIBUTION: Record<string, number> = {
  legendary: 0.02,
  epic: 0.10,
  rare: 0.25,
  uncommon: 0.30,
  common: 0.33,
};

function chooseWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (r <= acc) return items[i];
  }
  return items[items.length - 1];
}

export async function performGacha(
  profileId: number,
  gameId: number,
  rolls: number = 1
): Promise<GachaResult> {

  const prisma = prismaClient;
  const COST = config.GACHA_COST;

  const [profile, pool] = await Promise.all([
    prisma.profile.findUnique({ where: { id: profileId } }),
    prisma.gachaPool.findUnique({
      where: { gameId },
      include: { items: { include: { item: true } } },
    }),
  ]);

  if (!profile) return { success: false, message: "Profile not found" };
  if (!pool) return { success: false, message: "Gacha pool not found" };
  if ((profile.points ?? 0) < COST * rolls)
    return { success: false, message: "Not enough points" };

  // 🔹 siapkan item + weight
  const items: any[] = [];
  const weights: number[] = [];

  for (const pi of pool.items) {
    const rarity = (pi.item?.rarity ?? "common").toLowerCase();
    const weight = RARITY_DISTRIBUTION[rarity] ?? 0.33;
    items.push(pi);
    weights.push(weight);
  }

  const results: GachaItemResult[] = [];

  for (let i = 0; i < rolls; i++) {
    const chosen = chooseWeighted(items, weights);
    results.push({
      itemId: chosen.item.id,
      itemName: chosen.item.itemName,
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.profile.update({
        where: { id: profileId },
        data: { points: { decrement: COST * rolls } },
      });

      for (const r of results) {
        const exist = await tx.profileItem.findUnique({
          where: {
            profileId_itemId: {
              profileId,
              itemId: r.itemId,
            },
          },
        });

        if (!exist) {
          await tx.profileItem.create({
            data: { profileId, itemId: r.itemId },
          });
        }

        await tx.gachaHistory.create({
          data: {
            profileId,
            gachaPoolId: pool.id,
            itemId: r.itemId,
            pointsSpent: COST,
          },
        });
      }
    });

    return {
      success: true,
      message: "Gacha successful",
      data: results,
    };

  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export default { performGacha };
