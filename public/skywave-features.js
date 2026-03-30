/**
 * SkyWave SARF Tower Siting Maps - Feature Engine
 * Supabase-connected features: Lead Sync, Broadband & Fiber, Zoning Ordinances, Mailer Tool
 * Measure Tool, Site Capture, Street View, NWI Wetlands
 */
(function() {
'use strict';

/* ================================================================
   CONFIGURATION
   ================================================================ */
var SUPABASE_URL = 'https://skpxeouvikzgsaurkohf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcHhlb3V2aWt6Z3NhdXJrb2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODM5NjMsImV4cCI6MjA4NjU1OTk2M30.wEWgn8uB4k0KhW5EUjlDUnUAOV1TBrKSmpqB8DLbsyk';
var MAPILLARY_CLIENT_ID = '2129296374580243';

/* ================================================================
   SUPABASE REST HELPER
   ================================================================ */
function supabaseRequest(path, opts) {
  opts = opts || {};
  var headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };
  if (opts.headers) {
    for (var k in opts.headers) headers[k] = opts.headers[k];
  }
  return fetch(SUPABASE_URL + '/rest/v1/' + path, {
    method: opts.method || 'GET',
    headers: headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
}

/* ================================================================
   INJECT ALL CSS
   ================================================================ */
function injectCSS() {
  var style = document.createElement('style');
  style.textContent = `
    /* ---- MEASURE TOOL ---- */
    #measure-tool{position:fixed;top:10px;right:60px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #ffcc00;background:rgba(0,0,0,.85);color:#ffcc00;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    #measure-tool:hover,#measure-tool.active{background:#ffcc00;color:#000}
    #measure-clear{position:fixed;top:50px;right:60px;z-index:200;font-size:10px;color:#ffcc00;cursor:pointer;text-decoration:underline;display:none;background:rgba(0,0,0,.7);padding:2px 6px;border-radius:3px}
    #measure-result{position:fixed;top:10px;right:102px;z-index:200;background:rgba(0,0,0,.88);color:#ffcc00;padding:5px 10px;border-radius:4px;font-size:12px;font-weight:600;display:none}

    /* ---- SITE CAPTURE ---- */
    #site-capture{position:fixed;top:10px;right:24px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #00ff88;background:rgba(0,0,0,.85);color:#00ff88;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    #site-capture:hover{background:#00ff88;color:#000}

    /* ---- STREET VIEW ---- */
    #street-view-btn{position:fixed;top:10px;right:140px;z-index:200;width:36px;height:36px;border-radius:6px;border:2px solid #4fc3f7;background:rgba(0,0,0,.85);color:#4fc3f7;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    #street-view-btn:hover{background:#4fc3f7;color:#000}
    #street-view-panel{position:fixed;top:60px;right:10px;width:400px;height:300px;z-index:300;background:#111;border:2px solid #4fc3f7;border-radius:8px;display:none;overflow:hidden}
    #street-view-panel .sv-header{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:#222;color:#4fc3f7;font-size:11px}
    #street-view-panel .sv-close{cursor:pointer;font-size:16px;color:#f44}
    #street-view-panel iframe{width:100%;height:calc(100% - 28px);border:none}

    /* ---- LEAD SYNC ---- */
    .lead-section{background:#0d2818;border:1px solid #1b5e20;border-radius:6px;padding:8px;margin-top:4px}
    .lead-section h2{color:#66bb6a;font-size:11px;margin:0 0 6px}
    .lead-tag{background:#1b5e20;color:#a5d6a7;padding:2px 6px;border-radius:3px;font-size:10px;display:inline-block;margin-bottom:6px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .lead-section label{font-size:10px;color:#81c784;display:block;margin:4px 0 1px}
    .lead-section input,.lead-section select{width:100%;padding:4px 6px;border-radius:4px;border:1px solid #2e7d32;background:#0a1f0f;color:#c8e6c9;font-size:11px;box-sizing:border-box}
    .lead-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#2e7d32;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:6px}
    .lead-section button:hover{background:#388e3c}
    .lead-status{font-size:10px;color:#81c784;margin-top:4px;min-height:14px}

    /* ---- BROADBAND & FIBER ---- */
    .fiber-section{background:#1a1200;border:1px solid #e65100;border-radius:6px;padding:8px;margin-top:4px}
    .fiber-section h2{color:#ff9800;font-size:11px;margin:0 0 6px}
    .fiber-section label{font-size:10px;color:#ffb74d}
    .fiber-status{font-size:10px;color:#ffb74d;margin-top:4px;min-height:14px}
    .fiber-popup{font-family:system-ui,sans-serif;min-width:240px}
    .fiber-popup h3{margin:0 0 6px;color:#e65100;font-size:13px;border-bottom:2px solid #ff9800;padding-bottom:4px}
    .fiber-popup .fp-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid #eee;font-size:11px}
    .fiber-popup .fp-name{font-weight:600;color:#333}
    .fiber-popup .fp-tech{background:#fff3e0;color:#e65100;padding:1px 5px;border-radius:3px;font-size:9px}
    .fiber-popup .fp-speed{color:#2e7d32;font-weight:600;font-size:10px}
    .fiber-popup .fp-low-lat{color:#1565c0;font-size:9px;font-style:italic}

    /* ---- ZONING ORDINANCES ---- */
    .zoning-section{background:#1a0020;border:1px solid #7b1fa2;border-radius:6px;padding:8px;margin-top:4px}
    .zoning-section h2{color:#ce93d8;font-size:11px;margin:0 0 6px}
    .zoning-section select{width:100%;padding:4px 6px;border-radius:4px;border:1px solid #7b1fa2;background:#12001a;color:#e1bee7;font-size:11px;box-sizing:border-box}
    .zoning-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#7b1fa2;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:6px}
    .zoning-section button:hover{background:#9c27b0}
    .zoning-status{font-size:10px;color:#ce93d8;margin-top:4px;min-height:14px}
    #zoning-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:500;justify-content:center;align-items:center}
    #zoning-overlay.open{display:flex}
    #zoning-modal{background:#fff;color:#222;width:90%;max-width:800px;max-height:85vh;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
    .zm-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#7b1fa2;color:#fff}
    .zm-header h2{margin:0;font-size:16px}
    .zm-close{font-size:22px;cursor:pointer;color:#fff;background:none;border:none;line-height:1}
    .zm-toolbar{display:flex;gap:8px;padding:8px 16px;background:#f3e5f5;border-bottom:1px solid #ce93d8}
    .zm-toolbar button{padding:5px 12px;border-radius:4px;border:1px solid #7b1fa2;background:#fff;color:#7b1fa2;font-size:11px;cursor:pointer;font-weight:600}
    .zm-toolbar button:hover{background:#7b1fa2;color:#fff}
    .zm-body{padding:16px;overflow-y:auto;flex:1}
    .zm-body h3{color:#7b1fa2;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #ce93d8;padding-bottom:4px}
    .zm-body .zr-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12px}
    .zm-body .zr-label{font-weight:600;color:#555;min-width:160px}
    .zm-body .zr-value{color:#222;text-align:right;flex:1}
    .zm-body .zr-yes{color:#2e7d32;font-weight:600}
    .zm-body .zr-no{color:#c62828}
    .zm-body .municode-section{background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:10px;margin:8px 0}
    .zm-body .municode-section h4{margin:0 0 4px;color:#4a148c;font-size:12px}
    .zm-body .municode-section pre{font-size:11px;white-space:pre-wrap;color:#333;margin:0;line-height:1.4}
    .zm-footer{padding:8px 16px;background:#f5f5f5;border-top:1px solid #ddd;font-size:10px;color:#888;text-align:center}

    /* ---- MAILER TOOL ---- */
    .mailer-section{background:#1a0a00;border:1px solid #bf360c;border-radius:6px;padding:8px;margin-top:4px}
    .mailer-section h2{color:#ff8a65;font-size:11px;margin:0 0 6px}
    .mailer-section button{width:100%;padding:6px;border-radius:4px;border:none;background:#bf360c;color:#fff;font-weight:600;cursor:pointer;font-size:11px;margin-top:4px}
    .mailer-section button:hover{background:#e64a19}
    #mailer-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:500;justify-content:center;align-items:center}
    #mailer-overlay.open{display:flex}
    #mailer-modal{background:#fff;color:#222;width:92%;max-width:900px;max-height:88vh;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
    .mm-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#bf360c;color:#fff}
    .mm-header h2{margin:0;font-size:16px}
    .mm-close{font-size:22px;cursor:pointer;color:#fff;background:none;border:none;line-height:1}
    .mm-toolbar{display:flex;gap:8px;padding:8px 16px;background:#fbe9e7;border-bottom:1px solid #ff8a65;flex-wrap:wrap;align-items:center}
    .mm-toolbar button{padding:5px 12px;border-radius:4px;border:1px solid #bf360c;background:#fff;color:#bf360c;font-size:11px;cursor:pointer;font-weight:600}
    .mm-toolbar button:hover{background:#bf360c;color:#fff}
    .mm-toolbar input{padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:11px;width:160px}
    .mm-body{overflow-y:auto;flex:1;padding:0}
    .mm-body table{width:100%;border-collapse:collapse;font-size:11px}
    .mm-body th{background:#fbe9e7;color:#bf360c;padding:8px 6px;text-align:left;border-bottom:2px solid #ff8a65;position:sticky;top:0}
    .mm-body td{padding:6px;border-bottom:1px solid #f0f0f0}
    .mm-body tr:hover{background:#fff8f6}
    .mm-body input[type=checkbox]{cursor:pointer}
    .mm-footer{padding:8px 16px;background:#f5f5f5;border-top:1px solid #ddd;font-size:10px;color:#888;text-align:center}

    @media print{
      body *{visibility:hidden}
      #zoning-overlay,#zoning-overlay *,#mailer-overlay,#mailer-overlay *{visibility:visible}
      #zoning-overlay,#mailer-overlay{position:absolute;top:0;left:0;width:100%;background:#fff}
      #zoning-modal,#mailer-modal{max-height:none;width:100%;max-width:100%}
      .zm-toolbar,.mm-toolbar,.zm-close,.mm-close{display:none!important}
    }
  `;
  document.head.appendChild(style);
}

/* ================================================================
   INJECT TOOLBAR BUTTONS (Measure, Site Capture, Street View)
   ================================================================ */
function injectToolbarButtons() {
  // Measure Tool Button
  var mb = document.createElement('button');
  mb.id = 'measure-tool';
  mb.textContent = '\u{1F4CF}';
  mb.title = 'Measure Tool';
  document.body.appendChild(mb);

  var mc = document.createElement('div');
  mc.id = 'measure-clear';
  mc.textContent = 'Clear Measurement';
  document.body.appendChild(mc);

  var mr = document.createElement('div');
  mr.id = 'measure-result';
  document.body.appendChild(mr);

  // Site Capture Button
  var sc = document.createElement('button');
  sc.id = 'site-capture';
  sc.textContent = '\u{1F4F7}';
  sc.title = 'Site Capture';
  document.body.appendChild(sc);

  // Street View Button
  var sv = document.createElement('button');
  sv.id = 'street-view-btn';
  sv.textContent = '\u{1F441}';
  sv.title = 'Street View';
  document.body.appendChild(sv);

  // Street View Panel
  var svp = document.createElement('div');
  svp.id = 'street-view-panel';
  svp.innerHTML = '<div class="sv-header"><span>Mapillary Street View</span><span class="sv-close">&times;</span></div><iframe id="sv-iframe"></iframe>';
  document.body.appendChild(svp);
}

/* ================================================================
   INJECT SIDEBAR SECTIONS
   ================================================================ */
function injectSidebarSections() {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Lead Sync Section
  var leadHTML = '<div class="lead-section" id="lead-sync-section">'
    + '<h2>\u{1F4BE} LEAD SYNC</h2>'
    + '<div class="lead-tag" id="lead-parcel-tag">Click a parcel to select</div>'
    + '<label>Verified Phone</label>'
    + '<input id="lead-phone" type="text" placeholder="(352) 555-0000">'
    + '<label>Verified Email</label>'
    + '<input id="lead-email" type="text" placeholder="owner@domain.com">'
    + '<label>Viability Score</label>'
    + '<select id="lead-viability"><option value="HIGH">HIGH</option><option value="MEDIUM">MEDIUM</option><option value="LOW">LOW</option></select>'
    + '<button id="lead-save">Save Lead to Supabase</button>'
    + '<div class="lead-status" id="lead-status"></div>'
    + '</div>';

  // Broadband & Fiber Section
  var fiberHTML = '<div class="fiber-section" id="fiber-section">'
    + '<h2>\u{1F50C} BROADBAND & FIBER</h2>'
    + '<div class="lt"><span>Show Fiber Locations</span><input id="fiber-toggle" type="checkbox"></div>'
    + '<div class="fiber-status" id="fiber-status"></div>'
    + '</div>';

  // Zoning Ordinances Section
  var zoningHTML = '<div class="zoning-section" id="zoning-section">'
    + '<h2>\u{1F3DB} ZONING ORDINANCES</h2>'
    + '<select id="zoning-jurisdiction"><option value="">Select Jurisdiction...</option></select>'
    + '<button id="zoning-view">View Zoning Report</button>'
    + '<div class="zoning-status" id="zoning-status"></div>'
    + '</div>';

  // Mailer Tool Section
  var mailerHTML = '<div class="mailer-section" id="mailer-section">'
    + '<h2>\u{1F4EC} MAILER TOOL</h2>'
    + '<button id="mailer-open">Open Mailer List</button>'
    + '</div>';

  sidebar.insertAdjacentHTML('beforeend', leadHTML + fiberHTML + zoningHTML + mailerHTML);
}

/* ================================================================
   INJECT MODALS (Zoning + Mailer)
   ================================================================ */
function injectModals() {
  // Zoning Modal
  var zo = document.createElement('div');
  zo.id = 'zoning-overlay';
  zo.innerHTML = '<div id="zoning-modal">'
    + '<div class="zm-header"><h2 id="zm-title">Zoning Ordinance Report</h2><button class="zm-close">&times;</button></div>'
    + '<div class="zm-toolbar"><button id="zm-print">\u{1F5A8} Print Report</button><button id="zm-municode">Show Full Municode Sections</button></div>'
    + '<div class="zm-body" id="zm-body"></div>'
    + '<div class="zm-footer">Source: Supabase zoning_ordinances &amp; municode_ordinances | SkyWave SARF Maps</div>'
    + '</div>';
  document.body.appendChild(zo);

  // Mailer Modal
  var mo = document.createElement('div');
  mo.id = 'mailer-overlay';
  mo.innerHTML = '<div id="mailer-modal">'
    + '<div class="mm-header"><h2>Mailer List - Parcels in SARF Radius</h2><button class="mm-close">&times;</button></div>'
    + '<div class="mm-toolbar">'
    + '<button id="mm-select-all">Select All</button>'
    + '<button id="mm-export-csv">Export CSV</button>'
    + '<button id="mm-print">\u{1F5A8} Print Mailer</button>'
    + '<input id="mm-search" type="text" placeholder="Search parcels...">'
    + '</div>'
    + '<div class="mm-body"><table><thead><tr><th><input type="checkbox" id="mm-check-all"></th><th>Parcel ID</th><th>Owner</th><th>Address</th><th>Zoning</th><th>Acres</th></tr></thead><tbody id="mm-tbody"></tbody></table></div>'
    + '<div class="mm-footer" id="mm-footer">0 parcels selected</div>'
    + '</div>';
  document.body.appendChild(mo);
}

/* ================================================================
   MEASURE TOOL
   ================================================================ */
function initMeasureTool() {
  var measuring = false;
  var measurePoints = [];
  var measureSourceAdded = false;
  var btn = document.getElementById('measure-tool');
  var clearLink = document.getElementById('measure-clear');
  var resultDiv = document.getElementById('measure-result');

  function calcDistance(p1, p2) {
    var R = 3958.8;
    var dLat = (p2[1] - p1[1]) * Math.PI / 180;
    var dLon = (p2[0] - p1[0]) * Math.PI / 180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1[1]*Math.PI/180)*Math.cos(p2[1]*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function totalDist() {
    var d = 0;
    for (var i = 1; i < measurePoints.length; i++) d += calcDistance(measurePoints[i-1], measurePoints[i]);
    return d;
  }

  function updateLine() {
    if (!measureSourceAdded) {
      map.addSource('measure-line', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'measure-line-layer', type: 'line', source: 'measure-line', paint: { 'line-color': '#ffcc00', 'line-width': 3, 'line-dasharray': [2, 1] } });
      map.addSource('measure-pts', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'measure-pts-layer', type: 'circle', source: 'measure-pts', paint: { 'circle-radius': 5, 'circle-color': '#ffcc00', 'circle-stroke-color': '#000', 'circle-stroke-width': 2 } });
      measureSourceAdded = true;
    }
    var features = [];
    if (measurePoints.length >= 2) {
      features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: measurePoints } });
    }
    map.getSource('measure-line').setData({ type: 'FeatureCollection', features: features });
    map.getSource('measure-pts').setData({ type: 'FeatureCollection', features: measurePoints.map(function(p) { return { type: 'Feature', geometry: { type: 'Point', coordinates: p } }; }) });
  }

  btn.addEventListener('click', function() {
    measuring = !measuring;
    btn.classList.toggle('active', measuring);
    map.getCanvas().style.cursor = measuring ? 'crosshair' : '';
    if (!measuring && measurePoints.length >= 2) {
      var d = totalDist();
      resultDiv.textContent = d < 1 ? (d * 5280).toFixed(0) + ' ft' : d.toFixed(2) + ' mi';
      resultDiv.style.display = 'block';
      clearLink.style.display = 'block';
    }
  });

  map.on('click', function(e) {
    if (!measuring) return;
    measurePoints.push([e.lngLat.lng, e.lngLat.lat]);
    updateLine();
    if (measurePoints.length >= 2) {
      var d = totalDist();
      resultDiv.textContent = d < 1 ? (d * 5280).toFixed(0) + ' ft' : d.toFixed(2) + ' mi';
      resultDiv.style.display = 'block';
      clearLink.style.display = 'block';
    }
  });

  clearLink.addEventListener('click', function() {
    measurePoints = [];
    updateLine();
    resultDiv.style.display = 'none';
    clearLink.style.display = 'none';
  });
}

