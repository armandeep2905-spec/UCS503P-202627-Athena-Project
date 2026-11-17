/* =====================================================================
   ATHENA – Thapar Campus Navigation
   ---------------------------------------------------------------------
   All coordinates are in "map units": the campus image is treated as
   1459 units wide (height follows the image's aspect ratio). Because the
   overlay is an SVG with a matching viewBox, everything scales with the
   image automatically – no manual pixel scaling needed.

   To fix a wrong position: open coordinates.html, click the spot on the
   map, and copy the X / Y into the `locations` list or the `nodes`
   (road points) below. Turn on "Show road network" on the map page to
   see exactly where the roads are.
   ===================================================================== */

const MAP_W = 1459;

/* ---------------------------------------------------------------------
   1. CATEGORIES
   --------------------------------------------------------------------- */
const CATEGORIES = {
    gate:     { label: "Gates & Entrances",          color: "#7c3aed" },
    academic: { label: "Academic & Administration",  color: "#2563eb" },
    hostel:   { label: "Hostels",                    color: "#db2777" },
    food:     { label: "Food & Services",            color: "#ea580c" },
    sports:   { label: "Sports & Open Spaces",       color: "#16a34a" },
    other:    { label: "Other Places",               color: "#0891b2" }
};

/* ---------------------------------------------------------------------
   2. LOCATIONS  (every place printed on the campus map)
   --------------------------------------------------------------------- */
const L = (id, name, x, y, cat) => ({ id, name, x, y, cat });

const locations = [
    // ---- Gates ----
    L("main_entrance",    "Main Entrance",    1300, 757, "gate"),
    L("western_gate",     "Western Gate",       75, 472, "gate"),
    L("polytechnic_gate", "Polytechnic Gate",  703,  45, "gate"),
    L("tslas_gate",       "TSLAS Gate",       1425, 422, "gate"),

    // ---- Academic & administration ----
    L("cs_block",         "CS Block",                      1035, 322, "academic"),
    L("lt",               "LT (Lecture Theatre)",          1030, 392, "academic"),
    L("lp_101",           "LP 101-103",                     993, 448, "academic"),
    L("lp_110",           "LP 110-111",                    1118, 333, "academic"),
    L("dean_office",      "Dean Office & Visitor's Lounge", 1148, 362, "academic"),
    L("library",          "Library",                       1090, 445, "academic"),
    L("mech_workshop",    "Mechanical Workshop",           1250, 432, "academic"),
    L("venture_lab",      "Venture Lab",                   1310, 355, "academic"),
    L("tslas",            "TSLAS (Liberal Arts & Sciences)", 1300, 230, "academic"),
    L("polytechnic_college", "Polytechnic College",         950,  68, "academic"),
    L("directorate",      "Directorate",                   1185, 627, "academic"),
    L("b_block",          "B Block",                       1115, 578, "academic"),
    L("c_block",          "C Block",                       1125, 540, "academic"),
    L("d_block",          "D Block",                       1112, 497, "academic"),
    L("e_block",          "E Block",                       1255, 558, "academic"),
    L("f_block",          "F Block",                       1258, 512, "academic"),
    L("g_block",          "G Block",                       1005, 520, "academic"),
    L("h_block",          "H Block",                       1308, 598, "academic"),
    L("tan",              "TAN",                            925, 527, "academic"),
    L("main_audi",        "Main Auditorium",               1100, 712, "academic"),
    L("tifac_core",       "TIFAC-CORE",                     935, 258, "academic"),
    L("step",             "STEP",                           985, 262, "academic"),
    L("health_centre",    "Health Centre",                 1017, 243, "academic"),

    // ---- Hostels ----
    L("frg",       "FRG Hostel",        85, 222, "hostel"),
    L("frf",       "FRF Hostel",        85, 298, "hostel"),
    L("fre",       "FRE Hostel",       172, 225, "hostel"),
    L("frd",       "FRD Hostel",       172, 298, "hostel"),
    L("frc",       "FRC Hostel",       150, 355, "hostel"),
    L("frb",       "FRB Hostel",       150, 395, "hostel"),
    L("fra",       "FRA Hostel",       150, 435, "hostel"),
    L("anantam",   "Anantam Hall",     232, 555, "hostel"),
    L("tejas",     "Tejas Hall",       470, 555, "hostel"),
    L("vyan",      "Vyan Hall",        560, 555, "hostel"),
    L("neeram",    "Neeram Hall",      148, 690, "hostel"),
    L("prithvi",   "Prithvi Hall",     255, 690, "hostel"),
    L("vyom",      "Vyom Hall",        358, 690, "hostel"),
    L("amritam",   "Amritam Hall",     462, 690, "hostel"),
    L("agira",     "Agira Hall",       565, 690, "hostel"),
    L("hostel_pg", "Hostel PG (Dhriti Hall)", 685, 665, "hostel"),
    L("vahni",     "Vahni Hall",       800, 665, "hostel"),
    L("ambaram",   "Ambaram Hall",     548,  95, "hostel"),
    L("viyat",     "Viyat Hall",       810,  95, "hostel"),
    L("vasudha",   "Vasudha Hall",     808, 375, "hostel"),
    L("ira",       "Ira Hall",         910, 340, "hostel"),
    L("ananta",    "Ananta Hall",      908, 418, "hostel"),

    // ---- Food & services ----
    L("food_court",      "Food Court (Chaimiss)",  800, 502, "food"),
    L("canteen",         "Canteen",                975, 598, "food"),
    L("aahar",           "Aahar",                 1228, 610, "food"),
    L("street_cafe",     "Street Cafe",           1125, 660, "food"),
    L("waterbody_cafe",  "Waterbody Cafe",        1085, 395, "food"),
    L("tslas_canteen",   "TSLAS Canteen",         1255, 185, "food"),
    L("stationery_atm",  "Stationery & ATM Shop", 1043, 628, "food"),
    L("post_office",     "Post Office",           1098, 606, "food"),
    L("bank",            "Bank",                  1090, 630, "food"),

    // ---- Sports & open spaces ----
    L("cricket_field",   "Cricket Field",     528, 268, "sports"),
    L("synthetic_track", "Synthetic Track",   280, 380, "sports"),
    L("sports_complex",  "Sports Complex",    690, 305, "sports"),
    L("sports_office",   "Sports Office",     672, 243, "sports"),
    L("swimming_pool",   "Swimming Pool",     722, 413, "sports"),
    L("tennis_court",    "Tennis Court",      582, 325, "sports"),
    L("field",           "Field",             478, 337, "sports"),
    L("ground",          "Ground",            478, 448, "sports"),
    L("fete_area",       "Fete Area",         560, 448, "sports"),
    L("central_park",    "Central Park",      680, 520, "sports"),
    L("oat",             "OAT (Open Air Theatre)", 400, 355, "sports"),
    L("cos",             "COS",               402, 405, "sports"),
    L("sbop_lawns",      "SBOP Lawns",       1035, 702, "sports"),

    // ---- Other ----
    L("staff_quarters",  "Staff Quarters",    950, 165, "other"),
    L("guest_house",     "Guest House",       985, 702, "other"),
    L("parking",         "Parking",          1250, 640, "other"),
    L("shiv_mandir",     "Shiv Mandir",       380, 560, "other"),
    L("gurudwara",       "Gurudwara",         380, 597, "other")
];

