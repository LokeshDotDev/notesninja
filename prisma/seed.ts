import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
	{ id: "furniture", name: "Furniture" },
	{ id: "ceramic", name: "Ceramic" },
	{ id: "curtain", name: "Curtain" },
	{ id: "key_and_cover", name: "Key & Cover" },
	{ id: "led_and_plugs", name: "LED & Plugs" },
	{ id: "metal_frame_bed", name: "Metal Frame Bed" },
	{ id: "motel_sign_board", name: "Motel Sign Board" },
];

async function main() {
	for (const cat of categories) {
		await prisma.category.upsert({
			where: { id: cat.id },
			update: {},
			create: cat,
		});
	}
}

main().finally(() => prisma.$disconnect());
