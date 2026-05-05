import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

const Dashboard = () => {
  const eventLogHeaders = ['Time', 'Event', 'Conf'];
  const eventLogData = [
    ['14:02:11', <span className="text-error font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">priority_high</span> Structural Crack</span>, '98.4%'],
    ['14:02:08', 'Wheel Scanned', '99.1%'],
    ['14:02:05', 'Axle Scanned', '97.5%'],
    ['14:01:59', 'Bogie Clear', '99.8%'],
  ];

  return (
    <div className="grid grid-cols-12 gap-gutter">
      {/* Left Column (Video & Bottom Panel) */}
      <div className="col-span-8 flex flex-col gap-gutter">
        {/* Main Video Panel */}
        <Card 
          title="Undercarriage Feed - Sector 7G"
          headerAction={
            <>
              <Badge variant="success" dot>60 FPS</Badge>
              <Badge variant="info">42ms Inference</Badge>
            </>
          }
        >
          <div className="relative w-full aspect-video bg-inverse-surface overflow-hidden">
            {/* Simulated Video Feed Image */}
            <img 
              alt="Live Train Undercarriage" 
              className="w-full h-full object-cover opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaDuBU7kgN7Pb1bZbI2xK5lzU9VYOiOzBb0FvYxykPvHw_1DDUN78iSvoYH3hFEiFK5Hk1kCqBAahK7qPHnmhWDv2OPOSD9nvPQvtXhL2dVDptE87HYIEXBHagfJs328rUrdjALkPQcdIFklZHUoh0FA8fFr0IDsJmrpXwjVxf9LNaS4Y0rlbyTeBmHv0kMQAU7ArhEmo9h8h8SPgHGNSgrlZ6epqpCMuDWIMyXM_wk_sd3-KXaPjuvb5bG9SCqVSarowjxZEJxXM"
            />
            {/* AI Overlays */}
            <div className="absolute top-[30%] left-[45%] w-32 h-24 border-2 border-error bg-error/10 rounded-sm shadow-[0_0_15px_rgba(186,26,26,0.4)]">
              <div className="absolute -top-7 left-[-2px] bg-error text-on-error px-2 py-1 text-mono-data text-[10px] rounded-sm whitespace-nowrap flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                CRACK (98.4%) [T-882]
              </div>
            </div>
            <div className="absolute top-[20%] left-[20%] w-48 h-48 border-2 border-primary bg-primary/10 rounded-sm">
              <div className="absolute -top-6 left-[-2px] bg-primary text-on-primary px-2 py-1 text-mono-data text-[10px] rounded-sm whitespace-nowrap">
                WHEEL_ASSEMBLY (99.1%)
              </div>
            </div>
            <div className="absolute top-[60%] left-[65%] w-40 h-16 border-2 border-primary bg-primary/10 rounded-sm">
              <div className="absolute -top-6 left-[-2px] bg-primary text-on-primary px-2 py-1 text-mono-data text-[10px] rounded-sm whitespace-nowrap">
                AXLE_JOINT (97.5%)
              </div>
            </div>
            {/* Scanning Reticle & Animation */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/20 bg-[linear-gradient(rgba(0,88,190,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-[40%] left-0 w-full h-[2px] bg-secondary shadow-[0_0_10px_#6cf8bb] opacity-70"></div>
          </div>
        </Card>

        {/* Bottom Panel: Event History & Timeline */}
        <div className="grid grid-cols-2 gap-gutter">
          <Card title="Event Log">
            <DataTable headers={eventLogHeaders} data={eventLogData} />
          </Card>

          <Card title="Detection Frequency" className="p-4">
            <div className="flex-1 flex items-end gap-2 h-32 border-b border-l border-outline-variant/30 pb-1 pl-1">
              <div className="w-full bg-primary/20 rounded-t-sm h-[20%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[35%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[15%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[60%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[40%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-error/60 rounded-t-sm h-[85%] hover:bg-error transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Spike Detected</div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[30%] hover:bg-primary transition-colors"></div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[45%] hover:bg-primary transition-colors"></div>
            </div>
            <div className="flex justify-between mt-2 text-label-caps font-label-caps text-on-surface-variant">
              <span>-10m</span>
              <span>Now</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Column (Analytics Sidebar) */}
      <div className="col-span-4 flex flex-col gap-gutter">
        {/* Critical Alert */}
        <div className="bg-error-container rounded-xl border border-error/20 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[80px] text-error">warning</span>
          </div>
          <h3 className="text-title-sm font-title-sm text-on-error-container font-bold mb-2 flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined icon-fill">error</span>
            Critical Alert
          </h3>
          <p className="text-body-main font-body-main text-on-error-container mb-4 relative z-10">
            Structural Crack Detected in Sector 7G. Immediate review required.
          </p>
          <Button variant="error" className="w-full relative z-10">
            Review Defect Details
          </Button>
        </div>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary bg-primary-container text-on-primary-container p-2 rounded-lg">speed</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Items Scanned</p>
              <p className="text-display-lg font-display-lg text-on-surface">14.2k</p>
            </div>
          </Card>
          <Card className="p-4 flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary bg-secondary-container text-on-secondary-container p-2 rounded-lg">verified</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Clear Rate</p>
              <p className="text-display-lg font-display-lg text-on-surface">99.8%</p>
            </div>
          </Card>
        </div>

        {/* System Health Card */}
        <Card title="System Health" className="p-5">
          <ul className="flex flex-col gap-3">
            <li className="flex justify-between items-center">
              <span className="text-body-compact font-body-compact text-on-surface-variant">AI Inference</span>
              <span className="text-mono-data font-mono-data text-primary font-medium">42ms</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-body-compact font-body-compact text-on-surface-variant">Camera Feed</span>
              <span className="text-mono-data font-mono-data text-secondary font-medium">60 FPS</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-body-compact font-body-compact text-on-surface-variant">Server Load</span>
              <span className="text-mono-data font-mono-data text-on-surface font-medium">34%</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-body-compact font-body-compact text-on-surface-variant">Data Uplink</span>
              <span className="text-mono-data font-mono-data text-secondary font-medium">Stable</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
