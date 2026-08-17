import StatCard from "@/components/shared/StatCard";

export default function CustomerStats({ customers = [] }) {
  const total = customers.length;
  const verified = customers.filter((item) => item.is_verified).length;
  const unverified = customers.filter((item) => !item.is_verified).length;
  const admins = customers.filter((item) => item.is_staff).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Customers" value={total} />
      <StatCard
        title="Verified Customers"
        value={verified}
        valueClassName="text-green-600"
      />
      <StatCard
        title="Unverified Customers"
        value={unverified}
        valueClassName="text-yellow-600"
      />
      <StatCard
        title="Admin Customers"
        value={admins}
        valueClassName="text-red-600"
      />
    </div>
  );
}
