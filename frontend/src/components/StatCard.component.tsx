interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'brown' | 'green' | 'sand';
}

const colorMap = {
  brown: 'bg-impala-brown/10 text-impala-brown',
  green: 'bg-impala-green/10 text-impala-green',
  sand: 'bg-impala-sand text-impala-charcoal-muted',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = 'sand' }) => {
  return (
    <div className={`rounded-xl p-6 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1 font-display">{value}</p>
        </div>
        {icon && <div className="text-2xl opacity-60">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