/* Shorter names used for the labels drawn on the map (long names cover too
   much space). The dropdowns and directions still use the full name. */
const SHORT_NAMES = {
    lt: "LT", dean_office: "Dean Office", tslas: "TSLAS", hostel_pg: "Hostel PG",
    food_court: "Food Court", oat: "OAT", stationery_atm: "Stationery & ATM",
    mech_workshop: "Mech. Workshop", polytechnic_college: "Polytechnic College"
};

const locById = {};
locations.forEach(l => { l.short = SHORT_NAMES[l.id] || l.name; locById[l.id] = l; });

/* ---------------------------------------------------------------------
   3. ROAD NETWORK
   Traced from the road pixels of campus-map-opt.jpg and checked against
   them: every segment below lies on a road that is really drawn on the
   map (thick dashed roads + the thin dark roads). Nothing is invented.
   Nodes are junctions / bends; chains join them in order.
   --------------------------------------------------------------------- */
const nodes = {
    // ---- top road + central vertical road (x = 631) ----
    t0: { x: 541,  y: 45  },
    v0: { x: 631,  y: 45  },
    t1: { x: 757,  y: 45  },
    t2: { x: 842,  y: 45  },
    w1: { x: 522,  y: 146 },
    v1: { x: 631,  y: 145 },
    cr6:{ x: 631,  y: 243 },
    v2: { x: 631,  y: 283 },
    cA: { x: 631,  y: 423 },
    m3: { x: 631,  y: 472 },
    v3: { x: 631,  y: 632 },
    v4: { x: 631,  y: 756 },

    // ---- curved road around the cricket field ----
    cf1: { x: 495, y: 159 },
    cf2: { x: 470, y: 175 },
    cf3: { x: 452, y: 212 },
    cf4: { x: 445, y: 242 },
    cf5: { x: 435, y: 282 },
    cf6: { x: 429, y: 314 },
    cr1: { x: 550, y: 155 },
    cr2: { x: 575, y: 162 },
    cr3: { x: 595, y: 187 },
    cr4: { x: 610, y: 210 },
    cr5: { x: 621, y: 235 },

    // ---- curved link near the sports complex ----
    sc1: { x: 645, y: 423 },
    sc2: { x: 657, y: 428 },
    sc3: { x: 670, y: 437 },
    sc4: { x: 678, y: 451 },

    // ---- second vertical road (x = 757) beside the sports complex ----
    s1: { x: 757,  y: 137 },
    s2: { x: 757,  y: 205 },
    s3: { x: 757,  y: 283 },

    // ---- main east-west road (y = 472) ----
    m0: { x: 75,   y: 472 },
    a1: { x: 218,  y: 472 },
    a2: { x: 412,  y: 472 },
    cD: { x: 681,  y: 472 },
    a3: { x: 865,  y: 472 },
    a5: { x: 1070, y: 472 },
    mE: { x: 1275, y: 472 },

    // ---- west vertical road (x = 218) ----
    f1: { x: 218,  y: 192 },

    // ---- south-west hostel roads ----
    h2: { x: 307,  y: 632 },
    h3: { x: 412,  y: 632 },
    g2: { x: 307,  y: 756 },
    g3: { x: 412,  y: 756 },

    // ---- bottom road (y = 756) ----
    b0: { x: 102,  y: 756 },
    b2: { x: 1070, y: 756 },
    q2: { x: 1150, y: 756 },
    pe: { x: 1278, y: 756 },
    mB: { x: 1297, y: 756 },

    // ---- road right of G-Block / canteen (x = 1070) ----
    g9: { x: 1070, y: 503 },
    g5: { x: 1070, y: 595 },
    d1: { x: 1070, y: 684 },

    // ---- thin roads around G-Block ----
    p1: { x: 940,  y: 563 },
    p2: { x: 1022, y: 563 },
    p3: { x: 1022, y: 595 },
    p4: { x: 1000, y: 595 },

    // ---- thin roads south of the department complex ----
    d2: { x: 1150, y: 684 },
    d8: { x: 1150, y: 667 },
    d3: { x: 1150, y: 705 },
    d4: { x: 1234, y: 705 },
    d5: { x: 1250, y: 717 },
    d6: { x: 1270, y: 737 },
    d7: { x: 1257, y: 655 },

    // ---- staff-quarters roads ----
    r1: { x: 850,  y: 132 },
    r2: { x: 897,  y: 129 },
    r3: { x: 950,  y: 116 },
    r4: { x: 1100, y: 106 },
    J:  { x: 1153, y: 185 },
    Jb: { x: 1139, y: 203 },
    jE: { x: 1222, y: 177 },
    q1: { x: 1228, y: 270 },
    u1: { x: 897,  y: 205 },
    k1: { x: 1102, y: 232 },
    k2: { x: 1050, y: 265 },
    k3: { x: 1000, y: 281 },
    k4: { x: 950,  y: 290 },
    k5: { x: 900,  y: 295 },
    c1: { x: 865,  y: 293 },
    c0: { x: 800,  y: 289 },
    sp: { x: 1107, y: 305 },

    // ---- east side: TSLAS / Venture Lab loop ----
    E1: { x: 1230, y: 300 },
    E2: { x: 1230, y: 385 },
    F1: { x: 1376, y: 300 },
    F2: { x: 1376, y: 348 },
    F3: { x: 1360, y: 385 },
    F4: { x: 1363, y: 460 },
    F5: { x: 1400, y: 385 },
    tg: { x: 1412, y: 402 }
};

