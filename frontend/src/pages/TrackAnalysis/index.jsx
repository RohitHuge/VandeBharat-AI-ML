import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/shared/StatCard';

const TrackAnalysis = () => {
  const inspectionEvents = [
    ['14:02:11', 'Fastener Block A4', <Badge variant="success" dot>Healthy</Badge>, '98.5%'],
    ['14:01:45', 'Rail Joint 22-N', <Badge variant="warning" dot>Review Required</Badge>, '82.1%'],
    ['14:00:30', 'Tie Plate 8B', <Badge variant="success" dot>Healthy</Badge>, '99.1%'],
  ];

  const headers = ['Time', 'Component', 'Status', 'Confidence'];

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="px-margin py-md flex flex-wrap justify-between items-center gap-4 border-b border-outline-variant/20 bg-surface shadow-sm">
        <h1 className="text-display-lg font-display-lg text-on-background">Track Analysis</h1>
        <div className="flex items-center gap-sm">
          {/* Date Range */}
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
            <select className="bg-transparent border-none text-body-compact font-body-compact text-on-surface focus:ring-0 cursor-pointer p-0">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          {/* Track Selector */}
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>route</span>
            <select className="bg-transparent border-none text-body-compact font-body-compact text-on-surface focus:ring-0 cursor-pointer p-0">
              <option>Sector Alpha - N</option>
              <option>Sector Alpha - S</option>
              <option>Sector Beta - E</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Grid Canvas */}
      <div className="p-gutter flex-1 grid grid-cols-12 gap-gutter bg-background">
        {/* LEFT PANEL: Train Telemetry (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-gutter">
          <Card title="Telemetry">
            <div className="p-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-body-compact font-body-compact text-on-surface-variant">Train ID</span>
                <span className="text-mono-data font-mono-data bg-surface-container-low px-2 py-1 rounded text-primary border border-outline-variant/20">TRN-8842</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-compact font-body-compact text-on-surface-variant">Speed</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-headline-md font-headline-md text-on-surface">84.2</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">km/h</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-compact font-body-compact text-on-surface-variant">Direction</span>
                <div className="flex items-center gap-1 text-on-surface">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>north_east</span>
                  <span className="text-body-compact font-body-compact">Northbound</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Sensors">
            <div className="p-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>linked_camera</span>
                  <span className="text-body-compact font-body-compact text-on-surface font-medium">Camera Sync</span>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>radar</span>
                  <span className="text-body-compact font-body-compact text-on-surface font-medium">LiDAR</span>
                </div>
                <Badge variant="success">Nominal</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* MAIN PANEL: Track Visualization (6 cols) */}
        <div className="col-span-12 lg:col-span-6">
          <Card 
            title="Live Schematic" 
            className="h-full group hover:shadow-lg transition-shadow duration-300"
            headerAction={
              <div className="flex gap-2">
                <Button variant="ghost" className="p-1 rounded bg-surface-bright border border-outline-variant/30 hover:bg-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </Button>
                <Button variant="ghost" className="p-1 rounded bg-surface-bright border border-outline-variant/30 hover:bg-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                </Button>
              </div>
            }
          >
            <div className="h-full relative overflow-hidden flex items-center justify-center p-8 bg-surface-bright">
              {/* Decorative Schematic Background */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #0058be 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
              
              {/* Track Line */}
              <div className="relative w-full h-2 bg-outline-variant/30 rounded-full">
                {/* Train Icon */}
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-xl shadow-lg flex items-center justify-center z-20 border border-white/20 animate-pulse">
                  <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>train</span>
                </div>
                
                {/* Heatmap Zones */}
                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[15%] h-6 bg-error/20 rounded-full blur-md"></div>
                <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[10%] h-6 bg-tertiary/20 rounded-full blur-md"></div>
                
                {/* Nodes */}
                <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm z-10 cursor-pointer hover:scale-125 transition-transform" title="Switch 1A"></div>
                <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-primary-container rounded-full border-2 border-white shadow-sm z-10 cursor-pointer hover:scale-125 transition-transform" title="Signal 4B"></div>
                <div className="absolute top-1/2 left-[80%] -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm z-10 cursor-pointer hover:scale-125 transition-transform" title="Switch 2B"></div>
              </div>

              {/* Overlay UI Legend */}
              <div className="absolute bottom-6 left-6 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/30 p-3 rounded-xl flex flex-col gap-2 z-20 shadow-sm">
                <div className="flex items-center gap-2 text-label-caps font-bold"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> CLEAR</div>
                <div className="flex items-center gap-2 text-label-caps font-bold"><span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> INSPECT</div>
                <div className="flex items-center gap-2 text-label-caps font-bold"><span className="w-2.5 h-2.5 rounded-full bg-error"></span> CRITICAL</div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: AI Stats (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-gutter">
          <StatCard 
            label="Components Inspected" 
            value="1,248" 
            icon="analytics" 
            trend="+12% from last sector" 
            trendIcon="trending_up"
          />
          <StatCard 
            label="Anomalies Detected" 
            value="14" 
            icon="warning" 
            trend="-2% vs average" 
            trendIcon="trending_down"
            isCritical={true}
          />
          
          <Card title="AI Performance" className="flex-1">
            <div className="p-md flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-body-compact font-medium text-on-surface-variant">Processing Latency</span>
                  <span className="text-mono-data font-bold text-primary">42ms</span>
                </div>
                {/* Sparkline */}
                <div className="h-12 w-full bg-surface-bright rounded-lg border border-outline-variant/20 flex items-end p-2 gap-1.5">
                  {[30, 50, 40, 70, 90, 45, 60, 35, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/40 h-full rounded-sm relative group overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-500" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-body-compact font-medium text-on-surface-variant">Confidence Score</span>
                  <span className="text-mono-data font-bold text-secondary">94.2%</span>
                </div>
                {/* Progress bar */}
                <div className="h-3 w-full bg-surface-bright rounded-full overflow-hidden border border-outline-variant/20">
                  <div className="h-full bg-secondary w-[94.2%] shadow-[0_0_8px_rgba(0,173,117,0.3)]"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* BOTTOM SECTION: Timeline & Lists (12 cols) */}
        <div className="col-span-12 grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8">
            <Card 
              title="Recent Inspection Events" 
              headerAction={<Button variant="ghost" className="text-primary hover:underline text-label-caps">View All</Button>}
            >
              <DataTable headers={headers} data={inspectionEvents} />
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Card title="Defect Frequency">
              <div className="p-md flex flex-col h-full">
                <div className="flex-1 flex items-end justify-around h-40 gap-3 px-2">
                  {[20, 40, 70, 30, 50, 60, 45].map((h, i) => (
                    <div key={i} className="w-full bg-primary/10 rounded-t-lg relative group h-full">
                      <div 
                        className={`absolute bottom-0 left-0 w-full rounded-t-lg transition-all duration-700 ${h > 60 ? 'bg-tertiary' : 'bg-primary'}`} 
                        style={{ height: `${h}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10">
                          {Math.floor(h/10)} Cases
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-label-caps font-bold text-on-surface-variant mt-4 px-2">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day}>{day}</span>)}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackAnalysis;