/* ================================================================
   SITE CAPTURE
   ================================================================ */
function initSiteCapture() {
  document.getElementById('site-capture').addEventListener('click', function() {
    map.once('render', function() {
      var canvas = map.getCanvas();
      var dataURL = canvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.download = 'OnAir_Scout_' + (window._lastParcelId || 'SITE') + '.png';
      link.href = dataURL;
      link.click();
      ss('Screenshot saved');
    });
    map.triggerRepaint();
  });
}

/* ================================================================
   STREET VIEW (Mapillary)
   ================================================================ */
function initStreetView() {
  var svBtn = document.getElementById('street-view-btn');
  var svPanel = document.getElementById('street-view-panel');
  var svClose = svPanel.querySelector('.sv-close');
  var svIframe = document.getElementById('sv-iframe');
  var active = false;

  svBtn.addEventListener('click', function() {
    active = !active;
    if (active) {
      map.getCanvas().style.cursor = 'crosshair';
      ss('Click map for Street View');
    } else {
      map.getCanvas().style.cursor = '';
      svPanel.style.display = 'none';
    }
  });

  svClose.addEventListener('click', function() {
    svPanel.style.display = 'none';
    active = false;
    map.getCanvas().style.cursor = '';
  });

  map.on('click', function(e) {
    if (!active) return;
    var lat = e.lngLat.lat;
    var lng = e.lngLat.lng;
    svIframe.src = 'https://www.mapillary.com/embed?closeto=' + lng + ',' + lat + '&layer=images&zoom=17';
    svPanel.style.display = 'block';
    active = false;
    map.getCanvas().style.cursor = '';
    ss('Street View loaded');
  });
}

