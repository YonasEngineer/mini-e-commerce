import ProductDetail from "@/components/product/ProductDetail";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      ProductImage: true,
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
};

export default Page;
