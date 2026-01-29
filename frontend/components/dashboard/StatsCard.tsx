import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  borderColor: string;
  iconColor: string;
}

export default function StatsCard({ title, value, subValue, icon: Icon, borderColor, iconColor }: StatsCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} shadow-sm bg-white`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
}