/* ================================================================
   LEAD SYNC (Supabase)
   ================================================================ */
function initLeadSync() {
  var _leadParcel = null;
  var tag = document.getElementById('lead-parcel-tag');
  var phoneInput = document.getElementById('lead-phone');
  var emailInput = document.getElementById('lead-email');
  var viabilitySelect = document.getElementById('lead-viability');
  var saveBtn = document.getElementById('lead-save');
  var statusDiv = document.getElementById('lead-status');

  // Listen for parcel clicks on the pf (parcel fill) layer
  map.on('click', 'pf', function(e) {
    if (e.features && e.features.length > 0) {
      var f = e.features[0].properties;
      _leadParcel = f;
      window._lastParcelId = f.PARCELID || f.parcel_id || '';
      tag.textContent = (f.PARCELID || f.parcel_id || '') + ' - ' + (f.OWNER || f.OWN_NAME || 'Unknown');
      statusDiv.textContent = '';
    }
  });

  saveBtn.addEventListener('click', function() {
    if (!_leadParcel) { statusDiv.textContent = '\u26A0 Select a parcel first'; return; }
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();
    if (!phone && !email) { statusDiv.textContent = '\u26A0 Enter phone or email'; return; }

    statusDiv.textContent = 'Saving...';
    var record = {
      parcel_id: _leadParcel.PARCELID || _leadParcel.parcel_id || 'UNKNOWN',
      owner_name: _leadParcel.OWNER || _leadParcel.OWN_NAME || '',
      site_address: _leadParcel.PHY_ADDR1 || _leadParcel.ADDRESS || '',
      verified_phone: phone || null,
      verified_email: email || null,
      viability_score: viabilitySelect.value,
      is_pro: false
    };

    supabaseRequest('leads', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: record
    }).then(function(r) {
      if (r.ok) {
        return r.json().then(function(data) {
          statusDiv.textContent = '\u2705 Saved! Lead ' + (data.length && data[0].created_at ? 'created' : 'updated');
        });
      } else {
        return r.text().then(function(t) { statusDiv.textContent = '\u274C Error: ' + t; });
      }
    }).catch(function(err) { statusDiv.textContent = '\u274C ' + err.message; });
  });
}

