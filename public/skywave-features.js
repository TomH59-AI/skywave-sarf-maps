/**
 * SkyWave SARF Tower Siting Maps - Feature Engine
 * Supabase-connected features: Lead Sync, Broadband & Fiber, Zoning Ordinances, Mailer Tool
 * Measure Tool, Site Capture, Street View, NWI Wetlands
 * NEW: SARF Ring Toggle, Target A/B/C/D/E Picker, Zoning Popup, Mailer Letters
 */
(function() {
'use strict';

var SUPABASE_URL = 'https://skpxeouvikzgsaurkohf.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcHhlb3V2aWt6Z3NhdXJrb2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODM5NjMsImV4cCI6MjA4NjU1OTk2M30.wEWgn8uB4k0KhW5EUjlDUnUAOV1TBrKSmpqB8DLbsyk';
var MAPILLARY_CLIENT_ID = '2129296374580243';

function supabaseRequest(path, opts) {
  opts = opts || {};
  var headers = {'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Content-Type':'application/json'};
  if (opts.headers) { for (var k in opts.headers) headers[k] = opts.headers[k]; }
  return fetch(SUPABASE_URL+'/rest/v1/'+path, {method:opts.method||'GET',headers:headers,body:opts.body?JSON.stringify(opts.body):undefined});
}

function injectCSS() {
  var style = document.createElement('style');
  style.textContent = '#measure-tool{position:fixed;top:10px;right:60px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #ffcc00;background:rgba(0,0,0,.85);color:#ffcc00;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center} #measure-tool:hover,#measure-tool.active{background:#ffcc00;color:#000} #measure-clear{position:fixed;top:50px;right:60px;z-index:200;font-size:10px;color:#ffcc00;cursor:pointer;text-decoration:underline;display:none;background:rgba(0,0,0,.7);padding:2px 6px;border-radius:3px} #measure-result{position:fixed;top:10px;right:102px;z-index:200;background:rgba(0,0,0,.88);color:#ffcc00;padding:5px 10px;border-radius:4px;font-size:12px;font-weight:600;display:none} #site-capture{position:fixed;top:10px;right:24px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #00ff88;background:rgba(0,0,0,.85);color:#00ff88;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center} #site-capture:hover{background:#00ff88;color:#000} #street-view-btn{position:fixed;top:10px;right:140px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #4fc3f7;background:rgba(0,0,0,.85);color:#4fc3f7;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center} #street-view-btn:hover{background:#4fc3f7;color:#000} #street-view-panel{position:fixed;top:60px;right:10px;width:400px;height:300px;z-index:300;background:#111;border:2px solid #4fc3f7;border-radius:8px;display:none;overflow:hidden} #street-view-panel .sv-header{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:#222;color:#4fc3f7;font-size:11px} #street-view-panel .sv-close{cursor:pointer;font-size:16px;color:#f44} #street-view-panel iframe{width:100%;height:calc(100% - 28px);border:none} .lead-section{background:#0d2818;border:1px solid #1b5e20;border-radius:6px;padding:8px;margin-top:4px} .lead-section h2{color:#66bb6a;font-size:11px;margin:0 0 6px} .lead-tag{background:#1b5e20;color:#a5d6a7;padding:2px 6px;border-radius:3px;font-size:10px;display:inline-block;margin-bottom:6px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .lead-section label{font-size:10px;color:#81c784;display:block;margin:4px 0 1px} .lead-section input,.lead-section select{width:100%;padding:4px 6px;border-radius:4px;border:1px solid #2e7d32;background:#0a1f0f;color:#c8e6c9;font-size:11px;box-sizing:border-box} .lead-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#2e7d32;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:6px} .lead-section button:hover{background:#388e3c} .lead-status{font-size:10px;color:#81c784;margin-top:4px;min-height:14px} .fiber-section{background:#1a1200;border:1px solid #e65100;border-radius:6px;padding:8px;margin-top:4px} .fiber-section h2{color:#ff9800;font-size:11px;margin:0 0 6px} .fiber-status{font-size:10px;color:#ffb74d;margin-top:4px;min-height:14px} .fiber-popup{font-family:system-ui,sans-serif;min-width:240px} .fiber-popup h3{margin:0 0 6px;color:#e65100;font-size:13px;border-bottom:2px solid #ff9800;padding-bottom:4px} .fiber-popup .fp-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid #eee;font-size:11px} .fiber-popup .fp-name{font-weight:600;color:#333} .fiber-popup .fp-tech{background:#fff3e0;color:#e65100;padding:1px 5px;border-radius:3px;font-size:9px} .fiber-popup .fp-speed{color:#2e7d32;font-weight:600;font-size:10px} .zoning-section{background:#1a0020;border:1px solid #7b1fa2;border-radius:6px;padding:8px;margin-top:4px} .zoning-section h2{color:#ce93d8;font-size:11px;margin:0 0 6px} .zoning-section select{width:100%;padding:4px 6px;border-radius:4px;border:1px solid #7b1fa2;background:#12001a;color:#e1bee7;font-size:11px;box-sizing:border-box} .zoning-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#7b1fa2;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:6px} .zoning-section button:hover{background:#9c27b0} .zoning-status{font-size:10px;color:#ce93d8;margin-top:4px;min-height:14px} #zoning-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:500;justify-content:center;align-items:center} #zoning-overlay.open{display:flex} #zoning-modal{background:#fff;color:#222;width:90%;max-width:800px;max-height:85vh;border-radius:10px;overflow:hidden;display:flex;flex-direction:column} .zm-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#7b1fa2;color:#fff} .zm-header h2{margin:0;font-size:16px} .zm-close{font-size:22px;cursor:pointer;color:#fff;background:none;border:none;line-height:1} .zm-toolbar{display:flex;gap:8px;padding:8px 16px;background:#f3e5f5;border-bottom:1px solid #ce93d8} .zm-toolbar button{padding:5px 12px;border-radius:4px;border:1px solid #7b1fa2;background:#fff;color:#7b1fa2;font-size:11px;cursor:pointer;font-weight:600} .zm-toolbar button:hover{background:#7b1fa2;color:#fff} .zm-body{padding:16px;overflow-y:auto;flex:1} .zm-body h3{color:#7b1fa2;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #ce93d8;padding-bottom:4px} .zm-body .zr-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12px} .zm-body .zr-label{font-weight:600;color:#555;min-width:160px} .zm-body .zr-value{color:#222;text-align:right;flex:1} .zm-body .zr-yes{color:#2e7d32;font-weight:600} .zm-body .zr-no{color:#c62828} .zm-body .municode-section{background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:10px;margin:8px 0} .zm-body .municode-section h4{margin:0 0 4px;color:#4a148c;font-size:12px} .zm-body .municode-section pre{font-size:11px;white-space:pre-wrap;color:#333;margin:0;line-height:1.4} .zm-footer{padding:8px 16px;background:#f5f5f5;border-top:1px solid #ddd;font-size:10px;color:#888;text-align:center} .mailer-section{background:#1a0a00;border:1px solid #bf360c;border-radius:6px;padding:8px;margin-top:4px} .mailer-section h2{color:#ff8a65;font-size:11px;margin:0 0 6px} .mailer-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#bf360c;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:4px} .mailer-section button:hover{background:#e64a19} #mailer-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:500;justify-content:center;align-items:center} #mailer-overlay.open{display:flex} #mailer-modal{background:#fff;color:#222;width:92%;max-width:960px;max-height:90vh;border-radius:10px;overflow:hidden;display:flex;flex-direction:column} .mm-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#bf360c;color:#fff} .mm-header h2{margin:0;font-size:16px} .mm-close{font-size:22px;cursor:pointer;color:#fff;background:none;border:none;line-height:1} .mm-tabs{display:flex;background:#fbe9e7;border-bottom:2px solid #ff8a65} .mm-tab{padding:8px 16px;font-size:11px;font-weight:600;color:#bf360c;cursor:pointer;border-bottom:3px solid transparent} .mm-tab.active{border-bottom:3px solid #bf360c;background:#fff} .mm-tab-content{display:none;flex-direction:column;flex:1;overflow:hidden} .mm-tab-content.active{display:flex} .mm-toolbar{display:flex;gap:8px;padding:8px 16px;background:#fbe9e7;border-bottom:1px solid #ff8a65;flex-wrap:wrap;align-items:center} .mm-toolbar button{padding:5px 12px;border-radius:4px;border:1px solid #bf360c;background:#fff;color:#bf360c;font-size:11px;cursor:pointer;font-weight:600} .mm-toolbar button:hover{background:#bf360c;color:#fff} .mm-toolbar input{padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:11px;width:160px} .mm-body{overflow-y:auto;flex:1;padding:0} .mm-body table{width:100%;border-collapse:collapse;font-size:11px} .mm-body th{background:#fbe9e7;color:#bf360c;padding:8px 6px;text-align:left;border-bottom:2px solid #ff8a65;position:sticky;top:0} .mm-body td{padding:6px;border-bottom:1px solid #f0f0f0} .mm-body tr:hover{background:#fff8f6} .mm-footer{padding:8px 16px;background:#f5f5f5;border-top:1px solid #ddd;font-size:10px;color:#888;text-align:center} #mm-letter-view{padding:20px 40px;overflow-y:auto;flex:1;background:#f9f9f9;font-family:Times New Roman,serif} #mm-letter-view .letter-nav{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-family:system-ui;font-size:11px} #mm-letter-view .letter-nav button{padding:5px 12px;border-radius:4px;border:1px solid #bf360c;background:#fff;color:#bf360c;cursor:pointer;font-weight:600} .letter-body{background:#fff;padding:40px 50px;max-width:720px;margin:0 auto;border:1px solid #ddd;box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:13px;line-height:1.6;color:#222} .letter-body .letterhead{text-align:center;border-bottom:3px solid #bf360c;padding-bottom:12px;margin-bottom:24px} .letter-body .letterhead h2{margin:0;font-size:20px;color:#bf360c;letter-spacing:.04em} .letter-body .letterhead p{margin:2px 0;font-size:11px;color:#666} .letter-body p{margin-bottom:12px} .letter-body .signature{margin-top:32px} .letter-body .signature .sig-name{font-weight:bold;margin-top:24px} .targets-section{background:#120808;border:1px solid #8b0000;border-radius:6px;padding:8px;margin-top:4px} .targets-section h2{color:#ff6b6b;font-size:11px;margin:0 0 6px} .target-row{display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid #1a0808;font-size:10px} .target-badge{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0;color:#fff} .target-badge.A{background:#e53935} .target-badge.B{background:#1976d2} .target-badge.C{background:#388e3c} .target-badge.D{background:#f57c00} .target-badge.E{background:#7b1fa2} .target-badge.pick{background:#555;cursor:pointer} .target-badge.pick:hover{background:#777} .target-info{flex:1;overflow:hidden} .target-info .ti-id{color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .target-info .ti-own{color:#eee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600} .target-info .ti-acres{color:#ff6b6b;font-size:9px} .target-picking{font-size:10px;color:#f57c00;padding:4px 0;font-style:italic} .zq-popup{font-family:system-ui,sans-serif;min-width:220px;max-width:280px} .zq-popup .zq-title{font-weight:700;font-size:13px;color:#7b1fa2;margin-bottom:6px;border-bottom:2px solid #ce93d8;padding-bottom:4px} .zq-popup .zq-row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid #f5f5f5} .zq-popup .zq-label{color:#888;font-weight:600} .zq-popup .zq-val{color:#222;text-align:right} .zq-popup .zq-btn{margin-top:8px;padding:4px 10px;border-radius:4px;border:1px solid #7b1fa2;background:#7b1fa2;color:#fff;font-size:10px;cursor:pointer;font-weight:600;width:100%} @media print{body *{visibility:hidden} #zoning-overlay,#zoning-overlay *,#mailer-overlay,#mailer-overlay *{visibility:visible} #zoning-overlay,#mailer-overlay{position:absolute;top:0;left:0;width:100%;background:#fff} #zoning-modal,#mailer-modal{max-height:none;width:100%;max-width:100%} .zm-toolbar,.mm-toolbar,.mm-tabs,.zm-close,.mm-close,.letter-nav{display:none!important} .mm-tab-content{display:block!important} .letter-body{box-shadow:none;border:none}}';
  document.head.appendChild(style);
}

function injectToolbarButtons() {
  var mb=document.createElement('button');mb.id='measure-tool';mb.textContent='📏';mb.title='Measure Tool';document.body.appendChild(mb);
  var mc=document.createElement('div');mc.id='measure-clear';mc.textContent='Clear Measurement';document.body.appendChild(mc);
  var mr=document.createElement('div');mr.id='measure-result';document.body.appendChild(mr);
  var sc=document.createElement('button');sc.id='site-capture';sc.textContent='📷';sc.title='Site Capture';document.body.appendChild(sc);
  var sv=document.createElement('button');sv.id='street-view-btn';sv.textContent='👁';sv.title='Street View';document.body.appendChild(sv);
  var svp=document.createElement('div');svp.id='street-view-panel';
  svp.innerHTML='<div class="sv-header"><span>Mapillary Street View</span><span class="sv-close">&times;</span></div><iframe id="sv-iframe"></iframe>';
  document.body.appendChild(svp);
}

function injectSidebarSections() {
  var sidebar=document.getElementById('sidebar');
  if(!sidebar) return;
  // Add SARF Ring toggle to Base Layers block
  var lgBlocks=sidebar.querySelectorAll('.lg');
  lgBlocks.forEach(function(b){
    var h=b.querySelector('h2');
    if(h&&h.textContent.trim().toLowerCase().indexOf('base')!==-1){
      var d=document.createElement('div');d.className='lt';
      d.innerHTML='<span>SARF Ring</span><input id="sarf-ring-toggle" type="checkbox" checked>';
      b.appendChild(d);
    }
  });
  // Add Targets panel after .si block
  var siBlock=sidebar.querySelector('.si');
  if(siBlock){
    siBlock.insertAdjacentHTML('afterend','<div class="targets-section" id="targets-section"><h2>🎯 SITE TARGETS</h2><div id="targets-list"><div style="font-size:10px;color:#888;">Set a SARF site to auto-pick targets</div></div><div id="target-picking-hint" class="target-picking" style="display:none">👉 Click a parcel on map to assign</div></div>');
  }
  sidebar.insertAdjacentHTML('beforeend',
    '<div class="lead-section" id="lead-sync-section"><h2>💾 LEAD SYNC</h2><div class="lead-tag" id="lead-parcel-tag">Click a parcel to select</div><label>Verified Phone</label><input id="lead-phone" type="text" placeholder="(352) 555-0000"><label>Verified Email</label><input id="lead-email" type="text" placeholder="owner@domain.com"><label>Viability Score</label><select id="lead-viability"><option value="HIGH">HIGH</option><option value="MEDIUM">MEDIUM</option><option value="LOW">LOW</option></select><button id="lead-save">Save Lead to Supabase</button><div class="lead-status" id="lead-status"></div></div>'+
    '<div class="fiber-section" id="fiber-section"><h2>🔌 BROADBAND &amp; FIBER</h2><div class="lt"><span>Show Fiber Locations</span><input id="fiber-toggle" type="checkbox"></div><div class="fiber-status" id="fiber-status"></div></div>'+
    '<div class="zoning-section" id="zoning-section"><h2>🏛 ZONING ORDINANCES</h2><select id="zoning-jurisdiction"><option value="">Select Jurisdiction...</option></select><button id="zoning-view">View Zoning Report</button><div class="zoning-status" id="zoning-status"></div></div>'+
    '<div class="mailer-section" id="mailer-section"><h2>📬 MAILER TOOL</h2><button id="mailer-open">Open Mailer List</button></div>'
  );
}

function injectModals() {
  var zo=document.createElement('div');zo.id='zoning-overlay';
  zo.innerHTML='<div id="zoning-modal"><div class="zm-header"><h2 id="zm-title">Zoning Ordinance Report</h2><button class="zm-close">&times;</button></div><div class="zm-toolbar"><button id="zm-print">🖨 Print Report</button><button id="zm-municode">Show Full Municode Sections</button></div><div class="zm-body" id="zm-body"></div><div class="zm-footer">Source: Supabase zoning_ordinances &amp; municode_ordinances | SkyWave SARF Maps</div></div>';
  document.body.appendChild(zo);
  var mo=document.createElement('div');mo.id='mailer-overlay';
  mo.innerHTML='<div id="mailer-modal"><div class="mm-header"><h2>📬 Mailer Tool - SARF Site Parcels</h2><button class="mm-close">&times;</button></div><div class="mm-tabs"><div class="mm-tab active" data-tab="list">📋 Parcel List</div><div class="mm-tab" data-tab="letters">📝 Letters</div></div><div class="mm-tab-content active" id="mm-pane-list"><div class="mm-toolbar"><button id="mm-select-all">Select All</button><button id="mm-export-csv">Export CSV</button><button id="mm-gen-letters">📝 Generate Letters</button><button id="mm-print">🖨 Print</button><input id="mm-search" type="text" placeholder="Search parcels..."></div><div class="mm-body"><table><thead><tr><th><input type="checkbox" id="mm-check-all"></th><th>Target</th><th>Parcel ID</th><th>Owner</th><th>Address</th><th>Zoning</th><th>Acres</th></tr></thead><tbody id="mm-tbody"></tbody></table></div><div class="mm-footer" id="mm-footer">0 parcels selected</div></div><div class="mm-tab-content" id="mm-pane-letters"><div id="mm-letter-view"><div style="padding:40px;text-align:center;color:#888;font-family:system-ui">Select parcels and click Generate Letters</div></div></div></div>';
  document.body.appendChild(mo);
}

function initMeasureTool() {
  var measuring=false,measurePoints=[],measureSourceAdded=false;
  var btn=document.getElementById('measure-tool'),clearLink=document.getElementById('measure-clear'),resultDiv=document.getElementById('measure-result');
  function calcDistance(p1,p2){var R=3958.8,dLat=(p2[1]-p1[1])*Math.PI/180,dLon=(p2[0]-p1[0])*Math.PI/180,a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(p1[1]*Math.PI/180)*Math.cos(p2[1]*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function totalDist(){var d=0;for(var i=1;i<measurePoints.length;i++)d+=calcDistance(measurePoints[i-1],measurePoints[i]);return d;}
  function updateLine(){
    if(!measureSourceAdded){
      map.addSource('measure-line',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
      map.addLayer({id:'measure-line-layer',type:'line',source:'measure-line',paint:{'line-color':'#ffcc00','line-width':3,'line-dasharray':[2,1]}});
      map.addSource('measure-pts',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
      map.addLayer({id:'measure-pts-layer',type:'circle',source:'measure-pts',paint:{'circle-radius':5,'circle-color':'#ffcc00','circle-stroke-color':'#000','circle-stroke-width':2}});
      measureSourceAdded=true;
    }
    var features=[];
    if(measurePoints.length>=2) features.push({type:'Feature',geometry:{type:'LineString',coordinates:measurePoints}});
    map.getSource('measure-line').setData({type:'FeatureCollection',features:features});
    map.getSource('measure-pts').setData({type:'FeatureCollection',features:measurePoints.map(function(p){return{type:'Feature',geometry:{type:'Point',coordinates:p}};})});
  }
  btn.addEventListener('click',function(){measuring=!measuring;btn.classList.toggle('active',measuring);map.getCanvas().style.cursor=measuring?'crosshair':'';if(!measuring&&measurePoints.length>=2){var d=totalDist();resultDiv.textContent=d<1?(d*5280).toFixed(0)+' ft':d.toFixed(2)+' mi';resultDiv.style.display='block';clearLink.style.display='block';}});
  map.on('click',function(e){if(!measuring)return;measurePoints.push([e.lngLat.lng,e.lngLat.lat]);updateLine();if(measurePoints.length>=2){var d=totalDist();resultDiv.textContent=d<1?(d*5280).toFixed(0)+' ft':d.toFixed(2)+' mi';resultDiv.style.display='block';clearLink.style.display='block';}});
  clearLink.addEventListener('click',function(){measurePoints=[];updateLine();resultDiv.style.display='none';clearLink.style.display='none';});
}

function initSiteCapture() {
  document.getElementById('site-capture').addEventListener('click',function(){
    map.once('render',function(){
      var canvas=map.getCanvas(),dataURL=canvas.toDataURL('image/png'),link=document.createElement('a');
      link.download='OnAir_Scout_'+(window._lastParcelId||'SITE')+'.png';link.href=dataURL;link.click();ss('Screenshot saved');
    });
    map.triggerRepaint();
  });
}

function initStreetView() {
  var svBtn=document.getElementById('street-view-btn'),svPanel=document.getElementById('street-view-panel'),svClose=svPanel.querySelector('.sv-close'),svIframe=document.getElementById('sv-iframe'),active=false;
  svBtn.addEventListener('click',function(){active=!active;if(active){map.getCanvas().style.cursor='crosshair';ss('Click map for Street View');}else{map.getCanvas().style.cursor='';svPanel.style.display='none';}});
  svClose.addEventListener('click',function(){svPanel.style.display='none';active=false;map.getCanvas().style.cursor='';});
  map.on('click',function(e){if(!active)return;svIframe.src='https://www.mapillary.com/embed?closeto='+e.lngLat.lng+','+e.lngLat.lat+'&layer=images&zoom=17';svPanel.style.display='block';active=false;map.getCanvas().style.cursor='';ss('Street View loaded');});
}

function initLeadSync() {
  var _lp=null,tag=document.getElementById('lead-parcel-tag'),phoneInput=document.getElementById('lead-phone'),emailInput=document.getElementById('lead-email'),viabilitySelect=document.getElementById('lead-viability'),saveBtn=document.getElementById('lead-save'),statusDiv=document.getElementById('lead-status');
  map.on('click','pf',function(e){if(e.features&&e.features.length>0){var f=e.features[0].properties;_lp=f;window._lastParcelId=f.PARCELID||f.parcel_id||'';tag.textContent=(f.PARCELID||f.parcel_id||'')+' - '+(f.OWNER||f.OWN_NAME||'Unknown');statusDiv.textContent='';}});
  saveBtn.addEventListener('click',function(){
    if(!_lp){statusDiv.textContent='⚠ Select a parcel first';return;}
    var phone=phoneInput.value.trim(),email=emailInput.value.trim();
    if(!phone&&!email){statusDiv.textContent='⚠ Enter phone or email';return;}
    statusDiv.textContent='Saving...';
    var record={parcel_id:_lp.PARCELID||_lp.parcel_id||'UNKNOWN',owner_name:_lp.OWNER||_lp.OWN_NAME||'',site_address:_lp.PHY_ADDR1||_lp.ADDRESS||'',verified_phone:phone||null,verified_email:email||null,viability_score:viabilitySelect.value,is_pro:false};
    supabaseRequest('leads',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=representation'},body:record}).then(function(r){if(r.ok)return r.json().then(function(d){statusDiv.textContent='✅ Saved! Lead '+(d.length&&d[0].created_at?'created':'updated');});else return r.text().then(function(t){statusDiv.textContent='❌ Error: '+t;});}).catch(function(err){statusDiv.textContent='❌ '+err.message;});
  });
}

function initFiber() {
  var toggle=document.getElementById('fiber-toggle'),statusDiv=document.getElementById('fiber-status'),fiberLoaded=false,fiberLayerIds=[];
  toggle.addEventListener('change',function(){if(this.checked&&!fiberLoaded){loadFiber();}else if(fiberLoaded){var v=this.checked?'visible':'none';fiberLayerIds.forEach(function(id){map.setLayoutProperty(id,'visibility',v);});}});
  function loadFiber(){
    statusDiv.textContent='Loading fiber data...';
    Promise.all([supabaseRequest('fiber_availability?select=*').then(function(r){return r.json();}),supabaseRequest('broadband_availability?select=*').then(function(r){return r.json();})]).then(function(results){
      var fiber=results[0]||[],broadband=results[1]||[],all=fiber.concat(broadband),groups={};
      all.forEach(function(r){var lat=r.latitude||r.lat,lng=r.longitude||r.lng||r.lon;if(!lat||!lng)return;var key=parseFloat(lat).toFixed(4)+','+parseFloat(lng).toFixed(4);if(!groups[key])groups[key]={lat:parseFloat(lat),lng:parseFloat(lng),name:r.location_name||r.address||key,providers:[]};groups[key].providers.push(r);});
      var features=Object.values(groups).map(function(g){return{type:'Feature',geometry:{type:'Point',coordinates:[g.lng,g.lat]},properties:{name:g.name,count:g.providers.length,providers:JSON.stringify(g.providers)}};});
      map.addSource('fiber-src',{type:'geojson',data:{type:'FeatureCollection',features:features}});
      map.addLayer({id:'fiber-circles',type:'circle',source:'fiber-src',paint:{'circle-radius':['interpolate',['linear'],['get','count'],1,6,20,14],'circle-color':'#ff9800','circle-stroke-color':'#e65100','circle-stroke-width':2,'circle-opacity':0.85}});
      map.addLayer({id:'fiber-labels',type:'symbol',source:'fiber-src',layout:{'text-field':['get','name'],'text-size':10,'text-offset':[0,1.5]},paint:{'text-color':'#ff9800','text-halo-color':'#000','text-halo-width':1}});
      fiberLayerIds=['fiber-circles','fiber-labels'];fiberLoaded=true;
      map.on('click','fiber-circles',function(e){if(!e.features||!e.features.length)return;var props=e.features[0].properties,providers=JSON.parse(props.providers),html='<div class="fiber-popup"><h3>🔌 '+props.name+'</h3><div style="font-size:10px;color:#888;margin-bottom:6px">'+providers.length+' Providers</div>';providers.forEach(function(p){html+='<div class="fp-row"><span class="fp-name">'+(p.provider_name||p.provider||'Unknown')+'</span>'+(p.technology?'<span class="fp-tech">'+p.technology+'</span>':'')+(p.max_download_speed?'<span class="fp-speed">'+p.max_download_speed+' Mbps</span>':'')+'</div>';});html+='</div>';new mapboxgl.Popup({maxWidth:'360px'}).setLngLat(e.lngLat).setHTML(html).addTo(map);});
      map.on('mouseenter','fiber-circles',function(){map.getCanvas().style.cursor='pointer';});map.on('mouseleave','fiber-circles',function(){map.getCanvas().style.cursor='';});
      statusDiv.textContent='🔌 '+features.length+' locations, '+all.length+' records';
      if(features.length>0){var bounds=new mapboxgl.LngLatBounds();features.forEach(function(f){bounds.extend(f.geometry.coordinates);});map.fitBounds(bounds,{padding:60,maxZoom:12});}
    }).catch(function(err){statusDiv.textContent='❌ '+err.message;});
  }
}

function initZoning() {
  var jSel=document.getElementById('zoning-jurisdiction'),viewBtn=document.getElementById('zoning-view'),statusDiv=document.getElementById('zoning-status'),overlay=document.getElementById('zoning-overlay'),modal=document.getElementById('zoning-modal'),closeBtn=overlay.querySelector('.zm-close'),printBtn=document.getElementById('zm-print'),municodeBtn=document.getElementById('zm-municode'),body=document.getElementById('zm-body'),titleEl=document.getElementById('zm-title'),_ord=[],_curJ='',_zCache={};
  function closeZoning(){overlay.classList.remove('open');overlay.style.display='none';}
  closeBtn.addEventListener('click',function(e){e.stopPropagation();closeZoning();});overlay.addEventListener('click',function(e){if(e.target===overlay)closeZoning();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('open'))closeZoning();});modal.addEventListener('click',function(e){e.stopPropagation();});printBtn.addEventListener('click',function(e){e.stopPropagation();window.print();});
  statusDiv.textContent='Loading jurisdictions...';
  supabaseRequest('zoning_ordinances?select=jurisdiction_name&order=jurisdiction_name').then(function(r){return r.json();}).then(function(data){_ord=Array.isArray(data)?data:[];var seen={};_ord.forEach(function(o){if(!seen[o.jurisdiction_name]){seen[o.jurisdiction_name]=true;var opt=document.createElement('option');opt.value=o.jurisdiction_name;opt.textContent=o.jurisdiction_name;jSel.appendChild(opt);}});statusDiv.textContent=Object.keys(seen).length+' jurisdictions loaded';}).catch(function(err){statusDiv.textContent='❌ '+err.message;});
  function fetchOrd(j,cb){if(_zCache[j]){cb(_zCache[j]);return;}supabaseRequest('zoning_ordinances?jurisdiction_name=eq.'+encodeURIComponent(j)+'&select=*').then(function(r){return r.json();}).then(function(data){if(data&&data.length){_zCache[j]=data[0];cb(data[0]);}else cb(null);}).catch(function(){cb(null);});}
  map.on('click','pf',function(e){
    if(!e.features||!e.features.length)return;
    var f=e.features[0].properties,zoning=f.ZONING||f.ZONE||'',parcelId=f.PARCELID||f.parcel_id||'',owner=f.OWNER||f.OWN_NAME||'Unknown',acres=f.ACRES||'',county=f.COUNTY||f.CNTY||'Orange County';
    var safeId=parcelId.replace(/[^a-z0-9]/gi,'_');
    var html='<div class="zq-popup"><div class="zq-title">📍 '+parcelId+'</div><div class="zq-row"><span class="zq-label">Owner</span><span class="zq-val">'+owner+'</span></div><div class="zq-row"><span class="zq-label">Acres</span><span class="zq-val">'+acres+'</span></div><div class="zq-row"><span class="zq-label">Zoning</span><span class="zq-val">'+zoning+'</span></div><div id="zq-ex-'+safeId+'" style="margin-top:4px;font-size:10px;color:#888">Loading ordinance...</div><button class="zq-btn" onclick="document.getElementById('zoning-jurisdiction').value=''+county+'';document.getElementById('zoning-view').click()">View Full Ordinance</button></div>';
    new mapboxgl.Popup({maxWidth:'300px'}).setLngLat(e.lngLat).setHTML(html).addTo(map);
    fetchOrd(county,function(o){var el=document.getElementById('zq-ex-'+safeId);if(!el)return;if(!o){el.textContent='No ordinance data for '+county;return;}var s='';if(o.max_tower_height_ft)s+='Height: '+o.max_tower_height_ft+'ft  ';if(o.setback_requirement)s+='• Setback: '+o.setback_requirement+'  ';if(o.permit_type)s+='• Permit: '+o.permit_type;el.innerHTML=s?'<span style="color:#7b1fa2;font-weight:600">'+s+'</span>':'<span style="color:#888">No ordinance data</span>';});
  });
  viewBtn.addEventListener('click',function(){var j=jSel.value;if(!j){statusDiv.textContent='⚠ Select a jurisdiction';return;}_curJ=j;fetchOrd(j,function(o){if(!o){body.innerHTML='<p>No data found for '+j+'</p>';overlay.style.display='flex';overlay.classList.add('open');return;}titleEl.textContent='🏛 '+j+' - Telecom Zoning Ordinance';var html='<h3>Tower Standards</h3>'+zRow('Max Tower Height',o.max_tower_height_ft?o.max_tower_height_ft+' ft':'Not specified')+zRow('Setback Requirements',o.setback_requirement||'Not specified')+zRow('Fall Zone',o.fall_zone_requirement||'Not specified')+'<h3>Requirements</h3>'+zRow('Collocation Required',zBool(o.collocation_required))+zRow('Stealth Design',zBool(o.stealth_required))+zRow('Landscaping Required',zBool(o.landscaping_required))+'<h3>Permitting</h3>'+zRow('Permit Type',o.permit_type||'Not specified')+zRow('Application Fee',o.application_fee||'Not specified')+zRow('Public Hearing Required',zBool(o.public_hearing_required))+zRow('Balloon Test Required',zBool(o.balloon_test_required))+zRow('Photo Simulation Required',zBool(o.photo_sim_required));if(o.additional_requirements)html+='<h3>Additional Requirements</h3><div style="font-size:12px;line-height:1.5;padding:6px 0">'+(o.additional_requirements||o.notes||'')+'</div>';html+='<h3>Source</h3>'+zRow('Ordinance Reference',o.ldc_section_reference||o.ordinance_source_url||'Municipal Code')+zRow('Last Verified',o.last_verified||'N/A');body.innerHTML=html;overlay.style.display='flex';overlay.classList.add('open');});});
  municodeBtn.addEventListener('click',function(e){e.stopPropagation();if(!_curJ)return;municodeBtn.textContent='Loading...';supabaseRequest('municode_ordinances?jurisdiction_name=eq.'+encodeURIComponent(_curJ)+'&select=*&order=section_number').then(function(r){return r.json();}).then(function(data){if(!data||!data.length)return supabaseRequest('municode_ordinances?jurisdiction_name=ilike.'+encodeURIComponent('%'+_curJ.replace('County','').replace('City of','').trim()+'%')+'&select=*&order=section_number&limit=20').then(function(r2){return r2.json();});return data;}).then(function(data){municodeBtn.textContent='Show Full Municode Sections';if(!data||!data.length){body.insertAdjacentHTML('beforeend','<h3>Municode Sections</h3><p>No sections found</p>');return;}var html='<h3>Municode Sections ('+data.length+')</h3>';data.forEach(function(s){html+='<div class="municode-section"><h4>§ '+(s.section_number||'')+' - '+(s.section_title||s.title||'Untitled')+'</h4><pre>'+(s.section_text||s.content||s.text||'No content')+'</pre></div>';});body.insertAdjacentHTML('beforeend',html);}).catch(function(){municodeBtn.textContent='Show Full Municode Sections';});});
  function zRow(l,v){return '<div class="zr-row"><span class="zr-label">'+l+'</span><span class="zr-value">'+v+'</span></div>';}
  function zBool(v){if(v===true||v==='true'||v==='Yes'||v==='yes')return '<span class="zr-yes">✅ Yes</span>';if(v===false||v==='false'||v==='No'||v==='no')return '<span class="zr-no">❌ No</span>';return v||'Not specified';}
}

function initMailer() {
  var overlay=document.getElementById('mailer-overlay'),modal=document.getElementById('mailer-modal'),closeBtn=overlay.querySelector('.mm-close'),openBtn=document.getElementById('mailer-open'),selectAllBtn=document.getElementById('mm-select-all'),exportBtn=document.getElementById('mm-export-csv'),genLettersBtn=document.getElementById('mm-gen-letters'),printBtn=document.getElementById('mm-print'),searchInput=document.getElementById('mm-search'),checkAll=document.getElementById('mm-check-all'),tbody=document.getElementById('mm-tbody'),footer=document.getElementById('mm-footer'),letterView=document.getElementById('mm-letter-view'),tabs=modal.querySelectorAll('.mm-tab'),panes=modal.querySelectorAll('.mm-tab-content'),_parcels=[],_letters=[],_letterIdx=0;
  tabs.forEach(function(tab){tab.addEventListener('click',function(e){e.stopPropagation();tabs.forEach(function(t){t.classList.remove('active');});panes.forEach(function(p){p.classList.remove('active');});tab.classList.add('active');var pane=document.getElementById('mm-pane-'+tab.dataset.tab);if(pane)pane.classList.add('active');});});
  function closeMailer(){overlay.classList.remove('open');overlay.style.display='none';}
  function openMailer(){loadParcels();overlay.style.display='flex';overlay.classList.add('open');}
  closeBtn.addEventListener('click',function(e){e.stopPropagation();closeMailer();});overlay.addEventListener('click',function(e){if(e.target===overlay)closeMailer();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('open'))closeMailer();});modal.addEventListener('click',function(e){e.stopPropagation();});openBtn.addEventListener('click',openMailer);
  function loadParcels(){
    var src=map.getSource('ps'),features=[];
    if(src&&src._data&&src._data.features)features=src._data.features;else features=map.querySourceFeatures('ps');
    var tMap={};if(window._siteTargets)window._siteTargets.forEach(function(t,i){if(t)tMap[t.id]=['A','B','C','D','E'][i];});
    _parcels=features.map(function(f){var p=f.properties||f,id=p.PARCELID||p.parcel_id||'';return{id:id,owner:p.OWNER||p.OWN_NAME||'',address:p.PHY_ADDR1||p.ADDRESS||'',zoning:p.ZONING||'',acres:p.ACRES||'',target:tMap[id]||''};});
    _parcels.sort(function(a,b){var o=['A','B','C','D','E'],ai=o.indexOf(a.target),bi=o.indexOf(b.target);if(ai!==-1&&bi!==-1)return ai-bi;if(ai!==-1)return -1;if(bi!==-1)return 1;return parseFloat(b.acres||0)-parseFloat(a.acres||0);});
    renderTable(_parcels);
  }
  function renderTable(parcels){
    tbody.innerHTML='';parcels.forEach(function(p,i){var badge=p.target?'<span class="target-badge '+p.target+'">'+p.target+'</span>':'';var tr=document.createElement('tr');tr.innerHTML='<td><input type="checkbox" class="mm-check" data-idx="'+i+'"></td><td>'+badge+'</td><td>'+p.id+'</td><td>'+p.owner+'</td><td>'+p.address+'</td><td>'+p.zoning+'</td><td>'+p.acres+'</td>';tbody.appendChild(tr);});updateFooter();
  }
  function updateFooter(){var checks=tbody.querySelectorAll('.mm-check:checked');footer.textContent=checks.length+' of '+_parcels.length+' parcels selected';}
  selectAllBtn.addEventListener('click',function(e){e.stopPropagation();var checks=tbody.querySelectorAll('.mm-check'),allChecked=Array.from(checks).every(function(c){return c.checked;});checks.forEach(function(c){c.checked=!allChecked;});checkAll.checked=!allChecked;updateFooter();});
  checkAll.addEventListener('change',function(e){e.stopPropagation();tbody.querySelectorAll('.mm-check').forEach(function(c){c.checked=checkAll.checked;});updateFooter();});
  tbody.addEventListener('change',function(e){e.stopPropagation();updateFooter();});
  exportBtn.addEventListener('click',function(e){e.stopPropagation();var checks=tbody.querySelectorAll('.mm-check:checked');if(!checks.length){alert('Select at least one parcel');return;}var csv='Target,Parcel ID,Owner,Address,Zoning,Acres
';checks.forEach(function(c){var idx=parseInt(c.dataset.idx),p=_parcels[idx];if(p)csv+='"'+(p.target||'')+'","'+p.id+'","'+p.owner+'","'+p.address+'","'+p.zoning+'","'+p.acres+'"
';});var blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='SARF_Targets_Mailer.csv';a.click();URL.revokeObjectURL(url);});
  printBtn.addEventListener('click',function(e){e.stopPropagation();window.print();});
  searchInput.addEventListener('input',function(e){e.stopPropagation();var q=this.value.toLowerCase();renderTable(_parcels.filter(function(p){return p.id.toLowerCase().indexOf(q)>=0||p.owner.toLowerCase().indexOf(q)>=0||p.address.toLowerCase().indexOf(q)>=0;}));});
  genLettersBtn.addEventListener('click',function(e){
    e.stopPropagation();var checks=tbody.querySelectorAll('.mm-check:checked');if(!checks.length){alert('Select at least one parcel');return;}
    _letters=[];checks.forEach(function(c){var idx=parseInt(c.dataset.idx);if(_parcels[idx])_letters.push(_parcels[idx]);});_letterIdx=0;renderLetter(0);
    tabs.forEach(function(t){t.classList.remove('active');});panes.forEach(function(p){p.classList.remove('active');});modal.querySelector('[data-tab="letters"]').classList.add('active');document.getElementById('mm-pane-letters').classList.add('active');
  });
  function formatOwnerName(name){if(!name)return 'Property Owner';var n=name.trim().replace(/LLC|INC|CORP|TRUST|BCC|DOT/gi,'').trim();if(!n)return 'Property Owner';if(n===n.toUpperCase())n=n.toLowerCase().replace(/w/g,function(c){return c.toUpperCase();});return n;}
  function renderLetter(idx){
    if(!_letters.length){letterView.innerHTML='<div style="padding:40px;text-align:center;color:#888;font-family:system-ui">No letters generated.</div>';return;}
    idx=Math.max(0,Math.min(idx,_letters.length-1));_letterIdx=idx;
    var p=_letters[idx],today=new Date(),months=['January','February','March','April','May','June','July','August','September','October','November','December'],dateStr=months[today.getMonth()]+' '+today.getDate()+', '+today.getFullYear(),target=p.target?' (Target '+p.target+')':'';
    var html='<div class="letter-nav">';
    if(_letters.length>1){html+='<button onclick="window._mailerPrev()">← Prev</button><span style="color:#555">Letter '+(idx+1)+' of '+_letters.length+'</span><button onclick="window._mailerNext()">Next →</button>';}else{html+='<span></span><span style="color:#555">'+p.owner+'</span><span></span>';}
    html+='<button onclick="window.print()" style="margin-left:8px">🖨 Print</button></div>';
    html+='<div class="letter-body">';
    html+='<div class="letterhead"><h2>SkyWave Telecom Development</h2><p>Tower Site Acquisition Division</p><p>1000 Commerce Park Drive, Suite 400 | Orlando, FL 32837</p><p>(407) 555-0100 | sites@skywavetelecom.com</p></div>';
    html+='<div style="margin-bottom:20px;color:#555;font-size:12px">'+dateStr+'</div>';
    html+='<div style="margin-bottom:20px;font-size:12px;line-height:1.5">'+p.owner+'<br>'+(p.address?p.address+'<br>':'')+'Re: Parcel '+p.id+target+'</div>';
    html+='<div style="font-weight:bold;margin-bottom:16px;font-size:12px">RE: Tower Site Lease Opportunity &mdash; Your Property at '+p.address+'</div>';
    html+='<p>Dear '+formatOwnerName(p.owner)+',</p>';
    html+='<p>My name is [Your Name], and I represent SkyWave Telecom Development, a tower site acquisition company working on behalf of national wireless carriers to identify and secure new cell tower locations in your area.</p>';
    html+='<p>After conducting a detailed radio frequency (RF) engineering analysis of our client's network coverage requirements, we have identified your property &mdash; Parcel ID <strong>'+p.id+'</strong>, located at '+p.address+' and comprising approximately <strong>'+p.acres+' acres</strong> &mdash; as a highly suitable candidate for a wireless communications tower installation.</p>';
    html+='<p>We would like to discuss the possibility of entering into a long-term ground lease agreement for a small portion of your property, typically <strong>2,500 to 5,000 square feet</strong>. In exchange, you would receive:</p>';
    html+='<ul style="margin:8px 0 12px 20px;font-size:13px;line-height:1.8"><li>A competitive annual ground lease payment, typically ranging from <strong>$18,000 to $36,000 per year</strong>, paid monthly in advance</li><li>Automatic <strong>rent escalators</strong> of 2&ndash;3% annually or 15% every five years</li><li>A lease term of <strong>25 to 30 years</strong> providing long-term passive income</li><li>Minimal disruption &mdash; the tower compound typically occupies less than <strong>1% of your total acreage</strong></li><li>All permits, construction costs, and maintenance covered entirely by our team</li></ul>';
    html+='<p>The tower installation process is handled completely by our licensed contractors. Your participation requires only your signature on the lease agreement and a brief site visit by our RF engineers to confirm feasibility.</p>';
    html+='<p>This is a completely voluntary opportunity with no obligation on your part. However, we do have a limited window to secure site agreements before our client finalizes their network buildout plans for this area, so we would greatly appreciate the chance to speak with you at your earliest convenience.</p>';
    html+='<p>Please feel free to contact me directly at <strong>(407) 555-0100</strong> or by email at <strong>sites@skywavetelecom.com</strong>. I am happy to answer any questions and can arrange a meeting at a time and location most convenient for you.</p>';
    html+='<p>Thank you for your time and consideration. We look forward to the possibility of working with you.</p>';
    html+='<div class="signature"><p>Sincerely,</p><div class="sig-name">[Your Name]</div><div style="font-size:12px;color:#555">Site Acquisition Manager<br>SkyWave Telecom Development<br>(407) 555-0100 | sites@skywavetelecom.com</div></div>';
    html+='<div style="margin-top:24px;padding-top:12px;border-top:1px solid #eee;font-size:10px;color:#aaa">Enc: Site Survey Map &bull; Proposed Lease Summary &bull; Company Profile</div>';
    html+='</div>';
    letterView.innerHTML=html;
  }
  window._mailerPrev=function(){renderLetter(_letterIdx-1);};
  window._mailerNext=function(){renderLetter(_letterIdx+1);};
}

function initTargetPicker() {
  window._siteTargets=[null,null,null,null,null];
  var _pickingSlot=-1,_tMarkers=[null,null,null,null,null];
  var TCOLORS={A:'#e53935',B:'#1976d2',C:'#388e3c',D:'#f57c00',E:'#7b1fa2'};
  var TLABELS=['A','B','C','D','E'];
  function haversineM(lat1,lon1,lat2,lon2){var R=6371000,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180,a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function parcelCenter(f){var coords=[];if(f.geometry&&f.geometry.type==='Polygon')coords=f.geometry.coordinates[0]||[];else if(f.geometry&&f.geometry.type==='MultiPolygon')coords=f.geometry.coordinates[0][0]||[];if(!coords.length)return null;var sL=0,sA=0;coords.forEach(function(c){sL+=c[0];sA+=c[1];});return[sL/coords.length,sA/coords.length];}
  function addTargetMarker(lngLat,lbl,color){var el=document.createElement('div');el.style.cssText='width:28px;height:28px;border-radius:50%;background:'+color+';color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)';el.textContent=lbl;var m=new mapboxgl.Marker({element:el}).setLngLat(lngLat).addTo(map);return m;}
  function renderTP(){
    var list=document.getElementById('targets-list');if(!list)return;
    var hint=document.getElementById('target-picking-hint');
    var html='';
    TLABELS.forEach(function(lbl,i){
      var t=window._siteTargets[i],isAuto=i<3;
      html+='<div class="target-row"><div class="target-badge '+lbl+'">'+lbl+'</div>';
      if(t){html+='<div class="target-info"><div class="ti-own">'+t.owner+'</div><div class="ti-id">'+t.id+'</div><div class="ti-acres">'+t.acres+' ac • '+t.zoning+'</div></div>';if(!isAuto)html+='<div style="font-size:16px;cursor:pointer;color:#888;padding:0 4px" onclick="window._clearTarget('+i+')">×</div>';}
      else{html+='<div class="target-info"><div class="ti-id" style="color:#555">'+(isAuto?'Not enough parcels':'—')+'</div></div>';if(!isAuto)html+='<div class="target-badge pick" onclick="window._startTargetPick('+i+')" title="Pick from map">+</div>';}
      html+='</div>';
    });
    list.innerHTML=html;
    if(hint)hint.style.display=(_pickingSlot>=0)?'block':'none';
  }
  window._startTargetPick=function(slot){_pickingSlot=slot;map.getCanvas().style.cursor='crosshair';renderTP();ss('Click a parcel to assign Target '+TLABELS[slot]);};
  window._clearTarget=function(slot){window._siteTargets[slot]=null;if(_tMarkers[slot]){_tMarkers[slot].remove();_tMarkers[slot]=null;}renderTP();};
  map.on('click','pf',function(e){
    if(_pickingSlot<0)return;
    if(!e.features||!e.features.length)return;
    var f=e.features[0],p=f.properties,center=parcelCenter(f)||[e.lngLat.lng,e.lngLat.lat],slot=_pickingSlot;
    _pickingSlot=-1;map.getCanvas().style.cursor='';
    window._siteTargets[slot]={id:p.PARCELID||p.parcel_id||'',owner:p.OWNER||p.OWN_NAME||'',acres:p.ACRES||'',zoning:p.ZONING||'',lngLat:center};
    if(_tMarkers[slot]){_tMarkers[slot].remove();}
    _tMarkers[slot]=addTargetMarker(center,TLABELS[slot],TCOLORS[TLABELS[slot]]);
    renderTP();ss('Target '+TLABELS[slot]+' assigned: '+(p.OWNER||p.PARCELID||''));
  });
  window._autoPickTargets=function(features,sarfLat,sarfLng){
    _tMarkers.forEach(function(m){if(m)m.remove();});_tMarkers=[null,null,null,null,null];
    var scored=[];
    features.forEach(function(f){
      var p=f.properties,acres=parseFloat(p.ACRES||p.acres||0),center=parcelCenter(f);
      if(!center)return;
      var dist=haversineM(sarfLat,sarfLng,center[1],center[0]);
      if(dist>804)return;
      var zoning=(p.ZONING||'').toUpperCase(),score=acres;
      if(/^C-|^I-|^AG|^PUD|^B-|^M-/.test(zoning))score+=100;
      if(/^R-/.test(zoning))score-=50;
      scored.push({id:p.PARCELID||p.parcel_id||'',owner:p.OWNER||p.OWN_NAME||'',acres:p.ACRES||acres,zoning:zoning,lngLat:center,score:score});
    });
    scored.sort(function(a,b){return b.score-a.score;});
    window._siteTargets=[null,null,null,null,null];
    for(var i=0;i<Math.min(3,scored.length);i++){window._siteTargets[i]=scored[i];_tMarkers[i]=addTargetMarker(scored[i].lngLat,TLABELS[i],TCOLORS[TLABELS[i]]);}
    renderTP();
  };
  window._renderTargetsPanel=renderTP;
}

function initTransmission() {
  var cb=document.getElementById('ltx');if(!cb)return;
  var HIFLD_URL='https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Electric_Power_Transmission_Lines/FeatureServer/0/query';
  function loadTxLines(){
    var bounds=map.getBounds(),env=bounds.getWest()+','+bounds.getSouth()+','+bounds.getEast()+','+bounds.getNorth();
    var url=HIFLD_URL+'?where=1%3D1&outFields=OWNER,VOLTAGE,VOLT_CLASS,STATUS,TYPE&geometryType=esriGeometryEnvelope&geometry='+encodeURIComponent(env)+'&inSR=4326&outSR=4326&f=geojson&resultRecordCount=2000';
    document.getElementById('st').textContent='Loading transmission lines...';document.getElementById('st').style.display='block';
    fetch(url).then(function(r){return r.json();}).then(function(data){
      if(!data.features){document.getElementById('st').style.display='none';return;}
      var src=map.getSource('txlines');
      if(src){src.setData(data);}else{map.addSource('txlines',{type:'geojson',data:data});map.addLayer({id:'txlines-line',type:'line',source:'txlines',paint:{'line-color':'#ff00ff','line-width':2,'line-opacity':0.8}});map.on('click','txlines-line',function(e){var p=e.features[0].properties;new mapboxgl.Popup().setLngLat(e.lngLat).setHTML('<div style="font-size:13px"><b>Transmission Line</b><br>Owner: '+(p.OWNER||'N/A')+'<br>Voltage: '+(p.VOLTAGE||'N/A')+' kV<br>Class: '+(p.VOLT_CLASS||'N/A')+'<br>Status: '+(p.STATUS||'N/A')+'</div>').addTo(map);});map.on('mouseenter','txlines-line',function(){map.getCanvas().style.cursor='pointer';});map.on('mouseleave','txlines-line',function(){map.getCanvas().style.cursor='';});}
      document.getElementById('st').textContent=data.features.length+' transmission lines loaded';setTimeout(function(){document.getElementById('st').style.display='none';},2000);
    }).catch(function(err){console.error('HIFLD error:',err);document.getElementById('st').style.display='none';});
  }
  cb.addEventListener('change',function(){if(cb.checked){loadTxLines();map.on('moveend',loadTxLines);cb._txHandler=loadTxLines;}else{if(cb._txHandler)map.off('moveend',cb._txHandler);if(map.getLayer('txlines-line'))map.removeLayer('txlines-line');if(map.getSource('txlines'))map.removeSource('txlines');}});
}

function bootFeatures() {
  injectCSS();injectToolbarButtons();injectSidebarSections();injectModals();
  setTimeout(function() {
    initMeasureTool();initSiteCapture();initStreetView();initLeadSync();initFiber();initZoning();initMailer();initTargetPicker();initTransmission();
    var sarfToggle=document.getElementById('sarf-ring-toggle');
    if(sarfToggle){sarfToggle.addEventListener('change',function(){var v=this.checked?'visible':'none';if(map.getLayer('sf'))map.setLayoutProperty('sf','visibility',v);if(map.getLayer('sl'))map.setLayoutProperty('sl','visibility',v);});}
    var lpCb=document.getElementById('lp');
    if(lpCb){lpCb.addEventListener('change',function(){if(this.checked){setTimeout(function(){var src=map.getSource('ps'),features=[];if(src&&src._data&&src._data.features)features=src._data.features;else features=map.querySourceFeatures('ps');if(features.length&&window._autoPickTargets)window._autoPickTargets(features,window._sarfLat||sLat,window._sarfLng||sLng);},500);}});}
    var goBtn=document.getElementById('go');
    if(goBtn){goBtn.addEventListener('click',function(){setTimeout(function(){var lat=parseFloat(document.getElementById('lat').value),lng=parseFloat(document.getElementById('lng').value);if(isFinite(lat)&&isFinite(lng)){window._sarfLat=lat;window._sarfLng=lng;var src=map.getSource('ps'),features=[];if(src&&src._data&&src._data.features)features=src._data.features;else features=map.querySourceFeatures('ps');if(features.length&&window._autoPickTargets)window._autoPickTargets(features,lat,lng);}},300);});}
    function initStyleSwitch(){
      function switchBaseStyle(styleUrl){
        var style=map.getStyle(),customIds=Object.keys(style.sources).filter(function(id){return id!=='composite'&&id.indexOf('mapbox')!==0;}),savedSources={};
        customIds.forEach(function(id){savedSources[id]=JSON.parse(JSON.stringify(style.sources[id]));});
        var savedLayers=style.layers.filter(function(l){return l.source&&customIds.indexOf(l.source)!==-1;}).map(function(l){return JSON.parse(JSON.stringify(l));});
        map.setStyle(styleUrl);
        map.once('style.load',function(){
          for(var id in savedSources){try{if(!map.getSource(id))map.addSource(id,savedSources[id]);}catch(e){}}
          savedLayers.forEach(function(layer){try{if(!map.getLayer(layer.id))map.addLayer(layer);}catch(e){}});
          if(sarfToggle&&!sarfToggle.checked){if(map.getLayer('sf'))map.setLayoutProperty('sf','visibility','none');if(map.getLayer('sl'))map.setLayoutProperty('sl','visibility','none');}
        });
      }
      var bsEl=document.getElementById('bs'),baEl=document.getElementById('ba');
      if(bsEl)bsEl.onchange=function(){switchBaseStyle('mapbox://styles/mapbox/outdoors-v12');};
      if(baEl)baEl.onchange=function(){switchBaseStyle('mapbox://styles/mapbox/satellite-streets-v12');};
    }
    initStyleSwitch();
    ss('SkyWave Features Engine loaded');
  },100);
}

var _booted=false;
function waitForMap(){
  if(_booted)return;
  if(typeof map!=='undefined'&&map.loaded&&map.loaded()){_booted=true;bootFeatures();}
  else if(typeof map!=='undefined'){
    map.on('load',function(){if(!_booted){_booted=true;bootFeatures();}});
    map.on('style.load',function(){if(!_booted){_booted=true;bootFeatures();}});
    setTimeout(function(){if(!_booted){_booted=true;bootFeatures();}},8000);
  }else{setTimeout(waitForMap,200);}
}
waitForMap();
})();
