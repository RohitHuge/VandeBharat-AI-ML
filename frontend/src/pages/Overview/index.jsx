import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/shared/StatCard';

const Overview = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-gutter">
      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-sm">
        <StatCard 
          label="Trains Inspected" 
          value="142" 
          icon="train" 
          trend="+12% today" 
          trendIcon="trending_up" 
        />
        <StatCard 
          label="Components" 
          value="84.2k" 
          icon="category" 
          trend="Scanned parts" 
        />
        <StatCard 
          label="Defects Found" 
          value="17" 
          icon="warning" 
          trend="3 Critical" 
          trendIcon="arrow_upward" 
          isCritical 
        />
        <StatCard 
          label="Sys Accuracy" 
          value="99.8%" 
          icon="check_circle" 
          trend="Confidence Avg" 
        />
        {/* <StatCard 
          label="Active Cams" 
          value="32/32" 
          icon="videocam" 
          trend="All online" 
        /> */}
        <StatCard 
          label="Real-time FPS" 
          value="120" 
          icon="speed" 
          trend="Processing Rate" 
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left Column: Live AI Inspection Preview */}
        <div className="lg:col-span-2">
          <Card 
            title="Live AI Inspection Preview" 
            headerAction={
              <>
                <Badge variant="info">CAM-N01</Badge>
                <Badge variant="success">HD Feed</Badge>
              </>
            }
          >
            <div className="relative flex-1 bg-inverse-surface min-h-[400px] overflow-hidden group">
              <img 
                alt="Train wheel inspection" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbxDn65c414TpLrKLQ5T9Fih_mB3FeqVrW7EfNdY6ddT4CyZxAWGb82hXDCJ89lYT8FDxcYdnUGZ8TYKGpAAUJvEJAlU-Hmx_WwyH65YlTwj15aFrKMZF6_miDHOKx_LkfFb-0MUlxBQJ992yNZ4PgTgqdHT9RfLttW5bwpinE3ebyeVT5I4sEUn5Plb97PP63p29sM4LStdoe-P61x_tExmLh6oVL0zTgPPVKZBB1SCaxhPEKb75MBfMgzIlLTIpLTxw9JOkj8Go"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent pointer-events-none"></div>
              
              {/* Bounding Boxes */}
              <div className="absolute top-[30%] left-[20%] w-[180px] h-[180px] border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(0,108,73,0.5)]">
                <div className="absolute -top-6 left-[-2px] bg-secondary text-on-secondary text-mono-data font-medium text-[11px] px-2 py-0.5 whitespace-nowrap">
                  WHEEL_FLANGE [99.2%]
                </div>
              </div>
              <div className="absolute top-[45%] left-[55%] w-[140px] h-[120px] border-2 border-error bg-error/10 shadow-[0_0_15px_rgba(186,26,26,0.5)]">
                <div className="absolute -top-6 left-[-2px] bg-error text-on-error text-mono-data font-medium text-[11px] px-2 py-0.5 whitespace-nowrap">
                  BRAKE_SHOE_WEAR [88.4%]
                </div>
                <div className="absolute -bottom-6 left-0 bg-error/90 text-on-error text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span> Critical
                </div>
              </div>

              {/* Crosshair and HUD */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-[80%] h-[1px] bg-secondary"></div>
                <div className="h-[80%] w-[1px] bg-secondary absolute"></div>
                <div className="w-[300px] h-[300px] border border-secondary rounded-full absolute"></div>
              </div>
              
              <div className="absolute bottom-4 left-4 text-on-secondary font-mono-data text-[12px] space-y-1">
                <div>LAT: 45.4215° N</div>
                <div>LON: 75.6972° W</div>
                <div>SPD: 42 km/h</div>
              </div>
              <div className="absolute bottom-4 right-4 text-on-secondary font-mono-data text-[12px] text-right space-y-1">
                <div>FRAME: 0x48A2</div>
                <div>INFER_TIME: 12ms</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Alerts & Health */}
        <div className="flex flex-col gap-gutter">
          {/* Active Alerts */}
          <Card 
            title="Active Alerts" 
            headerAction={<span className="bg-error/10 text-error text-[12px] font-bold px-2 py-1 rounded-full">3 Critical</span>}
            className="h-[280px]"
          >
            <div className="overflow-y-auto p-2 space-y-2 h-full">
              <div className="bg-surface-container-lowest border border-error/30 p-3 rounded-lg border-l-4 border-l-error">
                <div className="flex justify-between items-start">
                  <span className="text-label-caps font-bold text-error">Brake Shoe Wear</span>
                  <span className="text-[10px] text-on-surface-variant">Just now</span>
                </div>
                <p className="text-body-compact text-on-surface mt-1 text-[13px]">Unit 042 - Axle 4 right side indicates severe wear pattern.</p>
              </div>
              <div className="bg-surface-container-lowest border border-tertiary/30 p-3 rounded-lg border-l-4 border-l-tertiary">
                <div className="flex justify-between items-start">
                  <span className="text-label-caps font-bold text-tertiary">Thermal Anomaly</span>
                  <span className="text-[10px] text-on-surface-variant">2m ago</span>
                </div>
                <p className="text-body-compact text-on-surface mt-1 text-[13px]">Bearing temp +15°C above baseline.</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-lg border-l-4 border-l-secondary">
                <div className="flex justify-between items-start">
                  <span className="text-label-caps font-bold text-secondary">Scan Completed</span>
                  <span className="text-[10px] text-on-surface-variant">15m ago</span>
                </div>
                <p className="text-body-compact text-on-surface mt-1 text-[13px]">Train TR-8822 cleared with minor notes.</p>
              </div>
            </div>
          </Card>

          {/* AI Inference Health */}
          <Card title="AI Inference Health" className="relative overflow-hidden p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest/50 to-transparent pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-on-surface-variant">GPU Processing</span>
                  <span className="font-mono-data font-bold text-on-surface">78%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-on-surface-variant">CPU Utilization</span>
                  <span className="font-mono-data font-bold text-on-surface">42%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <div className="text-[10px] text-on-surface-variant uppercase">Memory</div>
                  <div className="font-mono-data text-[13px] text-on-surface mt-1">12.4 / 16 GB</div>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <div className="text-[10px] text-on-surface-variant uppercase">Temp</div>
                  <div className="font-mono-data text-[13px] text-on-surface mt-1">68°C</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