/* ================================================================
   BROADBAND & FIBER (Supabase)
   ================================================================ */
function initFiber() {
  var toggle = document.getElementById('fiber-toggle');
  var statusDiv = document.getElementById('fiber-status');
  var fiberLoaded = false;
  var fiberLayerIds = [];

  toggle.addEventListener('change', function() {
    if (this.checked && !fiberLoaded) {
      loadFiber();
    } else if (fiberLoaded) {
      var v = this.checked ? 'visible' : 'none';
      fiberLayerIds.forEach(function(id) { map.setLayoutProperty(id, 'visibility', v); });
    }
  });

  function loadFiber() {
    statusDiv.textContent = 'Loading fiber data...';
    Promise.all([
      supabaseRequest('fiber_availability?select=*').then(function(r) { return r.json(); }),
      supabaseRequest('broadband_availability?select=*').then(function(r) { return r.json(); })
    ]).then(function(results) {
      var fiber = results[0] || [];
      var broadband = results[1] || [];
      var all = fiber.concat(broadband);

      // Group by location
      var groups = {};
      all.forEach(function(r) {
        var lat = r.latitude || r.lat;
        var lng = r.longitude || r.lng || r.lon;
        if (!lat || !lng) return;
        var key = parseFloat(lat).toFixed(4) + ',' + parseFloat(lng).toFixed(4);
        if (!groups[key]) groups[key] = { lat: parseFloat(lat), lng: parseFloat(lng), name: r.location_name || r.address || key, providers: [] };
        groups[key].providers.push(r);
      });

      var features = Object.values(groups).map(function(g) {
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
          properties: { name: g.name, count: g.providers.length, providers: JSON.stringify(g.providers) }
        };
      });

      var geojson = { type: 'FeatureCollection', features: features };

      map.addSource('fiber-src', { type: 'geojson', data: geojson });
      map.addLayer({ id: 'fiber-circles', type: 'circle', source: 'fiber-src', paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 6, 20, 14], 'circle-color': '#ff9800', 'circle-stroke-color': '#e65100', 'circle-stroke-width': 2, 'circle-opacity': 0.85 } });
      map.addLayer({ id: 'fiber-labels', type: 'symbol', source: 'fiber-src', layout: { 'text-field': ['get', 'name'], 'text-size': 10, 'text-offset': [0, 1.5] }, paint: { 'text-color': '#ff9800', 'text-halo-color': '#000', 'text-halo-width': 1 } });

      fiberLayerIds = ['fiber-circles', 'fiber-labels'];
      fiberLoaded = true;

      // Click handler for fiber popups
      map.on('click', 'fiber-circles', function(e) {
        if (!e.features || !e.features.length) return;
        var props = e.features[0].properties;
        var providers = JSON.parse(props.providers);
        var html = '<div class="fiber-popup"><h3>\u{1F50C} ' + props.name + '</h3>';
        html += '<div style="font-size:10px;color:#888;margin-bottom:6px">' + providers.length + ' Providers at this Location</div>';
        providers.forEach(function(p) {
          html += '<div class="fp-row"><span class="fp-name">' + (p.provider_name || p.provider || 'Unknown') + '</span>';
          if (p.technology) html += '<span class="fp-tech">' + p.technology + '</span>';
          if (p.max_download_speed) html += '<span class="fp-speed">' + p.max_download_speed + ' Mbps</span>';
          if (p.low_latency) html += '<span class="fp-low-lat">Low Latency</span>';
          html += '</div>';
        });
        html += '</div>';
        new mapboxgl.Popup({ maxWidth: '360px' }).setLngLat(e.lngLat).setHTML(html).addTo(map);
      });
      map.on('mouseenter', 'fiber-circles', function() { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'fiber-circles', function() { map.getCanvas().style.cursor = ''; });

      var locCount = features.length;
      statusDiv.textContent = '\u{1F50C} ' + locCount + ' locations, ' + all.length + ' provider records';

      // Fit to fiber bounds if we have data
      if (features.length > 0) {
        var bounds = new mapboxgl.LngLatBounds();
        features.forEach(function(f) { bounds.extend(f.geometry.coordinates); });
        map.fitBounds(bounds, { padding: 60, maxZoom: 12 });
      }
    }).catch(function(err) { statusDiv.textContent = '\u274C ' + err.message; });
  }
}

