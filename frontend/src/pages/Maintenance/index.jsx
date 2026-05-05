import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

const Maintenance = () => {
  const historyHeaders = ['Timestamp', 'Activity / Asset', 'Train ID', 'Status', ''];
  const historyData = [
    [
      '2023-10-24 09:15',
      <div>
        <p className="font-medium text-on-background">Hydraulic fluid flush and filter replacement</p>
        <p className="text-sm text-outline mt-1">Carriage Undercarriage Assembly</p>
      </div>,
      'TRN-902',
      <Badge variant="success" dot>Completed</Badge>,
      <Button variant="ghost" icon="open_in_new" className="p-1 opacity-0 group-hover:opacity-100" />
    ],
    [
      '2023-10-23 14:30',
      <div>
        <p className="font-medium text-on-background">Sensor recalibration (Acoustic Array 4)</p>
        <p className="text-sm text-outline mt-1">Diagnostic Bay C</p>
      </div>,
      'SYS-NET',
      <Badge variant="success" dot>Completed</Badge>,
      <Button variant="ghost" icon="open_in_new" className="p-1 opacity-0 group-hover:opacity-100" />
    ],
    [
      '2023-10-22 18:45',
      <div>
        <p className="font-medium text-on-background">Emergency track weld inspection</p>
        <p className="text-sm text-outline mt-1">Milepost 442.8</p>
      </div>,
      'N/A',
      <Badge variant="info" dot>Pending Review</Badge>,
      <Button variant="ghost" icon="open_in_new" className="p-1 opacity-0 group-hover:opacity-100" />
    ]
  ];

  return (
    <div className="flex flex-col gap-gutter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-sm">
        <div>
          <h2 className="text-display-lg font-display-lg font-bold text-on-background tracking-tight">Maintenance Management</h2>
          <p className="text-body-main font-body-main text-on-surface-variant mt-xs">Schedule, track, and analyze predictive maintenance tasks.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" icon="calendar_today">This Week</Button>
          <Button variant="secondary" icon="group">All Teams</Button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Panel: Upcoming Maintenance */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <Card 
            title="Upcoming Maintenance" 
            headerAction={<Button variant="ghost" icon="more_horiz" className="p-1" />}
            className="relative h-full"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
            <div className="p-xs space-y-1">
              {/* Item 1 */}
              <div className="p-sm m-xs rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20 cursor-pointer group">
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">directions_railway</span>
                    </div>
                    <div>
                      <p className="text-body-compact font-semibold text-on-background">TRN-8422 Brake System</p>
                      <p className="text-mono-data text-outline mt-[2px]">Locomotive 4B</p>
                    </div>
                  </div>
                  <Badge variant="error">High Priority</Badge>
                </div>
                <div className="flex justify-between items-center mt-md pt-sm border-t border-outline-variant/10">
                  <div className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-label-caps text-on-surface-variant">Scheduled • Today 14:00</span>
                  </div>
                  <div className="flex -space-x-2">
                    <img alt="Engineer" className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6TlRv99bMyDkg07d_zY81Fg8S_CtDwf0BVfwipSiB5E6IigEFpNrkrYA-9WE0-bG40UElKgW4T9ltwXn4QCSSvQN_80soY-_UhptrXW9zAa_F6WFlwFYh7iIob2CaTZ9BaZS7ACPtPsxsqJrJNUJtA8KQrHU1lnqsW326Dkxn4Ta0dHLVQus4NzXzwSGlx5xuZo6fIYzafRS4nQRKQqjvl4okbicqu53blcVNSCAAvtLjtoKelJ48ubBgkBV-hN1hbBjzW2YDTy0" />
                    <img alt="Engineer" className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbiGgV4QznIABM5LNOU72q1eE-WrpDjHyFjkwlzhu61qX-44orJSVWMyTClyDXqTTHtY6fWF-Jbr5HJ1yZQm1stTOpld-8hLu5pr06Y8MlsKOthL7T4CsALjlAxx8kVisvsE0iQqC0WThi704cYH6y4mfwMME70YDFgQQMxwvHiVgb6wiQXSXTECzrWQmJ9e-yajfVOBJuHF3TntTeU4TDLikippfFw5CV4sB2I34L2DZuQ0vZUvrxzh7N4UlnL_RbfR5HeXPe2V0" />
                  </div>
                </div>
              </div>
              {/* Item 2 */}
              <div className="p-sm m-xs rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20 cursor-pointer">
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">build</span>
                    </div>
                    <div>
                      <p className="text-body-compact font-semibold text-on-background">Track Switch Alignment</p>
                      <p className="text-mono-data text-outline mt-[2px]">Sector 7-G</p>
                    </div>
                  </div>
                  <Badge variant="info">Medium</Badge>
                </div>
                <div className="flex justify-between items-center mt-md pt-sm border-t border-outline-variant/10">
                  <div className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-label-caps text-on-surface-variant">In Progress</span>
                  </div>
                  <div className="flex -space-x-2">
                    <img alt="Engineer" className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrzlh_BxH5C6SspCoA-Wx8Qr1r2qZ-cy6reeeHohliz2hHUJ6kFCesFiXkTrHR2Q9vesVK0KiZYd6Sn6IHqb1zSDMlit-8fiuY8yI4ytX93yd4azyCwuoSJNvJaITNfGmH9HP38kaYudxeLhJo2VDbI1rp7NPlNDKeuYpVzXsnetMY2Zmx73io4asStRUE9wAsnySTlJgVwQToppJo3IWA5g7-tQFKU8tl6oCqWVsFLbkfemXw8jOU3hDWqtzrvcFe5VHc6Sq3gpQ" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Panel: AI Recommendations */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <Card 
            title={
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                AI Recommendations
              </div>
            }
            headerAction={<Badge variant="info">2 Alerts</Badge>}
            className="h-full relative"
          >
            {/* Glass highlight effect */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/40 mix-blend-overlay"></div>
            <div className="p-md space-y-md">
              {/* Rec 1 */}
              <div className="p-md rounded-xl bg-surface border border-outline-variant/20 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-sm">
                  <h4 className="text-body-compact font-semibold text-on-background">Brake Pad Replacement (TRN-8422)</h4>
                  <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                </div>
                <p className="text-body-compact text-on-surface-variant text-sm mb-md">Acoustic sensors detect abnormal wear patterns on axles 3 & 4. Predicted failure in 14 days.</p>
                <div className="mb-md">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-label-caps text-outline">Severity Analysis</span>
                    <span className="text-mono-data text-error font-bold">88%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">Schedule Repair</Button>
              </div>
              {/* Rec 2 */}
              <div className="p-md rounded-xl bg-surface border border-outline-variant/20 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-sm">
                  <h4 className="text-body-compact font-semibold text-on-background">Axle Lubrication (TRN-1109)</h4>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">info</span>
                </div>
                <p className="text-body-compact text-on-surface-variant text-sm mb-md">Thermal imaging indicates slight temperature increase above baseline during high-speed transit.</p>
                <div className="mb-md">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-label-caps text-outline">Severity Analysis</span>
                    <span className="text-mono-data text-tertiary font-bold">45%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">Schedule Maintenance</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel: Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Confidence Card */}
          <Card className="p-md relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-sm mb-sm text-secondary">
              <span className="material-symbols-outlined">psychology</span>
              <h3 className="text-title-sm text-on-background">AI Prediction Confidence</h3>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="text-display-lg font-display-lg font-bold text-secondary">96%</span>
              <span className="text-label-caps text-outline">Across network</span>
            </div>
          </Card>

          {/* Lifecycle Analytics */}
          <Card title="Lifecycle Analytics" className="p-md flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-sm mb-lg">
              <div className="p-sm bg-surface rounded-lg border border-outline-variant/10">
                <p className="text-label-caps text-outline mb-xs">Completion Rate</p>
                <p className="text-headline-md font-bold text-on-background">92.4%</p>
                <p className="text-[11px] text-secondary flex items-center mt-1"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 2.1%</p>
              </div>
              <div className="p-sm bg-surface rounded-lg border border-outline-variant/10">
                <p className="text-label-caps text-outline mb-xs">Downtime Impact</p>
                <p className="text-headline-md font-bold text-on-background">1.2 hrs<span className="text-sm font-normal text-outline">/wk</span></p>
                <p className="text-[11px] text-secondary flex items-center mt-1"><span className="material-symbols-outlined text-[14px]">arrow_downward</span> 0.5h</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-label-caps text-outline mb-sm">Tasks by Type (This Month)</p>
              <div className="flex items-end gap-2 h-32 w-full border-b border-outline-variant/20 pb-2">
                {[40, 65, 90, 50, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-colors relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-primary text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {['Mech', 'Track', 'Signal', 'Elec', 'Other'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: History Logs */}
      <Card title="Repair History Logs" headerAction={<Button variant="ghost" icon="filter_list" className="p-1" />}>
        <DataTable headers={historyHeaders} data={historyData} className="group" />
      </Card>
    </div>
  );
};

export default Maintenance;
