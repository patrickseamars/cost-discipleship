import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface AssessmentComparisonData {
  item: string;
  initial: number;
  final: number;
  change: number;
  shortLabel: string;
}

interface AssessmentComparisonChartProps {
  comparisonData: AssessmentComparisonData[];
  initialAverageScore?: number;
  finalAverageScore?: number;
}

export const AssessmentComparisonChart = ({
  comparisonData,
  initialAverageScore = 0,
  finalAverageScore = 0
}: AssessmentComparisonChartProps) => {
  const averageChange = finalAverageScore - initialAverageScore;
  
  // Don't render if no data
  if (!comparisonData || comparisonData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No assessment data available for comparison.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (change < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-2">{data.item}</p>
          <div className="space-y-1">
            <p className="text-xs text-orange-600">
              Initial: <span className="font-mono font-medium">{data.initial}/10</span>
            </p>
            <p className="text-xs text-green-600">
              Final: <span className="font-mono font-medium">{data.final}/10</span>
            </p>
            <p className="text-xs text-gray-600">
              Change: <span className={`font-mono font-medium ${data.change > 0 ? 'text-green-600' : data.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {data.change > 0 ? '+' : ''}{data.change}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Assessment Growth Comparison
        </CardTitle>
        {(initialAverageScore > 0 || finalAverageScore > 0) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Initial Average:</span>
                <span className="font-mono font-medium ml-1">{initialAverageScore.toFixed(1)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Final Average:</span>
                <span className="font-mono font-medium ml-1">{finalAverageScore.toFixed(1)}</span>
              </div>
            </div>
            <Badge variant="outline" className={`${getChangeColor(averageChange)} border`}>
              <div className="flex items-center gap-1">
                {getChangeIcon(averageChange)}
                <span className="font-mono text-xs">
                  {averageChange > 0 ? '+' : ''}{averageChange.toFixed(1)}
                </span>
              </div>
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="shortLabel" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Rating (1-10)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={5} stroke="#e5e7eb" strokeDasharray="2 2" />
                <ReferenceLine y={7.5} stroke="#d1d5db" strokeDasharray="2 2" />
                <Bar dataKey="initial" fill="#f97316" name="Initial" radius={[2, 2, 0, 0]} />
                <Bar dataKey="final" fill="#10b981" name="Final" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Initial Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Final Assessment</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {comparisonData.filter(item => item.change > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Areas Improved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {comparisonData.filter(item => item.change === 0).length}
              </div>
              <div className="text-xs text-muted-foreground">No Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {comparisonData.filter(item => item.change < 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Areas Declined</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};