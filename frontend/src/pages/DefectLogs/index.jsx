import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import InputField from '../../components/ui/InputField';

const DefectLogs = () => {
  const [selectedDefect, setSelectedDefect] = useState(null);

  const tableHeaders = ['Defect ID', 'Train #', 'Boggie No.', 'Component', 'Severity', 'Conf.', 'Timestamp', 'Status'];
  const tableData = [
    [
      <span className="font-mono-data text-primary font-medium">DF-8902</span>,
      <span className="text-on-surface-variant">TRN-8422</span>,
      <span className="text-on-surface-variant">B-04</span>,
      <span className="text-on-background font-medium">Brake Pad</span>,
      <Badge variant="error">Critical</Badge>,
      <span className="text-on-surface-variant">98%</span>,
      <span className="text-on-surface-variant text-xs">10:42 AM, Today</span>,
      <span className="text-xs font-medium text-tertiary">Awaiting Review</span>
    ],
    [
      <span className="font-mono-data text-on-surface-variant hover:text-primary transition-colors">DF-8901</span>,
      <span className="text-on-surface-variant">TRN-1109</span>,
      <span className="text-on-surface-variant">B-12</span>,
      <span className="text-on-background font-medium">Wheel Flange</span>,
      <Badge variant="warning">High</Badge>,
      <span className="text-on-surface-variant">85%</span>,
      <span className="text-on-surface-variant text-xs">09:15 AM, Today</span>,
      <span className="text-xs font-medium text-outline">Logged</span>
    ],
    [
      <span className="font-mono-data text-on-surface-variant hover:text-primary transition-colors">DF-8895</span>,
      <span className="text-on-surface-variant">TRN-8422</span>,
      <span className="text-on-surface-variant">B-07</span>,
      <span className="text-on-background font-medium">Door Seal</span>,
      <Badge variant="info">Low</Badge>,
      <span className="text-on-surface-variant">92%</span>,
      <span className="text-on-surface-variant text-xs">Yesterday</span>,
      <span className="text-xs font-medium text-secondary">Resolved</span>
    ]
  ];

  const handleRowClick = (row, index) => {
    setSelectedDefect({
      id: 'DF-8902',
      train: 'TRN-8422',
      bogie: 'B-04',
      type: 'Severe Wear',
      confidence: '98.4%',
      notes: 'Brake pad thickness detected below critical threshold (2.1mm). Uneven wear pattern suggests possible caliper misalignment. Immediate inspection recommended before next dispatch.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw5V4918rYKsTYoHHiMQrlE4FtEZyjC19wvBJSoa_RYH3xPXUKXeGytHVaxPchDNtFHcnUPC2KNDTSFeaR4_7gWIGCcnQRVa4O1C_1Yn5r1sd-dLFHdwwESI7C4RdbNR_B-GkPZpw1V8f7qm0BdXMBhf9lN41jbNpnV7wycyZENTBrOUbnhu15HYW2Y7RxY3ZeZd-wXIhDJQA-kf8Wv_yuRWWGow215kXK2bgC19SCWfR9T0MzeUXbJ_k6HcuypV4wA71IyjySvXQ'
    });
  };

  return (
    <div className="flex flex-col h-full space-y-gutter">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:max-w-md">
          <InputField icon="search" placeholder="Filter by ID, Train, or Component..." />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="bg-surface-container-lowest border border-outline-variant text-on-background px-4 py-2 rounded-md font-title-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Assets</option>
            <option>Vande Bharat Exp</option>
            <option>Rajdhani Exp</option>
          </select>
          <Button variant="secondary" icon="download">Export Report</Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 min-h-0">
        
        {/* Left Column: Filters */}
        <div className="lg:col-span-3 xl:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-md border-b border-outline-variant/20 bg-surface-container-low/50">
            <h3 className="font-title-sm text-title-sm text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-base">filter_list</span>
              Filters
            </h3>
          </div>
          <div className="p-md overflow-y-auto flex-1 space-y-lg">
            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-outline">SEVERITY</h4>
              <div className="space-y-2">
                {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
                  <label key={sev} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={sev === 'Critical' || sev === 'High'} className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" />
                    <span className="font-body-compact text-body-compact text-on-surface group-hover:text-primary transition-colors">{sev}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-outline">COMPONENT</h4>
              <div className="space-y-2">
                {['Wheels', 'Brake Pads', 'Axles', 'Doors', 'Bogies'].map((comp) => (
                  <label key={comp} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={comp === 'Brake Pads'} className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" />
                    <span className="font-body-compact text-body-compact text-on-surface group-hover:text-primary transition-colors">{comp}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-outline">DATE RANGE</h4>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">calendar_today</span>
                <input className="pl-9 pr-3 py-2 w-full bg-surface border border-outline-variant rounded-md text-body-compact text-on-surface cursor-pointer hover:border-primary focus:outline-none" readOnly type="text" value="Last 7 Days" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Table + Detail */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col gap-gutter min-h-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <DataTable 
                headers={tableHeaders} 
                data={tableData} 
                className="cursor-pointer"
                onRowClick={handleRowClick}
              />
            </div>
            <div className="p-sm border-t border-outline-variant/20 bg-surface-container-low/30 flex justify-between items-center text-body-compact text-outline">
              <span>Showing 1-15 of 243</span>
              <div className="flex gap-1">
                <Button variant="ghost" icon="chevron_left" disabled className="p-1" />
                <Button variant="ghost" icon="chevron_right" className="p-1" />
              </div>
            </div>
          </Card>

          {/* Defect Detail Panel (Conditional) */}
          {selectedDefect && (
            <Card className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
                <div className="flex items-center gap-4">
                  <h3 className="font-title-sm text-title-sm text-on-background">Defect Detail - {selectedDefect.id}</h3>
                  <Badge variant="error">Critical</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" icon="close" title="Clear Selection" className="p-1.5" onClick={() => setSelectedDefect(null)} />
                  <Button variant="ghost" icon="download" title="Download Image" className="p-1.5" />
                  <Button variant="ghost" icon="open_in_full" title="Expand View" className="p-1.5" />
                </div>
              </div>
              
              <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Image Area */}
                <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 bg-black aspect-video">
                  <img alt="Inspection Zoom" className="w-full h-full object-cover opacity-90" src={selectedDefect.image} />
                  <div className="absolute top-1/4 left-1/3 w-1/4 h-1/3 border-2 border-error bg-error/10"></div>
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white font-mono-data text-[10px] px-2 py-1 rounded">
                    Cam-04 • Frame 8422
                  </div>
                </div>

                <div className="flex flex-col gap-md">
                  <div className="grid grid-cols-2 gap-sm">
                    <div className="bg-surface p-sm rounded border border-outline-variant/20">
                      <span className="block font-label-caps text-label-caps text-outline mb-1">DEFECT TYPE</span>
                      <span className="font-body-compact text-on-background font-medium">{selectedDefect.type}</span>
                    </div>
                    <div className="bg-surface p-sm rounded border border-outline-variant/20">
                      <span className="block font-label-caps text-label-caps text-outline mb-1">CONFIDENCE</span>
                      <span className="font-body-compact text-primary font-bold">{selectedDefect.confidence}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-label-caps text-label-caps text-outline">AI NOTES</h4>
                    <p className="font-body-compact text-on-surface-variant bg-surface p-sm rounded border border-outline-variant/20">
                      {selectedDefect.notes}
                    </p>
                  </div>

                  <div className="flex gap-sm mt-auto">
                    <Button className="flex-1">Create Work Order</Button>
                    <Button variant="secondary" className="flex-1">Dismiss</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Analytics Sidebar */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-gutter overflow-y-auto">
          <Card title="Defect Trends (30 Days)" className="p-md">
            <div className="h-32 bg-gradient-to-r from-surface-variant/50 to-surface-container-low rounded flex items-end p-2 gap-1 border-b border-l border-outline-variant/30">
              {[25, 50, 33, 75, 100, 60, 45, 80, 95, 30].map((h, i) => (
                <div key={i} className={`w-full ${h === 100 ? 'bg-error/50' : 'bg-primary/30'} rounded-t transition-all hover:bg-primary/50`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-outline font-label-caps">
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </Card>
          
          <Card title="Severity Distribution" className="p-md">
            <div className="flex items-center gap-6 h-32">
              <div className="w-24 h-24 rounded-full border-[10px] border-surface-variant border-t-error border-r-tertiary-fixed transform rotate-45"></div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-body-compact"><span className="text-error font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> Critical</span><span>15%</span></div>
                <div className="flex justify-between text-xs font-body-compact"><span className="text-tertiary font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> High</span><span>30%</span></div>
                <div className="flex justify-between text-xs font-body-compact"><span className="text-outline font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-outline"></span> Other</span><span>55%</span></div>
              </div>
            </div>
          </Card>

          <Card title="Top Affected Components" className="p-md">
            <div className="space-y-4">
              {[
                { name: 'Wheels', count: 142, pct: 80, color: 'bg-primary' },
                { name: 'Brake Pads', count: 98, pct: 60, color: 'bg-primary/70' },
                { name: 'Doors', count: 45, pct: 30, color: 'bg-primary/40' }
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-body-compact mb-1.5">
                    <span className="font-medium text-on-surface">{item.name}</span>
                    <span className="font-mono-data text-outline">{item.count} detections</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DefectLogs;