/* ================================================================
   ZONING ORDINANCES (Supabase)
   ================================================================ */
function initZoning() {
  var jurisdictionSelect = document.getElementById('zoning-jurisdiction');
  var viewBtn = document.getElementById('zoning-view');
  var statusDiv = document.getElementById('zoning-status');
  var overlay = document.getElementById('zoning-overlay');
  var modal = document.getElementById('zoning-modal');
  var closeBtn = overlay.querySelector('.zm-close');
  var printBtn = document.getElementById('zm-print');
  var municodeBtn = document.getElementById('zm-municode');
  var body = document.getElementById('zm-body');
  var titleEl = document.getElementById('zm-title');
  var _ordinances = [];
  var _currentJurisdiction = '';

  // Close handlers with bulletproof event propagation
  function closeZoning() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
  }

  closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeZoning(); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeZoning(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeZoning(); });

  // Prevent clicks inside modal from closing
  modal.addEventListener('click', function(e) { e.stopPropagation(); });

  // Print
  printBtn.addEventListener('click', function(e) { e.stopPropagation(); window.print(); });

  // Load jurisdictions
  statusDiv.textContent = 'Loading jurisdictions...';
  supabaseRequest('zoning_ordinances?select=jurisdiction_name&order=jurisdiction_name').then(function(r) { return r.json(); }).then(function(data) {
    _ordinances = Array.isArray(data) ? data : [];
    var seen = {};
    _ordinances.forEach(function(o) {
      if (!seen[o.jurisdiction_name]) {
        seen[o.jurisdiction_name] = true;
        var opt = document.createElement('option');
        opt.value = o.jurisdiction_name;
        opt.textContent = o.jurisdiction_name;
        jurisdictionSelect.appendChild(opt);
      }
    });
    statusDiv.textContent = Object.keys(seen).length + ' jurisdictions loaded';
  }).catch(function(err) { statusDiv.textContent = '\u274C ' + err.message; });

  // View report
  viewBtn.addEventListener('click', function() {
    var j = jurisdictionSelect.value;
    if (!j) { statusDiv.textContent = '\u26A0 Select a jurisdiction'; return; }
    _currentJurisdiction = j;

    // Fetch full ordinance data for this jurisdiction
    supabaseRequest('zoning_ordinances?jurisdiction_name=eq.' + encodeURIComponent(j) + '&select=*').then(function(r) { return r.json(); }).then(function(data) {
      if (!data || !data.length) { body.innerHTML = '<p>No data found for ' + j + '</p>'; return; }
      var o = data[0];
      titleEl.textContent = '\u{1F3DB} ' + j + ' - Telecom Zoning Ordinance';

      var html = '<h3>Tower Standards</h3>';
      html += zRow('Max Tower Height', o.max_tower_height_ft ? o.max_tower_height_ft + ' ft' : 'Not specified');
      html += zRow('Setback Requirements', o.setback_requirement || 'Not specified');
      html += zRow('Fall Zone', o.fall_zone_requirement || 'Not specified');

      html += '<h3>Requirements</h3>';
      html += zRow('Collocation Required', zBool(o.collocation_required));
      html += zRow('Stealth Design', zBool(o.stealth_required));
      html += zRow('Landscaping Required', zBool(o.landscaping_required));

      html += '<h3>Permitting</h3>';
      html += zRow('Permit Type', o.permit_type || 'Not specified');
      html += zRow('Application Fee', o.application_fee || 'Not specified');
      html += zRow('Public Hearing Required', zBool(o.public_hearing_required));
      html += zRow('Balloon Test Required', zBool(o.balloon_test_required));
      html += zRow('Photo Simulation Required', zBool(o.photo_sim_required));

      if (o.additional_requirements) {
        html += '<h3>Additional Requirements</h3>';
        html += '<div style="font-size:12px;line-height:1.5;padding:6px 0">' + (o.additional_requirements || o.notes || '') + '</div>';
      }

      html += '<h3>Source</h3>';
      html += zRow('Ordinance Reference', o.ldc_section_reference || o.ordinance_source_url || 'Municipal Code');
      html += zRow('Last Verified', o.last_verified || 'N/A');

      body.innerHTML = html;
      overlay.style.display = 'flex';
      overlay.classList.add('open');
    }).catch(function(err) { body.innerHTML = '<p>Error: ' + err.message + '</p>'; });
  });

  // Municode sections
  municodeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!_currentJurisdiction) return;
    municodeBtn.textContent = 'Loading...';
    supabaseRequest('municode_ordinances?jurisdiction_name=eq.' + encodeURIComponent(_currentJurisdiction) + '&select=*&order=section_number').then(function(r) { return r.json(); }).then(function(data) {
      if (!data || !data.length) {
        // Try partial match
        return supabaseRequest('municode_ordinances?jurisdiction_name=ilike.' + encodeURIComponent('%' + _currentJurisdiction.replace('County', '').replace('City of ', '').trim() + '%') + '&select=*&order=section_number&limit=20').then(function(r2) { return r2.json(); });
      }
      return data;
    }).then(function(data) {
      municodeBtn.textContent = 'Show Full Municode Sections';
      if (!data || !data.length) {
        body.insertAdjacentHTML('beforeend', '<h3>Municode Sections</h3><p>No Municode sections found for ' + _currentJurisdiction + '</p>');
        return;
      }
      var html = '<h3>Municode Sections (' + data.length + ')</h3>';
      data.forEach(function(s) {
        html += '<div class="municode-section">';
        html += '<h4>\u00A7 ' + (s.section_number || '') + ' - ' + (s.section_title || s.title || 'Untitled') + '</h4>';
        html += '<pre>' + (s.section_text || s.content || s.text || 'No content available') + '</pre>';
        html += '</div>';
      });
      body.insertAdjacentHTML('beforeend', html);
    }).catch(function(err) { municodeBtn.textContent = 'Show Full Municode Sections'; });
  });

  function zRow(label, value) {
    return '<div class="zr-row"><span class="zr-label">' + label + '</span><span class="zr-value">' + value + '</span></div>';
  }
  function zBool(val) {
    if (val === true || val === 'true' || val === 'Yes' || val === 'yes') return '<span class="zr-yes">\u2705 Yes</span>';
    if (val === false || val === 'false' || val === 'No' || val === 'no') return '<span class="zr-no">\u274C No</span>';
    return val || 'Not specified';
  }
}

