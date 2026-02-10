import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
	{ id: "furniture", name: "Furniture", slug: "furniture" },
	{ id: "ceramic", name: "Ceramic", slug: "ceramic" },
	{ id: "curtain", name: "Curtain", slug: "curtain" },
	{ id: "key_and_cover", name: "Key & Cover", slug: "key-and-cover" },
	{ id: "led_and_plugs", name: "LED & Plugs", slug: "led-and-plugs" },
	{ id: "metal_frame_bed", name: "Metal Frame Bed", slug: "metal-frame-bed" },
	{ id: "motel_sign_board", name: "Motel Sign Board", slug: "motel-sign-board" },
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