const chains = [
    // top road and the two vertical roads
    ["t0", "v0", "t1", "t2"],
    ["w1", "v1"],
    ["v0", "v1", "cr6", "v2", "cA", "m3", "v3", "v4"],
    ["t1", "s1", "s2", "s3"],
    ["v2", "s3"],

    // curved roads around the cricket field and near the sports complex
    ["w1", "cf1", "cf2", "cf3", "cf4", "cf5", "cf6"],
    ["w1", "cr1", "cr2", "cr3", "cr4", "cr5", "cr6"],
    ["cA", "sc1", "sc2", "sc3", "sc4", "cD"],

    // main road
    ["m0", "a1", "a2", "m3", "cD", "a3", "a5", "mE"],
    ["a1", "f1"],

    // south-west: x = 412 road, y = 632 road, x = 307 road
    ["a2", "h3", "g3"],
    ["h2", "h3", "v3"],
    ["h2", "g2"],

    // bottom road
    ["b0", "g2", "g3", "v4", "b2", "q2", "pe", "mB"],

    // x = 1070 road
    ["a5", "g9", "g5", "d1", "b2"],

    // G-Block thin roads
    ["p1", "p2", "p3", "g5"],
    ["p3", "p4"],

    // south of the department complex
    ["d1", "d2", "d3", "q2"],
    ["d8", "d2"],
    ["d3", "d4", "d5", "d6", "pe"],
    ["d4", "d7"],

    // staff-quarters roads
    ["s1", "r1", "r2", "r3", "r4", "J"],
    ["J", "jE"],
    ["J", "Jb", "k1", "k2", "k3", "k4", "k5", "c1", "c0", "s3"],
    ["Jb", "q1", "E1"],
    ["s2", "u1", "r2"],
    ["u1", "k5"],
    ["k1", "sp"],
    ["c1", "a3"],

    // east loop to the TSLAS gate
    ["E1", "F1", "F2", "F3", "F4", "mE"],
    ["F2", "F5", "tg"],
    ["E1", "E2"]
];

/* Roads that have the white dashed centre line on the map. Only these can
   be used by vehicles. Everything else (thin roads / lanes) is walking-only. */
const vehicleChains = [
    ["t0", "v0", "t1", "t2"],                                   // top road
    ["w1", "v1"],
    ["v0", "v1", "cr6", "v2", "cA", "m3", "v3", "v4"],          // central road
    ["t1", "s1", "s2", "s3"],                                   // road beside sports complex
    ["v2", "s3"],
    ["m0", "a1", "a2", "m3", "cD", "a3", "a5", "mE"],           // main road
    ["a1", "f1"],                                               // road beside FR hostels
    ["h3", "v3"],                                               // road above Amritam / Agira
    ["b0", "g2", "g3", "v4", "b2", "q2", "pe", "mB"],           // bottom road
    ["a5", "g9", "g5", "d1", "b2"]                              // road beside G-Block / Main Audi
];
const edgeKey = (a, b) => a < b ? a + "|" + b : b + "|" + a;
const vehicleEdgeSet = new Set();
vehicleChains.forEach(chain => {
    for (let i = 0; i < chain.length - 1; i++) vehicleEdgeSet.add(edgeKey(chain[i], chain[i + 1]));
});