/* ================================================================
   MAILER TOOL
   ================================================================ */
function initMailer() {
  var overlay = document.getElementById('mailer-overlay');
  var modal = document.getElementById('mailer-modal');
  var closeBtn = overlay.querySelector('.mm-close');
  var openBtn = document.getElementById('mailer-open');
  var selectAllBtn = document.getElementById('mm-select-all');
  var exportBtn = document.getElementById('mm-export-csv');
  var printBtn = document.getElementById('mm-print');
  var searchInput = document.getElementById('mm-search');
  var checkAll = document.getElementById('mm-check-all');
  var tbody = document.getElementById('mm-tbody');
  var footer = document.getElementById('mm-footer');
  var _parcels = [];

  function closeMailer() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
  }

  function openMailer() {
    loadParcels();
    overlay.style.display = 'flex';
    overlay.classList.add('open');
  }

  // Bulletproof close handlers
  closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeMailer(); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeMailer(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeMailer(); });
  modal.addEventListener('click', function(e) { e.stopPropagation(); });

  openBtn.addEventListener('click', openMailer);

  function loadParcels() {
    // Get parcels from the map source
    var src = map.getSource('ps');
    if (!src || !src._data) {
      _parcels = [];
      // Try to get from features on map
      var features = map.querySourceFeatures('ps');
      if (features && features.length) {
        _parcels = features.map(function(f) {
          return { id: f.properties.PARCELID || '', owner: f.properties.OWNER || '', address: f.properties.PHY_ADDR1 || f.properties.ADDRESS || '', zoning: f.properties.ZONING || '', acres: f.properties.ACRES || '' };
        });
      }
    } else {
      var data = src._data;
      if (data && data.features) {
        _parcels = data.features.map(function(f) {
          var p = f.properties;
          return { id: p.PARCELID || '', owner: p.OWNER || '', address: p.PHY_ADDR1 || p.ADDRESS || '', zoning: p.ZONING || '', acres: p.ACRES || '' };
        });
      }
    }
    renderTable(_parcels);
  }

  function renderTable(parcels) {
    tbody.innerHTML = '';
    parcels.forEach(function(p, i) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><input type="checkbox" class="mm-check" data-idx="' + i + '"></td>'
        + '<td>' + p.id + '</td><td>' + p.owner + '</td><td>' + p.address + '</td>'
        + '<td>' + p.zoning + '</td><td>' + p.acres + '</td>';
      tbody.appendChild(tr);
    });
    updateFooter();
  }

  function updateFooter() {
    var checks = tbody.querySelectorAll('.mm-check:checked');
    footer.textContent = checks.length + ' of ' + _parcels.length + ' parcels selected';
  }

  // Select All
  selectAllBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var checks = tbody.querySelectorAll('.mm-check');
    var allChecked = Array.from(checks).every(function(c) { return c.checked; });
    checks.forEach(function(c) { c.checked = !allChecked; });
    checkAll.checked = !allChecked;
    updateFooter();
  });

  checkAll.addEventListener('change', function(e) {
    e.stopPropagation();
    var checks = tbody.querySelectorAll('.mm-check');
    checks.forEach(function(c) { c.checked = checkAll.checked; });
    updateFooter();
  });

  tbody.addEventListener('change', function(e) {
    e.stopPropagation();
    updateFooter();
  });

  // Export CSV
  exportBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var checks = tbody.querySelectorAll('.mm-check:checked');
    if (!checks.length) { alert('Select at least one parcel'); return; }
    var csv = 'Parcel ID,Owner,Address,Zoning,Acres\n';
    checks.forEach(function(c) {
      var idx = parseInt(c.dataset.idx);
      var p = _parcels[idx];
      if (p) csv += '"' + p.id + '","' + p.owner + '","' + p.address + '","' + p.zoning + '","' + p.acres + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'SARF_Mailer_List.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Print
  printBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    window.print();
  });

  // Search
  searchInput.addEventListener('input', function(e) {
    e.stopPropagation();
    var q = this.value.toLowerCase();
    var filtered = _parcels.filter(function(p) {
      return p.id.toLowerCase().indexOf(q) >= 0 || p.owner.toLowerCase().indexOf(q) >= 0 || p.address.toLowerCase().indexOf(q) >= 0;
    });
    renderTable(filtered);
  });
}

