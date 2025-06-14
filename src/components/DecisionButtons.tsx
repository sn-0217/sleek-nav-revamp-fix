
import { CheckCircle, XCircle, Timer } from 'lucide-react';

type Decision = 'Approved' | 'Rejected' | 'Timed';

interface DecisionButtonsProps {
  selectedDecision: Decision | null;
  onDecisionSelect: (decision: Decision) => void;
}

const DecisionButtons = ({ selectedDecision, onDecisionSelect }: DecisionButtonsProps) => {
  const getDecisionConfig = (decision: Decision) => {
    const configs = {
      Approved: {
        icon: CheckCircle,
        gradient: 'from-emerald-500 to-green-600',
        hoverGradient: 'from-emerald-600 to-green-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        glowColor: 'shadow-emerald-200'
      },
      Rejected: {
        icon: XCircle,
        gradient: 'from-rose-500 to-red-600',
        hoverGradient: 'from-rose-600 to-red-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-700',
        glowColor: 'shadow-rose-200'
      },
      Timed: {
        icon: Timer,
        gradient: 'from-amber-500 to-orange-600',
        hoverGradient: 'from-amber-600 to-orange-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        glowColor: 'shadow-amber-200'
      }
    };
    return configs[decision];
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {(['Approved', 'Rejected', 'Timed'] as const).map((decision) => {
        const config = getDecisionConfig(decision);
        const Icon = config.icon;
        const isSelected = selectedDecision === decision;
        
        return (
          <button
            key={decision}
            type="button"
            onClick={() => onDecisionSelect(decision)}
            className={`
              relative overflow-hidden group/btn p-4 rounded-xl border-2 font-semibold transition-all duration-300
              hover:scale-105 active:scale-95 min-h-[70px] flex flex-col items-center justify-center gap-2
              ${isSelected 
                ? `bg-gradient-to-r ${config.gradient} text-white border-transparent shadow-lg ${config.glowColor} shadow-lg` 
                : `${config.bgColor} ${config.borderColor} ${config.textColor} hover:shadow-lg hover:${config.bgColor}`
              }
            `}
            data-decision={decision.toLowerCase()}
          >
            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : config.textColor}`} />
            <span className="text-xs font-medium">{decision}</span>
            {isSelected && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DecisionButtons;