const edges = [];   // [nodeA, nodeB, isVehicleRoad]
chains.forEach(chain => {
    for (let i = 0; i < chain.length - 1; i++) {
        edges.push([chain[i], chain[i + 1], vehicleEdgeSet.has(edgeKey(chain[i], chain[i + 1]))]);
    }
});

/* ---------------------------------------------------------------------
   4. GEOMETRY + ROUTING
   mode = "walk"    -> every road / lane on the map
   mode = "vehicle" -> only roads with the white dashed centre line
   --------------------------------------------------------------------- */
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

function allowedEdge(e, mode) { return mode !== "vehicle" || e[2]; }

// Closest point on any allowed road segment to point p
function nearestOnRoads(p, mode) {
    let best = null;
    edges.forEach((e, i) => {
        if (!allowedEdge(e, mode)) return;
        const A = nodes[e[0]], B = nodes[e[1]];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len2 = dx * dx + dy * dy;
        let t = len2 ? ((p.x - A.x) * dx + (p.y - A.y) * dy) / len2 : 0;
        t = Math.max(0, Math.min(1, t));
        const q = { x: A.x + t * dx, y: A.y + t * dy };
        const d = dist(p, q);
        if (!best || d < best.d) best = { edge: i, t: t, point: q, d: d };
    });
    return best;
}

// Shortest path between two free points, each attached to its nearest allowed road.
// Returns { points: [from, snapFrom, ...road..., snapTo, to], length }
function routeBetweenPoints(s, e, mode) {
    const sn = nearestOnRoads(s, mode); sn.id = "@snapS";
    const en = nearestOnRoads(e, mode); en.id = "@snapE";

    const pts = {};
    for (const k in nodes) pts[k] = nodes[k];
    pts["@S"] = s; pts["@E"] = e;
    pts[sn.id] = sn.point; pts[en.id] = en.point;

    const adj = {};
    function link(a, b) {
        const d = dist(pts[a], pts[b]);
        (adj[a] = adj[a] || []).push([b, d]);
        (adj[b] = adj[b] || []).push([a, d]);
    }

    // Split road edges where start/end attach, so both can sit on the same road
    const inserts = {};
    [sn, en].forEach(o => { (inserts[o.edge] = inserts[o.edge] || []).push(o); });

    edges.forEach((ed, i) => {
        if (!allowedEdge(ed, mode)) return;
        const list = [{ id: ed[0], t: 0 }]
            .concat((inserts[i] || []).slice().sort((p, q) => p.t - q.t))
            .concat([{ id: ed[1], t: 1 }]);
        for (let k = 0; k < list.length - 1; k++) link(list[k].id, list[k + 1].id);
    });

    link("@S", sn.id);
    link("@E", en.id);

    // Dijkstra
    const D = {}, prev = {}, done = {};
    Object.keys(adj).forEach(k => { D[k] = Infinity; });
    D["@S"] = 0;

    while (true) {
        let cur = null;
        for (const k in D) if (!done[k] && (cur === null || D[k] < D[cur])) cur = k;
        if (cur === null || D[cur] === Infinity) break;
        if (cur === "@E") break;
        done[cur] = true;
        adj[cur].forEach(([nb, d]) => {
            if (D[cur] + d < D[nb]) { D[nb] = D[cur] + d; prev[nb] = cur; }
        });
    }

    if (D["@E"] === Infinity) return null;

    const ids = [];
    for (let c = "@E"; c; c = prev[c]) ids.unshift(c);

    // Drop consecutive duplicate points
    const points = [];
    ids.forEach(id => {
        const p = pts[id];
        const last = points[points.length - 1];
        if (!last || dist(last, p) > 0.5) points.push({ x: p.x, y: p.y });
    });
    return { points: points, length: D["@E"] };
}

function pathLength(points) {
    let n = 0;
    for (let i = 0; i < points.length - 1; i++) n += dist(points[i], points[i + 1]);
    return n;
}

const LEG_MIN = 6;         // ignore a walk leg shorter than this (place is on the road)
const WALK_TAIL_MIN = 20;  // vehicle mode: shorter than this = the vehicle can get there

/* Walking route: every road and lane can be used. */
function walkRoute(s, e) {
    const r = routeBetweenPoints(s, e, "walk");
    if (!r) return null;
    const pts = r.points, n = pts.length;
    return {
        mode: "walk", start: s, end: e, points: pts,
        main: n > 2 ? pts.slice(1, n - 1) : pts,
        startLeg: n > 2 && dist(pts[0], pts[1]) >= LEG_MIN ? [pts[0], pts[1]] : null,
        endLeg:   n > 2 && dist(pts[n - 2], pts[n - 1]) >= LEG_MIN ? [pts[n - 2], pts[n - 1]] : null,
        vehicleFallback: false
    };
}

/* Main entry point.
   Returns {
     mode, start, end,
     points    - every point of the whole journey (directions / landmarks)
     main      - the highlighted part (the vehicle part when driving)
     startLeg  - dotted walk before the road   (or null)
     endLeg    - dotted walk after the road    (or null)
   } */
