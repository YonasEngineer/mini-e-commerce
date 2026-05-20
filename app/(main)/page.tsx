import { prisma } from "@/lib/prisma";
import Product from "@/components/product/Product";
export default async function Home() {
  const products = await prisma.product.findMany({
    include: {
      ProductImage: true,
    },
  });
  return (
    <main>
      <Product products={products} />
    </main>
  );
}
