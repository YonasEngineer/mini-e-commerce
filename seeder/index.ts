import { PrismaClient } from "../generated/prisma/client";
import { Prisma } from "../generated/prisma/client";
import pkg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log("see the database url", process.env.DATABASE_URL);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // Categories
  // =========================

  const foodCategory = await prisma.category.upsert({
    where: { name: "Food" },
    update: {},
    create: {
      name: "Food",
      icon: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },
  });

  const electronicsCategory = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      name: "Electronics",
      icon: "https://cdn-icons-png.flaticon.com/512/3659/3659898.png",
    },
  });

  // =========================
  // Sub Categories
  // =========================

  const burgerSubCategory = await prisma.subCategory.upsert({
    where: {
      name_categoryId: {
        name: "Burger",
        categoryId: foodCategory.id,
      },
    },
    update: {},
    create: {
      name: "Burger",
      categoryId: foodCategory.id,
    },
  });

  const pizzaSubCategory = await prisma.subCategory.upsert({
    where: {
      name_categoryId: {
        name: "Pizza",
        categoryId: foodCategory.id,
      },
    },
    update: {},
    create: {
      name: "Pizza",
      categoryId: foodCategory.id,
    },
  });

  const phonesSubCategory = await prisma.subCategory.upsert({
    where: {
      name_categoryId: {
        name: "Phones",
        categoryId: electronicsCategory.id,
      },
    },
    update: {},
    create: {
      name: "Phones",
      categoryId: electronicsCategory.id,
    },
  });

  const laptopsSubCategory = await prisma.subCategory.upsert({
    where: {
      name_categoryId: {
        name: "Laptops",
        categoryId: electronicsCategory.id,
      },
    },
    update: {},
    create: {
      name: "Laptops",
      categoryId: electronicsCategory.id,
    },
  });

  // =========================
  // Products
  // =========================

  const products = [
    {
      name: "Classic Cheeseburger",
      description:
        "Juicy grilled beef burger with cheddar cheese, lettuce, tomato, onions, and signature sauce served in a toasted bun.",
      basePrice: new Prisma.Decimal(350),
      stock: 120,
      slug: "classic-cheeseburger",
      isActive: true,
      views: 120,
      salesCount: 45,
      ratings: 4.5,
      totalRatings: 32,
      tags: ["burger", "fast-food", "beef"],
      keywords: ["burger", "cheese burger", "beef burger"],
      categoryId: foodCategory.id,
      subCategoryId: burgerSubCategory.id,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    },

    {
      name: "Chicken Burger Deluxe",
      description:
        "Crispy fried chicken burger with fresh lettuce, pickles, cheese, and creamy mayonnaise.",
      basePrice: new Prisma.Decimal(420),
      stock: 85,
      slug: "chicken-burger-deluxe",
      isActive: true,
      views: 98,
      salesCount: 38,
      ratings: 4.4,
      totalRatings: 27,
      tags: ["burger", "chicken", "fast-food"],
      keywords: ["chicken burger", "crispy burger"],
      categoryId: foodCategory.id,
      subCategoryId: burgerSubCategory.id,
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
    },

    {
      name: "Margherita Pizza",
      description:
        "Traditional Italian pizza topped with mozzarella cheese, tomato sauce, and fresh basil.",
      basePrice: new Prisma.Decimal(650),
      stock: 60,
      slug: "margherita-pizza",
      isActive: true,
      views: 150,
      salesCount: 70,
      ratings: 4.8,
      totalRatings: 55,
      tags: ["pizza", "italian", "cheese"],
      keywords: ["pizza", "margherita", "italian pizza"],
      categoryId: foodCategory.id,
      subCategoryId: pizzaSubCategory.id,
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    },

    {
      name: "Pepperoni Pizza",
      description:
        "Loaded pepperoni pizza with mozzarella cheese and rich tomato sauce baked to perfection.",
      basePrice: new Prisma.Decimal(780),
      stock: 55,
      slug: "pepperoni-pizza",
      isActive: true,
      views: 180,
      salesCount: 92,
      ratings: 4.9,
      totalRatings: 74,
      tags: ["pizza", "pepperoni", "italian"],
      keywords: ["pepperoni pizza", "pizza"],
      categoryId: foodCategory.id,
      subCategoryId: pizzaSubCategory.id,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    },

    {
      name: "iPhone 15 Pro",
      description:
        "Apple iPhone 15 Pro with A17 Pro chip, titanium design, advanced camera system, and USB-C connectivity.",
      basePrice: new Prisma.Decimal(125000),
      stock: 20,
      slug: "iphone-15-pro",
      isActive: true,
      views: 350,
      salesCount: 110,
      ratings: 4.9,
      totalRatings: 96,
      tags: ["apple", "iphone", "smartphone"],
      keywords: ["iphone 15", "apple phone", "smartphone"],
      categoryId: electronicsCategory.id,
      subCategoryId: phonesSubCategory.id,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    },

    {
      name: "Samsung Galaxy S24 Ultra",
      description:
        "Samsung flagship smartphone featuring AI capabilities, powerful performance, and pro-grade camera system.",
      basePrice: new Prisma.Decimal(118000),
      stock: 25,
      slug: "samsung-galaxy-s24-ultra",
      isActive: true,
      views: 290,
      salesCount: 88,
      ratings: 4.7,
      totalRatings: 61,
      tags: ["samsung", "android", "smartphone"],
      keywords: ["galaxy s24", "android phone"],
      categoryId: electronicsCategory.id,
      subCategoryId: phonesSubCategory.id,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    },

    {
      name: "MacBook Air M3",
      description:
        "Lightweight Apple laptop powered by the M3 chip with exceptional battery life and performance.",
      basePrice: new Prisma.Decimal(165000),
      stock: 12,
      slug: "macbook-air-m3",
      isActive: true,
      views: 410,
      salesCount: 95,
      ratings: 4.9,
      totalRatings: 88,
      tags: ["apple", "laptop", "macbook"],
      keywords: ["macbook", "apple laptop", "m3 macbook"],
      categoryId: electronicsCategory.id,
      subCategoryId: laptopsSubCategory.id,
      image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    },

    {
      name: "Dell XPS 15",
      description:
        "Premium Windows laptop with Intel Core processor, stunning display, and professional-grade performance.",
      basePrice: new Prisma.Decimal(145000),
      stock: 10,
      slug: "dell-xps-15",
      isActive: true,
      views: 240,
      salesCount: 54,
      ratings: 4.6,
      totalRatings: 43,
      tags: ["dell", "windows", "laptop"],
      keywords: ["dell laptop", "xps 15", "windows laptop"],
      categoryId: electronicsCategory.id,
      subCategoryId: laptopsSubCategory.id,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
  ];

  // =========================
  // Insert Products + Images
  // =========================

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: {
        slug: item.slug,
      },
      update: {},
      create: {
        name: item.name,
        description: item.description,
        basePrice: item.basePrice,
        stock: item.stock,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        isActive: item.isActive,
        tags: item.tags,
        keywords: item.keywords,
        slug: item.slug,
        views: item.views,
        salesCount: item.salesCount,
        ratings: item.ratings,
        totalRatings: item.totalRatings,
      },
    });

    await prisma.productImage.create({
      data: {
        imageKey: item.slug,
        url: item.image,
        productId: product.id,
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
