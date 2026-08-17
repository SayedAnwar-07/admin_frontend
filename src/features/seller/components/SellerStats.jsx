import StatCard from "@/components/shared/StatCard";

export default function SellerStats({ sellers = [] }) {
  const total = sellers.length;
  const verified = sellers.filter((item) => item.is_verified).length;
  const unverified = sellers.filter((item) => !item.is_verified).length;
  const admins = sellers.filter((item) => item.is_staff).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Sellers" value={total} />
      <StatCard
        title="Verified Sellers"
        value={verified}
        valueClassName="text-green-600"
      />
      <StatCard
        title="Unverified Sellers"
        value={unverified}
        valueClassName="text-yellow-600"
      />
      <StatCard
        title="Admin Sellers"
        value={admins}
        valueClassName="text-red-600"
      />
    </div>
  );
}