/* ================================================================
   HIFLD TRANSMISSION LINES
   ================================================================ */
function initTransmission() {
  var cb = document.getElementById('ltx');
  if (!cb) return;

  var HIFLD_URL = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Electric_Power_Transmission_Lines/FeatureServer/0/query';

  function loadTxLines() {
    var bounds = map.getBounds();
    var env = bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth();
    var params = 'where=1%3D1&outFields=OWNER,VOLTAGE,VOLT_CLASS,STATUS,TYPE&geometryType=esriGeometryEnvelope&geometry=' + encodeURIComponent(env) + '&inSR=4326&outSR=4326&f=geojson&resultRecordCount=2000';
    var url = HIFLD_URL + '?' + params;
    document.getElementById('st').textContent = 'Loading transmission lines...';
    document.getElementById('st').style.display = 'block';
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.features) { document.getElementById('st').style.display = 'none'; return; }
        var src = map.getSource('txlines');
        if (src) {
          src.setData(data);
        } else {
          map.addSource('txlines', { type: 'geojson', data: data });
          map.addLayer({
            id: 'txlines-line',
            type: 'line',
            source: 'txlines',
            paint: {
              'line-color': '#ff00ff',
              'line-width': 2,
              'line-opacity': 0.8
            }
          });
          map.on('click', 'txlines-line', function(e) {
            var p = e.features[0].properties;
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML('<div style="font-size:13px"><b>Transmission Line</b><br>Owner: ' + (p.OWNER || 'N/A') + '<br>Voltage: ' + (p.VOLTAGE || 'N/A') + ' kV<br>Class: ' + (p.VOLT_CLASS || 'N/A') + '<br>Status: ' + (p.STATUS || 'N/A') + '<br>Type: ' + (p.TYPE || 'N/A') + '</div>')
              .addTo(map);
          });
          map.on('mouseenter', 'txlines-line', function() { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'txlines-line', function() { map.getCanvas().style.cursor = ''; });
        }
        document.getElementById('st').textContent = data.features.length + ' transmission lines loaded';
        setTimeout(function() { document.getElementById('st').style.display = 'none'; }, 2000);
      })
      .catch(function(err) {
        console.error('HIFLD error:', err);
        document.getElementById('st').style.display = 'none';
      });
  }

  cb.addEventListener('change', function() {
    if (cb.checked) {
      loadTxLines();
      map.on('moveend', loadTxLines);
      cb._txHandler = loadTxLines;
    } else {
      if (cb._txHandler) map.off('moveend', cb._txHandler);
      if (map.getLayer('txlines-line')) map.removeLayer('txlines-line');
      if (map.getSource('txlines')) map.removeSource('txlines');
    }
  });
}

/* ================================================================
   INITIALIZATION - Wait for map load, then boot all features
   ================================================================ */
function bootFeatures() {
  injectCSS();
  injectToolbarButtons();
  injectSidebarSections();
  injectModals();

  // Wait a tick for DOM to settle
  setTimeout(function() {
    initMeasureTool();
    initSiteCapture();
    initStreetView();
    initLeadSync();
    initFiber();
    initZoning();
    initMailer();            initTransmission();
    ss('SkyWave Features Engine loaded');
  }, 100);
}

// Wait for map to be available and loaded, with fallback timer
var _booted = false;
function waitForMap() {
  if (_booted) return;
  if (typeof map !== 'undefined' && map.loaded && map.loaded()) {
    _booted = true;
    bootFeatures();
  } else if (typeof map !== 'undefined') {
    map.on('load', function() { if (!_booted) { _booted = true; bootFeatures(); } });
    map.on('style.load', function() { if (!_booted) { _booted = true; bootFeatures(); } });
    // Fallback: if map never fires load (e.g. slow tiles), boot after 8 seconds
    setTimeout(function() { if (!_booted) { _booted = true; bootFeatures(); } }, 8000);
  } else {
    setTimeout(waitForMap, 200);
  }
}

waitForMap();
})();