function computeRoute(startId, endId, mode) {
    const s = locById[startId], e = locById[endId];
    if (!s || !e) return null;
    if (mode !== "vehicle") return walkRoute(s, e);

    // vehicle: attach both places to the nearest road that has white dashes
    const sn = nearestOnRoads(s, "vehicle").point;
    const en = nearestOnRoads(e, "vehicle").point;
    const veh = routeBetweenPoints(sn, en, "vehicle");
    if (!veh || pathLength(veh.points) < 5) {
        // both places are on the same spot of the road: nothing to drive
        const w = walkRoute(s, e);
        if (w) w.vehicleFallback = true;
        return w;
    }

    // walking tails follow whatever lanes exist, from the place to the vehicle road
    const t1 = routeBetweenPoints(s, sn, "walk");
    const t2 = routeBetweenPoints(en, e, "walk");
    const startLeg = t1 && pathLength(t1.points) >= WALK_TAIL_MIN ? t1.points : null;
    const endLeg   = t2 && pathLength(t2.points) >= WALK_TAIL_MIN ? t2.points : null;

    let all = [];
    if (startLeg) all = all.concat(startLeg.slice(0, -1)); else all.push({ x: s.x, y: s.y });
    all = all.concat(veh.points);
    if (endLeg) all = all.concat(endLeg.slice(1)); else all.push({ x: e.x, y: e.y });

    return { mode: "vehicle", start: s, end: e, points: all, main: veh.points,
             startLeg: startLeg, endLeg: endLeg, vehicleFallback: false };
}

/* ---------------------------------------------------------------------
   5. TURN-BY-TURN DIRECTIONS + LANDMARKS
   --------------------------------------------------------------------- */
const COMPASS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];

function headingOf(a, b) {
    const ang = Math.atan2(b.x - a.x, -(b.y - a.y)) * 180 / Math.PI; // 0 = north, clockwise
    return (ang + 360) % 360;
}
function compassName(h) { return COMPASS[Math.round(h / 45) % 8]; }

// Steps for one list of points. makeFirst(dirHtml) builds the first step.
function turnSteps(rawPts, makeFirst) {
    // remove tiny wiggles
    const pts = [rawPts[0]];
    for (let i = 1; i < rawPts.length; i++) {
        const p = rawPts[i];
        if (dist(pts[pts.length - 1], p) >= 10) pts.push(p);
        else if (i === rawPts.length - 1) pts[pts.length - 1] = p;
    }
    if (pts.length < 2) return { steps: [], turns: 0 };

    // merge near-collinear and very short segments
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const h = headingOf(pts[i], pts[i + 1]);
        const len = dist(pts[i], pts[i + 1]);
        const last = segs[segs.length - 1];
        const turn = last ? ((h - last.heading + 540) % 360) - 180 : 0;
        if (last && (Math.abs(turn) < 22 || len < 25)) last.len += len;
        else segs.push({ heading: h, len: len });
    }

    const steps = [];
    segs.forEach((seg, i) => {
        const dir = "<b>" + compassName(seg.heading) + "</b>";
        if (i === 0) { steps.push(makeFirst(dir)); return; }
        const turn = ((seg.heading - segs[i - 1].heading + 540) % 360) - 180;
        const a = Math.abs(turn), right = turn > 0;
        let icon, text;
        if (a < 22)       { icon = "↑"; text = "Continue straight to head " + dir; }
        else if (a < 60)  { icon = right ? "↗" : "↖"; text = "Slight <b>" + (right ? "right" : "left") + "</b> to head " + dir; }
        else if (a < 135) { icon = right ? "→" : "←"; text = "Turn <b>" + (right ? "right" : "left") + "</b> to head " + dir; }
        else              { icon = right ? "↪" : "↩"; text = "Sharp <b>" + (right ? "right" : "left") + "</b> to head " + dir; }
        steps.push({ kind: "turn", icon: icon, text: text });
    });
    return { steps: steps, turns: Math.max(0, segs.length - 1) };
}

// Full directions for a route. Returns { steps, turns }.
function buildSteps(route) {
    const A = "<b>" + route.start.name + "</b>", B = "<b>" + route.end.name + "</b>";
    const arrive = { kind: "end", icon: "B", text: "Arrive at " + B };

    if (route.mode !== "vehicle") {
        const r = turnSteps(route.points, d => ({ kind: "start", icon: "A", text: "Head " + d + " from " + A }));
        r.steps.push(arrive);
        return r;
    }

    const steps = [];
    if (route.startLeg) {
        steps.push({ kind: "start", icon: "A", text: "Walk from " + A + " to the nearest main road" });
    }
    const r = turnSteps(route.main, d => route.startLeg
        ? { kind: "turn", icon: "↑", text: "Join the main road and head " + d }
        : { kind: "start", icon: "A", text: "Start at " + A + " and head " + d });
    steps.push.apply(steps, r.steps);

    if (route.endLeg) {
        steps.push({ kind: "park", icon: "P", text: "Vehicles cannot go any further. <b>Park here</b>" });
        steps.push({ kind: "walk", icon: "→", text: "Walk further to " + B + " (dotted line)" });
    }
    steps.push(arrive);
    return { steps: steps, turns: r.turns };
}

