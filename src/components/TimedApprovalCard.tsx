
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TimedApprovalCardProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimedApprovalCard = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimedApprovalCardProps) => {
  return (
    <Card className="animate-in fade-in-50 duration-500 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm" data-section="timed-approval">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-amber-800 text-xl">
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-base">Time Window</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label htmlFor="start-time" className="flex items-center gap-3 text-sm font-semibold text-amber-700">
              <Clock className="w-4 h-4" />
              Start Date & Time
            </label>
            <Input
              id="start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-12 text-base"
              data-input="start-time"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="end-time" className="flex items-center gap-3 text-sm font-semibold text-amber-700">
              <Clock className="w-4 h-4" />
              End Date & Time
            </label>
            <Input
              id="end-time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-12 text-base"
              data-input="end-time"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimedApprovalCard;
