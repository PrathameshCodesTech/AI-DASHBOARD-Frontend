import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = 0, 
  subtitle = '', 
  color = 'primary',
  loading = false 
}) => {
  const colorClasses = {
    primary: 'from-primary-600/20 to-primary-500/10 border-primary-500/30',
    success: 'from-green-600/20 to-green-500/10 border-green-500/30',
    warning: 'from-yellow-600/20 to-yellow-500/10 border-yellow-500/30',
    error: 'from-red-600/20 to-red-500/10 border-red-500/30',
    info: 'from-blue-600/20 to-blue-500/10 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-500/10 border-purple-500/30',
  };

  const iconColorClasses = {
    primary: 'text-primary-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    purple: 'text-purple-400',
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-dark-500" />;
  };

  if (loading) {
    return (
      <div className={`metric-card bg-gradient-to-br ${colorClasses[color]} animate-pulse`}>
        <div className="h-24"></div>
      </div>
    );
  }

  return (
    <div className={`metric-card bg-gradient-to-br ${colorClasses[color]} group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-dark-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-dark-50 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="text-dark-500 text-xs">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`${iconColorClasses[color]} p-3 rounded-lg bg-dark-800/50 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {trend !== 0 && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-800">
          {getTrendIcon()}
          <span className={`text-sm ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-dark-500'}`}>
            {Math.abs(trend)}% {trend > 0 ? 'increase' : trend < 0 ? 'decrease' : 'no change'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;