function distToSegment(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    return { d: Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)), t: t };
}

function findLandmarks(route, maxCount) {
    const found = [];
    locations.forEach(loc => {
        if (loc.id === route.start.id || loc.id === route.end.id) return;
        let bestD = Infinity, along = 0, acc = 0;
        for (let i = 0; i < route.points.length - 1; i++) {
            const a = route.points[i], b = route.points[i + 1];
            const r = distToSegment(loc, a, b);
            const segLen = dist(a, b);
            if (r.d < bestD) { bestD = r.d; along = acc + r.t * segLen; }
            acc += segLen;
        }
        if (bestD < 38) found.push({ loc: loc, d: bestD, along: along });
    });
    found.sort((a, b) => a.along - b.along);
    return found.slice(0, maxCount || 8).map(f => f.loc);
}

/* =====================================================================
   6. USER INTERFACE  (only runs in the browser)
   ===================================================================== */
if (typeof window !== "undefined" && typeof document !== "undefined") {

    const $ = id => document.getElementById(id);
    const SVG_NS = "http://www.w3.org/2000/svg";
    function svgEl(tag, attrs, parent) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const k in (attrs || {})) el.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(el);
        return el;
    }

    let layerRoads, layerMarkers, layerRoute;
    let zoom = 1;
    let pickNext = "start";
    let travelMode = "walk";   // "walk" | "vehicle"
    const ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3, 4];

    /* ---------- dropdowns ---------- */
    function populateSelects() {
        [$("startLocation"), $("endLocation")].forEach(sel => {
            sel.innerHTML = "";
            Object.keys(CATEGORIES).forEach(cat => {
                const group = document.createElement("optgroup");
                group.label = CATEGORIES[cat].label;
                locations
                    .filter(l => l.cat === cat)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(l => {
                        const o = document.createElement("option");
                        o.value = l.id;
                        o.textContent = l.name;
                        group.appendChild(o);
                    });
                sel.appendChild(group);
            });
        });
        $("startLocation").value = "main_entrance";
        $("endLocation").value = "library";
    }

    /* ---------- SVG overlay ---------- */
    function initOverlay() {
        const img = $("campusMap");
        const svg = $("routeSvg");
        const h = Math.round(MAP_W * img.naturalHeight / img.naturalWidth);
        svg.setAttribute("viewBox", "0 0 " + MAP_W + " " + h);
        svg.innerHTML = "";
        layerRoads   = svgEl("g", { id: "layerRoads" }, svg);
        layerMarkers = svgEl("g", { id: "layerMarkers" }, svg);
        layerRoute   = svgEl("g", { id: "layerRoute" }, svg);
        drawMarkers();
        if ($("toggleRoads").checked) drawRoads();
        $("toggleMarkers").dispatchEvent(new Event("change"));
        $("toggleNames").dispatchEvent(new Event("change"));
        applyDeepLink();
    }

    /* ---------- deep links from the Athena app ----------
       map.html?to=<id or place name>&from=<id or place name>&mode=walk|vehicle
       Names are matched loosely, so Athena building names ("Central Library")
       still find the right campus place ("Library"). */
    const NAME_ALIASES = {
        "computer science block": "cs_block",
        "central library": "library",
        "administrative block": "directorate",
        "admin block": "directorate",
        "mechanical block": "mech_workshop",
        "boys hostel": "hostel_pg",
        "sports complex": "sports_complex"
    };
    const normName = t => String(t || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

    function resolveLocation(q) {
        const n = normName(q);
        if (!n) return null;
        const byId = locations.find(l => l.id === String(q));
        if (byId) return byId.id;
        if (NAME_ALIASES[n]) return NAME_ALIASES[n];
        const exact = locations.find(l => normName(l.name) === n);
        if (exact) return exact.id;
        const part = locations.find(l => normName(l.name).includes(n) || n.includes(normName(l.name)));
        if (part) return part.id;
        const words = n.split(" ").filter(w => w.length > 2);
        let best = null, bestScore = 0;
        locations.forEach(l => {
            const lw = normName(l.name).split(" ");
            const score = words.filter(w => lw.includes(w)).length;
            if (score > bestScore) { best = l.id; bestScore = score; }
        });
        return best;
    }

    function applyDeepLink() {
        const qs = new URLSearchParams(window.location.search);
        const from = resolveLocation(qs.get("from"));
        const to = resolveLocation(qs.get("to"));
        if (qs.get("mode") === "vehicle") {
            travelMode = "vehicle";
            document.querySelectorAll("#modeSwitch button").forEach(b =>
                b.classList.toggle("on", b.dataset.mode === "vehicle"));
        }
        if (from) $("startLocation").value = from;
        if (to) $("endLocation").value = to;
        if (from || to) findRoute();
    }

    function drawMarkers() {
        layerMarkers.innerHTML = "";
        locations.forEach(loc => {
            const g = svgEl("g", { class: "hot", "data-id": loc.id }, layerMarkers);
            svgEl("circle", { cx: loc.x, cy: loc.y, r: 14, fill: "transparent" }, g);        // bigger hit area
            svgEl("circle", { cx: loc.x, cy: loc.y, r: 5, fill: CATEGORIES[loc.cat].color, class: "dot" }, g);
            g.addEventListener("mouseenter", e => showTip(loc, e));
            g.addEventListener("mousemove", moveTip);
            g.addEventListener("mouseleave", hideTip);
            g.addEventListener("click", () => pickLocation(loc.id));
        });
    }

    function drawRoads() {
        layerRoads.innerHTML = "";
        edges.forEach(e => {
            svgEl("line", { x1: nodes[e[0]].x, y1: nodes[e[0]].y, x2: nodes[e[1]].x, y2: nodes[e[1]].y,
                            class: "debug-road" + (e[2] ? " veh" : "") }, layerRoads);
        });
        for (const k in nodes) {
            svgEl("circle", { cx: nodes[k].x, cy: nodes[k].y, r: 4, class: "debug-node" }, layerRoads);
        }
    }

    /* ---------- tooltip ---------- */
    function showTip(loc, e) {
        const tip = $("tooltip");
        tip.innerHTML = "<b>" + loc.name + "</b><span>" + CATEGORIES[loc.cat].label + " · click to pick</span>";
        tip.classList.add("show");
        moveTip(e);
    }
    function moveTip(e) {
        const tip = $("tooltip");
        tip.style.left = (e.clientX + 14) + "px";
        tip.style.top = (e.clientY + 14) + "px";
    }
    function hideTip() { $("tooltip").classList.remove("show"); }

    /* ---------- click-to-pick on the map ---------- */
    function pickLocation(id) {
        if (pickNext === "start") {
            $("startLocation").value = id;
            clearRoute();
            $("routeResult").innerHTML = "";
            drawOrigin(locById[id], locById[id].short);          // show the picked place on the map
            setHint("Start set to <b>" + locById[id].name + "</b>. Now click your destination.");
            pickNext = "end";
        } else {
            $("endLocation").value = id;
            pickNext = "start";
            findRoute();
        }
    }
    function setHint(html) { $("routeText").innerHTML = html; }

    /* ---------- route drawing (Google-Maps style) ---------- */
    function clearRoute() {
        if (layerRoute) layerRoute.innerHTML = "";
    }

    // Label with a white rounded box (hidden by the "Show names" switch)
    function drawLabel(x, y, text) {
        const g = svgEl("g", { class: "map-label", transform: "translate(" + x + "," + y + ")" }, layerRoute);
        const rect = svgEl("rect", { rx: 4, ry: 4 }, g);
        const t = svgEl("text", { x: 0, y: 0, "text-anchor": "middle", "dominant-baseline": "central" }, g);
        t.textContent = text;
        let w = text.length * 7.4, h = 16;
        try { const b = t.getBBox(); if (b.width) { w = b.width; h = b.height; } } catch (e) { /* ignore */ }
        rect.setAttribute("x", -w / 2 - 7);
        rect.setAttribute("y", -h / 2 - 4);
        rect.setAttribute("width", w + 14);
        rect.setAttribute("height", h + 8);
    }

    function drawOrigin(p, label) {
        const g = svgEl("g", { class: "marker", transform: "translate(" + p.x + "," + p.y + ")" }, layerRoute);
        svgEl("circle", { r: 10, class: "origin-ring" }, g);
        svgEl("circle", { r: 4, class: "origin-dot" }, g);
        drawLabel(p.x, p.y - 26, label);
    }

    function drawDestination(p, label) {
        const g = svgEl("g", { class: "marker", transform: "translate(" + p.x + "," + p.y + ")" }, layerRoute);
        svgEl("path", { class: "dest-pin", d: "M0 0 C -4 -10, -15 -18, -15 -30 A15 15 0 1 1 15 -30 C 15 -18, 4 -10, 0 0 Z" }, g);
        svgEl("circle", { cx: 0, cy: -30, r: 5.5, class: "dest-dot" }, g);
        drawLabel(p.x, p.y - 54, label);
    }

    // "P" marker where a vehicle has to stop
    function drawParking(p) {
        const g = svgEl("g", { class: "marker", transform: "translate(" + p.x + "," + p.y + ")" }, layerRoute);
        svgEl("rect", { x: -11, y: -11, width: 22, height: 22, rx: 5, class: "park-box" }, g);
        const t = svgEl("text", { x: 0, y: 1, "text-anchor": "middle", "dominant-baseline": "central", class: "park-p" }, g);
        t.textContent = "P";
    }

    function drawRoute(route) {
        clearRoute();
        const toD = arr => arr.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
        const veh = route.mode === "vehicle";

        // dotted walking parts (place <-> road)
        [route.startLeg, route.endLeg].forEach(leg => {
            if (!leg) return;
            svgEl("path", { d: toD(leg), class: "leg-halo" }, layerRoute);
            svgEl("path", { d: toD(leg), class: "leg-dots" }, layerRoute);
        });

        // the highlighted route: dark-blue border + blue line (+ white dots for vehicles)
        const d = toD(route.main);
        svgEl("path", { d: d, class: "route-border" }, layerRoute);
        svgEl("path", { d: d, class: "route-line" }, layerRoute);
        if (veh) svgEl("path", { d: d, class: "route-dots" }, layerRoute);

        if (veh && route.endLeg) drawParking(route.main[route.main.length - 1]);

        const pts = route.points;
        drawOrigin(pts[0], route.start.short);
        drawDestination(pts[pts.length - 1], route.end.short);

        // NOTE: the map is deliberately NOT zoomed or scrolled here.
    }

    /* ---------- zoom ---------- */
    function setZoom(z) {
        zoom = Math.max(ZOOM_STEPS[0], Math.min(ZOOM_STEPS[ZOOM_STEPS.length - 1], z));
        $("mapContainer").style.width = (zoom * 100) + "%";
        $("zoomLabel").textContent = Math.round(zoom * 100) + "%";
        $("mapScroll").classList.toggle("zoomed", zoom > 1);
    }
    function stepZoom(dir) {
        let idx = ZOOM_STEPS.findIndex(z => z >= zoom - 0.001);
        if (idx < 0) idx = 0;
        idx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, idx + dir));
        setZoom(ZOOM_STEPS[idx]);
    }

    /* ---------- main action ---------- */
    function findRoute() {
        const startId = $("startLocation").value;
        const endId = $("endLocation").value;

        if (!startId || !endId) { setHint("Please select both locations."); return; }
        if (startId === endId) {
            clearRoute();
            $("routeResult").innerHTML = "";
            setHint("You are already at this location. Please choose a different destination.");
            return;
        }

        const route = computeRoute(startId, endId, travelMode);
        if (!route) {
            clearRoute();
            $("routeResult").innerHTML = "";
            setHint("No route available between these locations.");
            return;
        }

        drawRoute(route);
        showInfo(route);
    }

    function showInfo(route) {
        const built = buildSteps(route);
        const marks = findLandmarks(route, 8);

        setHint("<b>" + route.start.name + "</b> &nbsp;to&nbsp; <b>" + route.end.name + "</b>" +
                " &nbsp;·&nbsp; " + (route.mode === "vehicle" ? "By vehicle" : "On foot"));

        // turns over the whole journey (including any walking part)
        const turnCount = turnSteps(route.points, () => ({})).turns;
        let html = '<div class="stats"><div class="stat"><span>' + turnCount + '</span><small>' +
                   (turnCount === 1 ? 'Turn' : 'Turns') + '</small></div></div>';

        if (route.vehicleFallback) {
            html += '<div class="alert">These two places are on the same stretch of road, so no vehicle trip is needed. Please walk.</div>';
        } else if (route.mode === "vehicle" && route.endLeg) {
            html += '<div class="alert">Vehicles can only use the main roads with white dashed lines. ' +
                    'Park at the <b>P</b> marker and <b>walk further</b> along the dotted line to <b>' + route.end.name + '</b>.</div>';
        } else if (route.mode === "vehicle") {
            html += '<div class="alert">This destination can be reached entirely on vehicle roads.</div>';
        }

        if (marks.length) {
            html += '<h3>Passing by</h3><div class="chips">' +
                marks.map(m => '<span class="chip" style="--c:' + CATEGORIES[m.cat].color + '">' + m.name + '</span>').join("") +
                '</div>';
        }

        html += '<h3>Directions</h3><ol class="steps">' +
            built.steps.map(s =>
                '<li><span class="ico ' + s.kind + '">' + s.icon + '</span><span class="txt">' + s.text + '</span></li>'
            ).join("") + '</ol>';

        $("routeResult").innerHTML = html;
    }

    function setMode(mode) {
        travelMode = mode;
        document.querySelectorAll("#modeSwitch button").forEach(b => {
            b.classList.toggle("on", b.dataset.mode === mode);
        });
        // redraw only if a complete route is currently shown
        if ($("routeResult").innerHTML) findRoute();
    }

    function swapLocations() {
        const a = $("startLocation"), b = $("endLocation");
        const t = a.value; a.value = b.value; b.value = t;
        if ($("routeResult").innerHTML) findRoute();
    }

    function resetAll() {
        clearRoute();
        $("routeResult").innerHTML = "";
        setHint("Select a starting point and destination, or click two places on the map.");
        pickNext = "start";
        setZoom(1);
        $("mapScroll").scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }

    /* ---------- start-up ---------- */
    document.addEventListener("DOMContentLoaded", () => {
        populateSelects();

        $("findBtn").addEventListener("click", findRoute);
        $("swapBtn").addEventListener("click", swapLocations);
        $("resetBtn").addEventListener("click", resetAll);
        $("zoomIn").addEventListener("click", () => stepZoom(1));
        $("zoomOut").addEventListener("click", () => stepZoom(-1));
        $("zoomFit").addEventListener("click", () => setZoom(1));
        document.querySelectorAll("#modeSwitch button").forEach(b => {
            b.addEventListener("click", () => setMode(b.dataset.mode));
        });

        $("toggleMarkers").addEventListener("change", e => {
            if (layerMarkers) layerMarkers.style.display = e.target.checked ? "" : "none";
        });
        $("toggleNames").addEventListener("change", e => {
            $("routeSvg").classList.toggle("hide-names", !e.target.checked);
        });
        $("toggleRoads").addEventListener("change", e => {
            if (!layerRoads) return;
            if (e.target.checked) drawRoads(); else layerRoads.innerHTML = "";
        });

        const img = $("campusMap");
        img.addEventListener("error", () => { $("imageError").style.display = "block"; });
        if (img.complete && img.naturalWidth) initOverlay();
        else img.addEventListener("load", initOverlay);
    });
}
