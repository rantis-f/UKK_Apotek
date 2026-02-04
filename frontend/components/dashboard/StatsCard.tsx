import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  borderColor: string;
  iconColor: string;
  className?: string;
}

export default function StatsCard({
  title, value, subValue, icon: Icon, borderColor, iconColor
}: StatsCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} shadow-sm bg-white overflow-hidden transition-all hover:shadow-md active:scale-95`}>
      <div className="p-3 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-gray-400 truncate pr-2">
            {title}
          </p>
          <div className={`${iconColor} opacity-80`}>
            <Icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
          </div>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm md:text-2xl font-black text-gray-800 tracking-tighter truncate">
            {value}
          </h3>

          {subValue && (
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
              {subValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}