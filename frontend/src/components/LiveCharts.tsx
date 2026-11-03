import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Activity, TrendingUp, Sparkles } from 'lucide-react';
import { TimeSeriesPoint } from '../types';

interface LiveChartsProps {
  timeSeries: TimeSeriesPoint[];
}

export const LiveCharts: React.FC<LiveChartsProps> = ({ timeSeries }) => {
  const hasData = timeSeries && timeSeries.length > 0;

  // Compute peak and average from time series
  const currentViewers = hasData ? timeSeries[timeSeries.length - 1].viewerCount : 0;
  const peakInSeries = hasData
    ? Math.max(...timeSeries.map((p) => p.viewerCount || 0))
    : 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Chart 1: Realtime CCU Viewer Curve */}
      <div className="rounded-2xl bg-[#11131f]/90 border border-white/10 p-4 lg:p-5 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-tiktok-cyan/15 text-tiktok-cyan">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Biến thiên Người xem Realtime (CCU)
                <span className="w-2 h-2 rounded-full bg-tiktok-cyan animate-ping" />
              </h3>
              <p className="text-[11px] text-gray-400">Theo dõi số lượng khán giả đang xem đồng thời trong phòng</p>
            </div>
          </div>

          {hasData && (
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2 py-1 rounded-md bg-white/5 text-gray-300">
                Hiện tại: <strong className="text-tiktok-cyan">{currentViewers.toLocaleString()}</strong>
              </span>
              <span className="px-2 py-1 rounded-md bg-white/5 text-gray-300">
                Đỉnh: <strong className="text-white">{peakInSeries.toLocaleString()}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="h-60 w-full">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-tiktok-cyan/40 mb-2 animate-bounce" />
              <p className="text-xs font-semibold text-gray-300">Chưa có dữ liệu biến thiên CCU</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                Kết nối tới tài khoản LIVE hoặc bấm "Demo Sim" trên thanh công cụ để trải nghiệm biểu đồ thời gian thực.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="timeLabel"
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12141f',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 600, marginBottom: '4px' }}
                  formatter={(val: number) => [`${(val || 0).toLocaleString()} khán giả`, 'CCU']}
                />
                <Area
                  type="monotone"
                  dataKey="viewerCount"
                  name="Người xem"
                  stroke="#00f2fe"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Interaction Velocity per 10s */}
      <div className="rounded-2xl bg-[#11131f]/90 border border-white/10 p-4 lg:p-5 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#fe2c55]/15 text-[#fe2c55]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Tốc độ Tương tác (Mỗi 10 Giây)
              </h3>
              <p className="text-[11px] text-gray-400">So sánh nhịp độ bình luận, lượt vào phòng và kim cương quà tặng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tiktok-cyan" />
              <span className="text-gray-300">Bình luận</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe2c55]" />
              <span className="text-gray-300">Vào phòng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-gray-300">Kim cương</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <TrendingUp className="w-8 h-8 text-tiktok-magenta/40 mb-2 animate-bounce" />
              <p className="text-xs font-semibold text-gray-300">Chưa có dữ liệu tốc độ tương tác</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                Khi có tương tác từ livestream, tốc độ theo từng chu kỳ 10 giây sẽ được biểu diễn tại đây.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="timeLabel"
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12141f',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 600, marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="commentsPer10s"
                  name="Bình luận / 10s"
                  stroke="#00f2fe"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#00f2fe', strokeWidth: 1 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="joinsPer10s"
                  name="Vào phòng / 10s"
                  stroke="#fe2c55"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#fe2c55', strokeWidth: 1 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="diamondsPer10s"
                  name="Kim cương / 10s"
                  stroke="#ffb800"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#ffb800', strokeWidth: 1 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
