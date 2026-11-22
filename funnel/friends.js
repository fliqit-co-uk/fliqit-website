/* =========================================================
   FLIQ.IT FRIENDS FUNNEL: content and screens.
   Engine, waitlist and handoff live in core.js. Every claim must be true.
   ========================================================= */
const { CONFIG, esc, wait, isoDate, nextDow, fmt, fmtLong } = Fliq;
const { USER_COUNT, EXPERT, TESTIMONIALS } = CONFIG;
const MODE = 'friends';
const track = (event, props) => Fliq.track(MODE, event, props);

const S = { name:"", gender:null, age:null, dobParts:null, a:{}, src:null, pop:{}, email:"", joined:false, handoffId:null, who:null, friend:"", exp:null, customExp:"", place:null, freq:null, recurrenceCount:8, dayLabel:"", dayDate:null, time:null, profile:null };
const E = Fliq.createEngine({ mode: MODE, S });
const { view, bindOpts, btn, ask, closeModal, next } = E;
const app = Fliq.$('#app');
const N = () => esc(S.name || "friend");
const F = () => esc(S.friend || "them");
const proofLine = () => USER_COUNT
  ? `<strong>${esc(USER_COUNT)} people</strong> are already making plans with their friends on Fliq.it`
  : `<strong>Be one of the first</strong> to plan with your friends on Fliq.it`;

/* ---------- Content ---------- */
const QUESTIONS = [
 {k:"q1", q:"When you really care about someone, how do you usually show it?", o:["I'm always checking in on them","I make time for them","I remember the little things","I'm there when they really need me","I don't always show it, but I care deeply"]},
 {k:"q2", q:"Which one sounds most like you?", o:["I have friends I'd do anything for","I have lots of friends, but only a few truly know me","I'm very close to the people in my life","I sometimes feel like I'm the one keeping friendships alive","I find it hard to let people get really close"]},
 {k:"q3", q:"Have you ever missed a friend who is still technically in your life?", o:["All the time","Yes, and it hurts","Sometimes","Not really","I hadn't thought about it until now"]},
 {k:"q4", q:"Have your friendships changed as you've gotten older?", o:["Definitely. We're not as close as we used to be","Yes, but I think that's normal","I've actually become closer to my friends","Some have changed, others haven't","I don't really know"]},
 {k:"q5", q:"What do you secretly wish you had more of in your friendships?", o:["Deeper conversations","More quality time","More spontaneity and fun","Feeling understood","Feeling like I'm a priority","More shared memories","More people I genuinely connect with"]},
 {k:"q6", q:"When life gets busy, what happens to your friendships?", o:["I make an effort to stay close","We drift until someone reaches out","I disappear and reconnect later","I worry people will forget about me","I find it hard to balance everyone","They're usually the first thing I sacrifice"]},
 {k:"q7", q:"Which would hurt you more?", o:["Realising you've grown apart from someone you love","Feeling like you never had people you could truly rely on","Having lots of people around but still feeling misunderstood","Looking back and realising you didn't make enough memories together"]},
 {k:"q8", q:"Think about your closest friendship. Which feels most true?", o:["They know the real me","We don't talk all the time, but we're always there","I wish we were closer","I put more into this friendship than they do","We've grown so much together","I don't know if we're as close as I think"]},
 {k:"q9", q:"When did you last feel genuinely connected to a friend?", o:["This week","This month","A few months ago","More than 6 months ago","I honestly can't remember"]},
 {k:"q10", q:"If nothing changed about your friendships over the next year, how would you feel?", o:["Completely happy","A little sad","Disappointed","Lonely","Like I was missing out","I don't think I'd be okay with that"]}
];

const PROFILES = {
  deep:{name:"The Deep Connector", need:"More depth", line:"You don't need lots of people. You need your people.",
    insight:"You don't want more friends. You want to feel properly known by the ones you have, and to know them back. Surface-level catch-ups leave you a little empty. That isn't too much to ask. It just needs time set aside for it."},
  reconnect:{name:"The Reconnector", need:"More consistency", line:"You don't stop caring. Life just gets in the way.",
    insight:"You haven't stopped caring about your friendships. You've stopped making space for them. You still think about them, and you still say “we really need to catch up”. Then months pass, and you end up missing someone who is technically still in your life. Your friendship may not need fixing. It may just need to be put back in the diary."},
  heart:{name:"The Heart Friend", need:"Reciprocity", line:"If your friend needs you, you're there.",
    insight:"You show up without being asked twice, and people know they can count on you. But you're so used to giving that you rarely get poured back into. The friendships that will feel best to you are the ones where the effort goes both ways."},
  keeper:{name:"The Friendship Keeper", need:"Shared effort", line:"Someone has to keep everyone together.",
    insight:"You remember the birthdays, start the group chat and make the plans. It works, but carrying everyone gets quietly tiring. The friendships that last are the ones where someone else picks up the thread too."},
  memory:{name:"The Memory Maker", need:"More experiences", line:"Friendship should be lived, not just talked about.",
    insight:"Texting isn't enough for you. You want dinners, days out and the stories you'll still be telling in ten years. Your friendships come alive when you're doing things together, so the fix is simple: do more things together."},
  independent:{name:"The Independent Friend", need:"Intentionality", line:"You don't need constant contact to feel close.",
    insight:"You can go weeks without talking and still feel close, and that's a strength. The catch is that weeks quietly turn into months. A little intention, on your terms, turns “we should catch up” into a date."}
};

/* Before / after pairs: [now title, now detail, then title, then detail] */
const BA = {
  deep:[["Small talk","Catch-ups that stay on the surface","Real conversations","Time set aside to go deep"],["Feeling unknown","Even with people around","Truly known","By the people who matter"],["Waiting for the moment","It rarely comes","Making the moment","A plan that's already set"]],
  reconnect:[["“We should catch up”","Said often, rarely booked","A date in the diary","Every single week"],["Months between plans","Without meaning to","A real rhythm","Small plans that keep happening"],["Missing them quietly","Though they're still in your life","Seeing them again","And it feels easy"]],
  heart:[["Always giving","Rarely poured back into","Effort both ways","Plans that look after you too"],["Last on your own list","Everyone else comes first","Your needs count","Plans you actually enjoy"],["Quietly tired","From carrying the care","Feeling held","By people who show up for you"]],
  keeper:[["Doing it all","Chasing every plan","Shared effort","Friends who pick up the thread"],["Group-chat admin","Endless back and forth","Plans that land","One tap and it's set"],["Running on empty","Keeping everyone close","Enjoying it again","Plans you look forward to"]],
  memory:[["Same old plans","Or none at all","Something new","A regular plan, not a rare one"],["Stories fading","The last great day was ages ago","New memories","You'll still talk about in years"],["Ideas left in a note","Never actually booked","Booked and happening","With a date attached"]],
  independent:[["Weeks become months","Without noticing","Gentle rhythm","Light plans on your terms"],["Out of the loop","Catching up on everything","In each other's lives","Without constant texting"],["Meaning to reach out","But not yet","Already planned","So you don't have to remember"]]
};

/* The reveal. Each type gets a strength (feels good), a blind spot (stings, feels true),
   the cost of doing nothing, and three Fliq.it features that fix that exact blind spot. */
const REVEAL = {
  deep:{
    strength:"People feel safe with you. When you're in, you're all in.",
    blind:"You wait for the right moment to have a real conversation, and it rarely comes. So even your closest friends mostly get the surface version of you.",
    cost:"Friends who know your news, but not what's actually on your mind.",
    fix:[["Plans made for talking","Journal nights, long walks and phone-free coffees, suggested for you."],["One-to-ones on repeat","Set a rhythm once so depth stops depending on luck."],["A real date","A day and a time, so the deep chat actually happens."]]},
  reconnect:{
    strength:"You never stop caring. When you do see people, you pick up exactly where you left off.",
    blind:"“We should catch up” might be your most-sent message. It's a promise with no date, and promises with no date don't happen.",
    cost:"Someone who's still technically in your life slowly becomes someone you used to know.",
    fix:[["Recurring plans","Set it once. Coffee with Sarah, every Sunday, done."],["A date, not a “soon”","Every plan gets a real day, time and place."],["Copy an invite","Send a message they can reply to, without the group-chat chase."]]},
  heart:{
    strength:"You're the one people call. You remember the little things and you always show up.",
    blind:"You rarely ask for the same back. People don't know you need them, because you never say.",
    cost:"Holding everyone up, and feeling quietly alone while you do it.",
    fix:[["Plans you enjoy too","Choose something that fills you up, not just them."],["Ask for the same back","Put a plan in the diary that looks after you as well."],["Shared plans","Effort that goes both ways, visible to both of you."]]},
  keeper:{
    strength:"Without you, half these friendships would have faded years ago.",
    blind:"You've become the group's unpaid admin, and nobody notices because it works. If you stopped, would anyone else plan?",
    cost:"Resentment builds quietly, and the person who holds everyone together burns out first.",
    fix:[["Plans that land","A real date and place, not endless back and forth."],["Plans that repeat themselves","Set the ritual once and stop chasing."],["Share the load","Invite them into the plan so it isn't only on you."]]},
  memory:{
    strength:"You make life more fun. You're the reason people have stories.",
    blind:"You wait for the big plan. In between, weeks pass with nothing, and your best ideas live in a notes app and never get booked.",
    cost:"Your favourite stories keep getting older.",
    fix:[["Book the idea","Turn the notes-app list into a day and a time."],["Ideas worth booking","New places and firsts, picked for the two of you."],["A rhythm for adventure","Small plans every week, so it's not one big trip a year."]]},
  independent:{
    strength:"Low-maintenance and loyal. Your friendships survive gaps that would end others.",
    blind:"You assume they're fine because you're fine. The gap that feels short to you can feel long to them.",
    cost:"Friends slowly stop including you, and you don't notice until you do.",
    fix:[["A gentle rhythm","Once a month is enough. Set it and forget it."],["A light nudge","A reminder for you the day before, so the gap doesn't stretch."],["Low-pressure plans","A call or a walk. No big evening required."]]}
};

const EXPERIENCES = {
  coffee:{t:"Coffee, phones away", d:"An hour to properly catch up.", h:1.5, p:"out"},
  walk:{t:"Walk and talk", d:"Somewhere new, nowhere to rush to.", h:2, p:"out"},
  dinner:{t:"Dinner somewhere new", d:"Turn a meal into a memory.", h:2.5, p:"out"},
  journal:{t:"Journal night", d:"Write, reflect, then share what came up.", h:2, p:"online"},
  create:{t:"Make something together", d:"Pottery, painting, a class for two.", h:2.5, p:"out"},
  movie:{t:"Movie night", d:"Cosy, easy, zero planning stress.", h:3, p:"home"},
  wine:{t:"Wine night", d:"Good food, long conversation.", h:3, p:"home"},
  call:{t:"Long catch-up call", d:"Video on, an hour, no multitasking.", h:1, p:"online"},
  first:{t:"A first for both of you", d:"Something neither of you has done.", h:3, p:"out"}
};
const RECS = { deep:["journal","coffee","walk"], reconnect:["coffee","dinner","call"], heart:["dinner","wine","journal"], keeper:["first","create","wine"], memory:["first","create","dinner"], independent:["walk","call","journal"] };
const PLACE_TYPES = {
  out:{t:"Out somewhere", d:"A café, restaurant, park or venue."},
  home:{t:"At home", d:"Yours or theirs."},
  online:{t:"Online", d:"Video call, wherever you both are."}
};
/* recurrence: matches what the app stores. rrule follows the iCalendar standard. */
const FREQS = {
  once:{t:"Just this once", short:"One time", rrule:null, every:0},
  weekly:{t:"Every week", short:"Weekly", rrule:"FREQ=WEEKLY;INTERVAL=1", every:1},
  monthly:{t:"Every month", short:"Monthly", rrule:"FREQ=MONTHLY;INTERVAL=1", every:4}
};
const expT = () => S.exp==='custom' ? (S.customExp || 'Your plan') : EXPERIENCES[S.exp || 'coffee'].t;
const expH = () => S.exp==='custom' ? 2 : EXPERIENCES[S.exp || 'coffee'].h;
const placeLabel = () => { const p=S.place; if(!p) return ''; if(p.type==='online') return p.name ? 'Online · '+p.name : 'Online'; return p.name || PLACE_TYPES[p.type].t; };
/* Energy the plan asks for, in the app's own vocabulary (low | mid | high). */
const ENERGY = { coffee:'low', walk:'mid', dinner:'mid', journal:'low', create:'mid', movie:'low', wine:'low', call:'low', first:'high' };

/* Analytics: categories only. No names, no free text (custom plan / place names stay out). */
function planPayload(){
  const f = FREQS[S.freq||'once'];
  return { mode:'friends', activity: S.exp, place_type: S.place ? S.place.type : null, recurrence: S.freq || 'once', rrule: f.rrule,
    friend_type: S.profile, who: S.who, age_range: S.age, has_date: !!S.dayDate };
}

/* The HANDOFF: everything the app needs to create this plan after install. See README "Funnel handoff".
   The friend is a name only (not on Fliqit yet). Plan is organizer-only; invite is copy/share until they join. */
function handoff(){
  const f = FREQS[S.freq||'once'], d = S.dayDate ? isoDate(S.dayDate) : null;
  const custom = S.exp === 'custom';
  return Fliq.buildHandoff(S, {
    funnel: { id:'friend_type', mode:'friends' },
    profile: { type: S.profile, name: S.profile ? PROFILES[S.profile].name : null },
    user: { first_name: S.name || null, age_range: S.age || null },
    invitee: { first_name: S.friend || null, relationship: S.who || null, on_fliq: false },
    plan: {
      mode: 'friends',
      title: expT(),
      activity: custom ? 'custom' : S.exp,
      place: { type: S.place ? S.place.type : null, name: S.place ? S.place.name : null },
      start_date: d, start_time: S.time || null,
      start_at: d && S.time ? d + 'T' + S.time : null,      // local wall-clock time, interpret with `timezone`
      duration_minutes: Math.round(expH() * 60),
      energy: custom ? 'mid' : ENERGY[S.exp],
      recurrence: S.freq || 'once', rrule: f.rrule,
      recurrence_count: (S.freq && S.freq !== 'once') ? (S.recurrenceCount || 8) : null,
      invite_message: inviteText(),
    },
    reminders: { day_before: !!S.pop.p3 },
  });
}
/* Save the latest handoff locally. Called whenever something it contains changes. */
function commit(){ if(S.dayDate && S.time && S.place && S.name && S.friend){ const h = handoff(); Fliq.saveHandoff(h); return h; } return null; }
function nextDates(n){
  const out=[]; if(!S.dayDate) return out; const f=FREQS[S.freq||'once'];
  for(let k=0;k<n;k++){ const d=new Date(S.dayDate); if(S.freq==='monthly') d.setMonth(d.getMonth()+k); else d.setDate(d.getDate()+7*f.every*k); out.push(d); if(!f.every) break; }
  return out;
}
/* Check-in prompts for a recurring friends plan (skipped for one-off). {f} = friend's name. */
const WEEKS = [
  ["The first yes","The plan you just made."],
  ["Somewhere new","Go somewhere neither of you has been."],
  ["Go deeper","A plan made for talking properly."],
  ["Keep it easy","A low-effort plan for a busy week."],
  ["Make a memory","Something you'll want a photo of."],
  ["Same ritual","Back to what works for you both."],
  ["Stretch it","Try a slightly bigger plan."],
  ["Make it yours","Choose the rhythm you'll keep going."]
];
const WHO = ["My best friend","An old friend","Someone I haven't seen in a while","Someone I'd like to get closer to","Someone else I care about"];

/* ---------- Scoring (all derived from the person's own answers) ---------- */
function pickProfile(){
  const c = {reconnect:0, deep:0, heart:0, keeper:0, memory:0, independent:0};
  const map = {
    q1:["keeper","memory","heart","heart","independent"],
    q2:["heart","deep","memory","keeper","independent"],
    q3:["reconnect","deep","reconnect","independent","independent"],
    q4:["reconnect","independent","memory","keeper","independent"],
    q5:["deep","reconnect","memory","deep","heart","memory","keeper"],
    q6:["keeper","reconnect","independent","heart","keeper","reconnect"],
    q7:["reconnect","heart","deep","memory"],
    q8:["deep","independent","reconnect","keeper","memory","reconnect"],
    q9:["keeper","memory","reconnect","independent","reconnect"],
    q10:["independent",null,null,null,null,null]
  };
  const weight = {q5:1.5, q7:1.5};
  for(const k in map){ const v = S.a[k]; if(v!==undefined && map[k][v]) c[map[k][v]] += (weight[k] || 1); }
  const max = Math.max(...Object.values(c));
  const tied = Object.keys(c).filter(k => c[k]===max);
  if(tied.length===1) return tied[0];
  // Tie-break on what they want most (q5), then what they fear most (q7)
  for(const k of ["q5","q7"]){ const t = S.a[k]!==undefined ? map[k][S.a[k]] : null; if(t && tied.includes(t)) return t; }
  return tied[0];
}
function driftScore(){ // 0..1
  let s = 0;
  s += [0,1,2,3,4][S.a.q9 ?? 1];
  s += [2,2,1,0,1][S.a.q3 ?? 2];
  s += [2,0,0,1,1][S.a.q4 ?? 1];
  s += [0,2,2,1,1,2][S.a.q6 ?? 1];
  if(S.pop.p1) s += 1;
  return Math.min(1, s/11);
}
const driftLevel = v => v < .34 ? "Low" : v < .67 ? "Medium" : "High";
function readiness(){
  let r = 58 + [0,10,14,18,20,24][S.a.q10 ?? 1] + [8,8,4,0,2][S.a.q3 ?? 2];
  if(S.pop.p2) r += 5; if(S.pop.p3) r += 4;
  return Math.min(96, r);
}
// Hours together if things stay as they are, from "when did you last feel connected"
function baselineWeekly(){ return [1.5, 0.5, 0.15, 0.05, 0][S.a.q9 ?? 1]; }

/* ---------- Dates ---------- */

function ageRange(dt){
  const t = new Date(); let a = t.getFullYear() - dt.getFullYear();
  if(t.getMonth() < dt.getMonth() || (t.getMonth()===dt.getMonth() && t.getDate() < dt.getDate())) a--;
  return a < 18 ? 'Under 18' : a <= 20 ? '18–20' : a <= 24 ? '21–24' : a <= 29 ? '25–29' : a <= 34 ? '30–34' : '35+';
}
const isOnce = () => (S.freq || 'once') === 'once';
function skipIfOnce(fn){
  const wrapped = function(){ if(isOnce()){ next(); return; } return fn(); };
  Object.defineProperty(wrapped, 'name', { value: fn.name || 'screen' });
  return wrapped;
}

function ageGate(){
  const yNow = new Date().getFullYear();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const P = S.dobParts || {};
  const opt = (v, t, cur) => `<option value="${v}"${String(cur)===String(v)?' selected':''}>${t}</option>`;
  view(`
    <div class="eyebrow">Before your results</div>
    <h1>Confirm you're <em>18 or over</em>.</h1>
    <p class="lede">Fliq.it is for adults. We use your date of birth to check your age, then only keep an age range — never the full date.</p>
    <div class="eyebrow" style="margin-top:4px">Date of birth</div>
    <div class="dob">
      <select id="dd" aria-label="Day" autocomplete="bday-day">${opt('','Day',P.d)}${Array.from({length:31},(_,i)=>opt(i+1,i+1,P.d)).join('')}</select>
      <select id="dm" aria-label="Month" autocomplete="bday-month">${opt('','Month',P.m)}${months.map((m,i)=>opt(i+1,m,P.m)).join('')}</select>
      <select id="dy" aria-label="Year" autocomplete="bday-year">${opt('','Year',P.y)}${Array.from({length:78},(_,i)=>opt(yNow-13-i,yNow-13-i,P.y)).join('')}</select>
    </div>
    <p class="err" id="dobErr" hidden></p>
    <div class="grow"></div>
    <button class="btn" id="go" disabled>Continue</button>`);
  const g = document.getElementById('go'), err = document.getElementById('dobErr');
  const dd = document.getElementById('dd'), dm = document.getElementById('dm'), dy = document.getElementById('dy');
  const dob = () => { const d=+dd.value, m=+dm.value, y=+dy.value; if(!d||!m||!y) return null; const dt = new Date(y, m-1, d, 12); return dt.getMonth()===m-1 ? dt : 'bad'; };
  let blockedLogged = false;
  const ready = () => {
    const v = dob(), bad = v === 'bad', young = !!v && !bad && ageRange(v) === 'Under 18';
    err.hidden = !(bad || young);
    err.textContent = young ? "Fliq.it is for people aged 18 and over, so we can't continue." : "That date doesn't exist. Check the day and month.";
    if(young){ S.age = null; S.dobParts = null; Fliq.clearHandoff(); if(!blockedLogged){ blockedLogged = true; track('under_18_blocked'); } }
    g.disabled = !(v && !bad && !young);
  };
  [dd,dm,dy].forEach(el => el.onchange = ready);
  ready();
  g.onclick = () => {
    const v = dob();
    if(!v || v === 'bad' || ageRange(v) === 'Under 18') return;
    S.dobParts = {d:dd.value, m:dm.value, y:dy.value};
    S.age = ageRange(v);
    track('age_confirmed', {age_range: S.age});
    next();
  };
}

/* ---------- Steps ---------- */
const add = E.add;
add(-1, landing);
QUESTIONS.forEach((q,i) => {
  add(0, () => question(q, i), {name:'question_'+(i+1)});
  if(i===3) add(0, () => pause("You're doing great.", "Six more questions and your friendship profile is ready. Answer with your gut. There are no right answers."));
  if(i===6) add(0, research);
});
add(0, sourceStep);
if(EXPERT) add(0, expertStep);
if(TESTIMONIALS.length) add(0, wallStep);
add(1, ringLoader, {transient:true, name:'ring_loader'});
add(1, ageGate, {name:'age_gate'});
add(1, emailGate, {name:'email_gate'});
add(1, summary);
add(1, insight);
add(1, beforeAfter);
add(1, needs);
add(2, () => single("Who do you want to grow closer to?", "Pick one person. Your plan works best when it's about someone specific.", WHO, v=>{S.who=v}));
add(2, friendStep, {name:'friend_name'});
add(2, experienceStep);
add(2, placeStep);
add(2, whenStep);
add(2, freqStep);
add(2, skipIfOnce(countStep), {name:'recurrence_count'});
add(2, lockIn);
add(2, buildPlan, {transient:true, name:'build_plan'});
add(2, skipIfOnce(challengeReady), {name:'recurrence_ready'});
add(2, skipIfOnce(weekGrid), {name:'checkin_preview'});
add(2, planReady);
add(2, appStep, {name:'waitlist'});



/* ---------- Screens ---------- */
function landing(){
  view(`
    <div class="eyebrow">60-second friendship quiz</div>
    <h1>Which of the <em>six friend types</em> are you?</h1>
    <p class="lede">Life gets busy, and the people we love slowly become people we mean to see. Answer ten quick questions to find your friend type, what your friendships are missing, and a first plan to fix it this week.</p>
    <div class="types" aria-label="The six friend types">
      <span>The Reconnector</span><span>The Heart Friend</span><span>The Memory Maker</span>
      <span class="q">The Deep ? ? ?</span><span class="q">The Friendship ? ? ?</span><span class="q">The Independent ? ? ?</span>
    </div>
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    <button class="btn" id="go">Find my friend type</button>
    ${E.resumeBlock()}
    <p class="fine">Free. No sign-up needed to see your result.</p>`);
  btn('go', () => { track('quiz_start'); next(); });
  E.bindResume();
}


function single(title, sub, opts, set){
  view(`<h1>${title}</h1>${sub?`<p class="lede">${sub}</p>`:''}<div class="opts">${opts.map(o=>`<button class="opt">${esc(o)}</button>`).join('')}</div>`);
  bindOpts(i => set(opts[i]));
}

function question(q, i){
  view(`<div class="qcount">Question ${i+1} of ${QUESTIONS.length}</div><h1>${q.q}</h1><div class="opts">${q.o.map(o=>`<button class="opt">${esc(o)}</button>`).join('')}</div>`);
  bindOpts(v => { S.a[q.k] = v; track('quiz_answer',{q:q.k, a:v}); }, S.a[q.k]);
}

function pause(title, body){
  view(`<div class="grow"></div><div class="eyebrow">Progress saved</div><h1>${title}</h1><p class="lede">${body}</p><div class="grow"></div><button class="btn" id="go">Keep going</button>`);
  btn('go', next);
}

/* Authority screen, built on published research instead of borrowed logos */
function research(){
  view(`
    <div class="eyebrow">Why this matters</div>
    <h1>Friendships are built with <em>time together</em>.</h1>
    <div class="fact">
      <div class="big">200</div>
      <p>Roughly how many hours together it takes to turn someone into a close friend.</p>
      <cite>Jeffrey Hall, University of Kansas. Journal of Social and Personal Relationships, 2019.</cite>
    </div>
    <div class="fact">
      <p>When friends stop seeing each other, emotional closeness fades, and it fades faster for friends than for family.</p>
      <cite>Roberts &amp; Dunbar, University of Oxford. Personal Relationships, 2011.</cite>
    </div>
    <p class="lede">That's why Fliq.it focuses on one thing: getting real plans in the diary.</p>
    <div class="grow"></div>
    <button class="btn" id="go">Three questions left</button>`);
  btn('go', next);
}

function sourceStep(){
  single("Last one. How did you find us?", "It helps us reach more people like you.", ["TikTok","Instagram","A friend sent it to me","Somewhere else"], v => { S.src=v; track('attribution',{src:v}); });
}

function expertStep(){
  view(`
    <div class="eyebrow">Reviewed by an expert</div>
    <h1>Your plan is shaped by people who study connection.</h1>
    <div class="expert"><div class="av">${esc(EXPERT.name.charAt(0))}</div><div><b>${esc(EXPERT.name)}</b><span>${esc(EXPERT.role)}</span></div></div>
    ${EXPERT.quote?`<div class="panel"><p>“${esc(EXPERT.quote)}”</p></div>`:''}
    <div class="grow"></div><button class="btn" id="go">Continue</button>`);
  btn('go', next);
}

function wallStep(){
  view(`
    <div class="eyebrow">From the Fliq.it community</div>
    <h1>What people say after their first plan</h1>
    ${TESTIMONIALS.slice(0,3).map(t=>`<div class="quote"><p>“${esc(t.text)}”</p><span>${esc(t.name)}</span></div>`).join('')}
    <div class="grow"></div><button class="btn" id="go">Continue</button>`);
  btn('go', next);
}

/* Ring loader with two mid-load questions */
async function ringLoader(){
  const id = E.nextRun();
  const R = 88, C = 2*Math.PI*R;
  view(`
    <div class="grow"></div>
    <div class="eyebrow" style="text-align:center">Building your profile</div>
    <div class="ringwrap">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="${R}" fill="none" stroke="var(--line)" stroke-width="8"/>
        <circle id="arc" cx="100" cy="100" r="${R}" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
      </svg>
      <span class="pct" id="pct">0%</span>
    </div>
    <div class="ringlabel" id="rl">Reading your answers</div>
    <div class="grow"></div>`);
  const arc = document.getElementById('arc'), pct = document.getElementById('pct'), rl = document.getElementById('rl');
  const set = v => { arc.style.strokeDashoffset = C*(1-v/100); pct.textContent = Math.round(v)+'%'; };
  const run = async (from, to, ms, label) => {
    rl.textContent = label; const t0 = performance.now();
    while(true){ if(id!==E.runId()) return false; const k = Math.min(1,(performance.now()-t0)/ms); set(from+(to-from)*k); if(k>=1) return true; await wait(30); }
  };
  if(!await run(0,38,1500,"Reading your answers")) return;
  await ask(`Do you often say “we should catch up” and then it doesn't happen?`, 'p1'); if(id!==E.runId()) return;
  if(!await run(38,74,1500,"Mapping how you connect")) return;
  await ask("Would having a set day for seeing a friend make it easier?", 'p2'); if(id!==E.runId()) return;
  if(!await run(74,100,1200,"Matching you to a friend type")) return;
  S.profile = pickProfile();
  track('quiz_complete',{profile:S.profile});
  await wait(400); if(id===E.runId()) next();
}

function emailGate(){
  view(`
    <div class="eyebrow">Your results are ready</div>
    <h1>Want us to <em>keep your results</em> for launch?</h1>
    <p class="lede">Fliq.it isn't in the App Store yet. Join the early-access list and we'll email you the day it opens. Your results are ready either way.</p>
    <label class="field" for="email">Email<input type="email" id="email" autocomplete="email" inputmode="email" placeholder="you@example.com" value="${esc(S.email)}"></label>
    <p class="err" id="err" hidden></p>
    <button class="btn" id="go">Join the list and show my profile</button>
    <button class="btn ghost" id="skip">Show my profile without joining</button>
    <p class="fine">By joining, you agree we can email you about the launch. See our <a href="${CONFIG.PRIVACY_URL}" target="_blank" rel="noopener">privacy policy</a>.</p>`);
  const i = document.getElementById('email'), err = document.getElementById('err'), go = document.getElementById('go');
  if(S.joined){ go.textContent = 'Show my profile'; }
  go.onclick = async () => {
    if(S.joined){ next(); return; }
    if(await Fliq.submitEmail(S, i, err, go, MODE)){ track('lead_captured', {profile:S.profile, at:'gate'}); next(); }
  };
  btn('skip', () => { track('lead_skipped'); next(); });
}

/* Profile summary: type + drift meter + readiness */
function summary(){
  const p = PROFILES[S.profile], d = driftScore(), lvl = driftLevel(d), r = readiness();
  view(`
    <div class="reveal">
      <div class="eyebrow">Your friend type is</div>
      <div class="seal">${p.name.replace('The ','').charAt(0)}</div>
      <h2>${p.name}</h2>
      <blockquote>“${p.line}”</blockquote>
    </div>
    <div class="panel">
      <div class="meterhead"><b>Drift risk</b><span class="pill ${lvl}">${lvl}</span></div>
      <div class="meter"><i id="mk" style="left:0%"></i></div>
      <div class="meterscale"><span>Low</span><span>Medium</span><span>High</span></div>
      <p>${lvl==='High' ? "Based on your answers, some of your friendships are quietly slipping. The good news: drift reverses fast once plans are back in the diary." : lvl==='Medium' ? "Some friendships are getting less of your time than you'd like. A small, regular plan is usually all it takes." : "Your friendships are in good shape. A regular plan keeps them that way."}</p>
    </div>
    <div class="ready">
      <h3 style="margin:0;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent)">Ready to reconnect</h3>
      <div class="big" id="rd">0%</div>
      <p>Your answers show you care a lot. The effort is there, it just needs somewhere to go. That's the part we'll help with.</p>
    </div>
    <p class="fine">Scores are based on your answers in this quiz.</p>
    <div class="grow"></div>
    <button class="btn" id="go">Read my profile</button>`);
  requestAnimationFrame(()=> setTimeout(()=>{ const mk=document.getElementById('mk'); if(mk) mk.style.left = Math.round(8+d*84)+'%'; }, 60));
  const rd = document.getElementById('rd'); let v=0; const t=setInterval(()=>{ v=Math.min(r,v+3); if(!document.body.contains(rd)) return clearInterval(t); rd.textContent=v+'%'; if(v>=r) clearInterval(t); }, 24);
  btn('go', next);
}

function insight(){
  const p = PROFILES[S.profile], r = REVEAL[S.profile];
  view(`
    <div class="eyebrow">${p.name}</div>
    <h1>What your answers say about you</h1>
    <div class="panel"><p>${p.insight}</p></div>
    <div class="panel"><h3>Your strength</h3><p>${r.strength}</p></div>
    <div class="panel blind"><h3>Your blind spot</h3><p>${r.blind}</p></div>
    <div class="grow"></div>
    <button class="btn" id="go">What could change?</button>`);
  btn('go', next);
}

function beforeAfter(){
  const rows = BA[S.profile];
  view(`
    <div class="eyebrow">If nothing changes</div>
    <h1>${REVEAL[S.profile].cost}</h1>
    <p class="lede">It doesn't have to go that way. Here's where a regular plan could take you.</p>
    <div class="ba">
      <div class="now"><h3>You now</h3><ul>${rows.map(r=>`<li><b>${r[0]}</b><span>${r[1]}</span></li>`).join('')}</ul></div>
      <div class="then"><h3>You with Fliq.it</h3><ul>${rows.map(r=>`<li><b>${r[2]}</b><span>${r[3]}</span></li>`).join('')}</ul></div>
    </div>
    <div class="grow"></div>
    <button class="btn" id="go">Show me how</button>`);
  btn('go', next);
}

function needs(){
  const p = PROFILES[S.profile], r = REVEAL[S.profile], type = p.name.replace('The ','');
  view(`
    <div class="eyebrow">Built for ${type}s</div>
    <h1>How Fliq.it fixes <em>your blind spot</em></h1>
    <ul class="list">${r.fix.map((f,i)=>`<li><span class="n">${i+1}</span><div><b>${f[0]}</b><span>${f[1]}</span></div></li>`).join('')}</ul>
    <div class="panel"><p>Knowing your type changes nothing on its own. So let's book your first plan right now. It takes under a minute.</p></div>
    <div class="grow"></div>
    <button class="btn" id="go">Build my first plan</button>`);
  btn('go', () => { track('plan_start'); next(); });
}

function friendStep(){
  view(`
    <div class="eyebrow">Your person</div>
    <h1>What's their name?</h1>
    <p class="lede">We'll build the plan around the two of you.</p>
    <label class="field" for="friend">Their first name<input type="text" id="friend" placeholder="e.g. Sarah" value="${esc(S.friend)}"></label>
    <div class="grow"></div>
    <button class="btn" id="go" ${S.friend?'':'disabled'}>Continue</button>`);
  const i = document.getElementById('friend'), b = document.getElementById('go');
  i.oninput = () => b.disabled = !i.value.trim();
  i.onkeydown = e => { if(e.key==='Enter' && i.value.trim()) b.click(); };
  b.onclick = () => { S.friend = i.value.trim().split(' ')[0]; next(); };
  setTimeout(()=>i.focus(), 50);
}

function experienceStep(){
  const rec = RECS[S.profile];
  const order = rec.concat(Object.keys(EXPERIENCES).filter(k=>!rec.includes(k))).slice(0,7);
  const p = PROFILES[S.profile];
  view(`
    <div class="eyebrow">Take action today</div>
    <h1>Set your first plan to reconnect with <em>${F()}</em>.</h1>
    <p class="lede">Ranked for ${p.name.replace('The ','')}s. Pick one, or name your own.</p>
    <div class="opts">${order.map((k,i)=>`<button class="opt"><span>${EXPERIENCES[k].t}${i===0?'<span class="tag">Best fit</span>':''}<small>${EXPERIENCES[k].d}</small></span></button>`).join('')}</div>
    <label class="field" for="custom">Something else<input type="text" id="custom" maxlength="40" placeholder="e.g. Book club, gym session" value="${esc(S.customExp)}"></label>
    <button class="btn" id="go" ${S.exp==='custom' && S.customExp ? '' : 'hidden'}>Use this plan</button>`);
  bindOpts(i => { S.exp = order[i]; track('plan_experience',{exp:S.exp}); }, S.exp && S.exp!=='custom' ? order.indexOf(S.exp) : -1);
  const c = document.getElementById('custom'), g = document.getElementById('go');
  c.oninput = () => { g.hidden = !c.value.trim(); };
  c.onkeydown = e => { if(e.key==='Enter' && c.value.trim()) g.click(); };
  g.onclick = () => { S.exp = 'custom'; S.customExp = c.value.trim(); track('plan_experience',{exp:'custom', name:S.customExp}); next(); };
}

/* WHERE: in person, at home or online */
function placeStep(){
  const sug = S.exp==='custom' ? null : EXPERIENCES[S.exp || 'coffee'].p;
  const st = S.place ? {type:S.place.type, name:S.place.name} : {type:null, name:""};
  view(`
    <div class="eyebrow">Where</div>
    <h1>Where will you and ${F()} meet?</h1>
    <p class="lede">In person, at home or online. They all count.</p>
    <div class="opts">${Object.entries(PLACE_TYPES).map(([k,v])=>`<button class="opt pt" data-k="${k}"><span>${v.t}${k===sug?'<span class="tag">Suggested</span>':''}<small>${v.d}</small></span></button>`).join('')}</div>
    <div id="pdetail"></div>
    <div class="grow"></div>
    <button class="btn" id="go" disabled>Continue</button>`);
  const det = document.getElementById('pdetail'), go = document.getElementById('go');
  const ok = () => { go.disabled = !(st.type && (st.type==='online' || st.name)); };
  const chips = arr => `<div class="chips" id="pc">${arr.map(a=>`<button class="chip${st.name===a?' sel':''}">${esc(a)}</button>`).join('')}</div>`;
  const draw = focus => {
    if(st.type==='out'){
      det.innerHTML = `<label class="field" for="pname">Name the place<input type="text" id="pname" maxlength="60" placeholder="e.g. Gail's Bakery, Notting Hill" value="${esc(st.name)}"></label><p class="fine" style="text-align:left;margin-top:8px">You can change it later in the app.</p>`;
      const i = document.getElementById('pname'); i.oninput = () => { st.name = i.value.trim(); ok(); }; if(focus) i.focus();
    } else if(st.type==='home'){
      det.innerHTML = chips(["My place", (S.friend || 'Their') + "'s place"]);
    } else if(st.type==='online'){
      det.innerHTML = `<div class="eyebrow" style="margin-bottom:10px">On which app? Optional</div>` + chips(["FaceTime","WhatsApp video","Zoom","Google Meet"]);
    } else det.innerHTML = '';
    det.querySelectorAll('#pc .chip').forEach(c => c.onclick = () => { det.querySelectorAll('#pc .chip').forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); st.name = c.textContent; ok(); });
    ok();
  };
  app.querySelectorAll('.pt').forEach(b => {
    if(b.dataset.k===st.type) b.classList.add('sel');
    b.onclick = () => { app.querySelectorAll('.pt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); if(st.type!==b.dataset.k){ st.type = b.dataset.k; st.name = ""; } draw(true); };
  });
  draw(false);
  go.onclick = () => { S.place = {type:st.type, name: st.name || (st.type==='online' ? 'Video call' : '')}; track('plan_place',{type:S.place.type}); next(); };
}

function calendarHTML(){
  return `<div class="cal"><div class="cal-head"><button class="cal-nav" id="cprev" aria-label="Previous month">‹</button><b id="cmon"></b><button class="cal-nav" id="cnext" aria-label="Next month">›</button></div><div class="cal-grid" id="cgrid"></div></div>`;
}
function mountCalendar(onPick){
  const today = new Date(); today.setHours(12,0,0,0);
  const minM = new Date(today.getFullYear(), today.getMonth(), 1), maxM = new Date(today.getFullYear(), today.getMonth()+6, 1);
  let vm = S.dayDate ? new Date(S.dayDate.getFullYear(), S.dayDate.getMonth(), 1) : new Date(minM);
  const grid = document.getElementById('cgrid'), mon = document.getElementById('cmon'), prev = document.getElementById('cprev'), nxt = document.getElementById('cnext');
  const draw = () => {
    mon.textContent = vm.toLocaleDateString('en-GB',{month:'long', year:'numeric'});
    prev.disabled = vm <= minM; nxt.disabled = vm >= maxM;
    const lead = (vm.getDay()+6)%7, days = new Date(vm.getFullYear(), vm.getMonth()+1, 0).getDate();
    let h = ['M','T','W','T','F','S','S'].map(d=>`<span>${d}</span>`).join('') + '<i></i>'.repeat(lead);
    for(let d=1; d<=days; d++){
      const dt = new Date(vm.getFullYear(), vm.getMonth(), d, 12);
      const sel = S.dayDate && dt.toDateString()===S.dayDate.toDateString(), tdy = dt.toDateString()===today.toDateString();
      h += `<button class="cal-day${sel?' sel':''}${tdy?' today':''}" data-d="${d}" ${dt<today?'disabled':''} aria-label="${fmt(dt)}">${d}</button>`;
    }
    grid.innerHTML = h;
    grid.querySelectorAll('.cal-day:not([disabled])').forEach(b => b.onclick = () => { S.dayDate = new Date(vm.getFullYear(), vm.getMonth(), +b.dataset.d, 12); S.dayLabel = fmt(S.dayDate); draw(); onPick(); });
  };
  prev.onclick = () => { vm = new Date(vm.getFullYear(), vm.getMonth()-1, 1); draw(); };
  nxt.onclick = () => { vm = new Date(vm.getFullYear(), vm.getMonth()+1, 1); draw(); };
  draw();
}
function mountWheel(col, values, startIdx, onChange){
  const H = 44;
  col.innerHTML = '<i class="sp"></i>' + values.map((v,i)=>`<div data-i="${i}">${v}</div>`).join('') + '<i class="sp"></i>';
  const items = [...col.querySelectorAll('div')];
  const idx = () => Math.max(0, Math.min(values.length-1, Math.round(col.scrollTop / H)));
  const mark = () => { const k = idx(); items.forEach((el,i)=>el.classList.toggle('on', i===k)); return k; };
  let t; col.addEventListener('scroll', () => { mark(); clearTimeout(t); t = setTimeout(()=>onChange(mark()), 120); }, {passive:true});
  items.forEach((el,i) => el.onclick = () => col.scrollTo({top:i*H, behavior:'smooth'}));
  col.onkeydown = e => { if(e.key==='ArrowDown'){ e.preventDefault(); col.scrollBy({top:H, behavior:'smooth'}); } if(e.key==='ArrowUp'){ e.preventDefault(); col.scrollBy({top:-H, behavior:'smooth'}); } };
  col.scrollTop = startIdx * H; mark();
}
function whenStep(){
  view(`
    <div class="eyebrow">When</div>
    <h1>When are you seeing ${F()}?</h1>
    <p class="lede">Pick a day and a time. Plans with a date happen.</p>
    ${calendarHTML()}
    <div class="wlabel">Time</div>
    <div class="wheel"><div class="wband"></div><div class="wcol" id="wh" tabindex="0" role="listbox" aria-label="Hour"></div><div class="wsep">:</div><div class="wcol" id="wm" tabindex="0" role="listbox" aria-label="Minute"></div></div>
    <p class="err" id="whenErr" hidden>That time has already passed today. Pick a later time, or another day.</p>
    <div class="grow"></div>
    <button class="btn" id="go" disabled>Continue</button>`);
  const go = document.getElementById('go'), whenErr = document.getElementById('whenErr');
  const isPast = () => !!(S.dayDate && S.time) && new Date(isoDate(S.dayDate) + 'T' + S.time) <= new Date();
  const ready = () => { const past = isPast(); whenErr.hidden = !past; go.disabled = !(S.dayDate && S.time) || past; };
  mountCalendar(ready);
  const HRS = Array.from({length:24},(_,i)=>String(i).padStart(2,'0')), MINS = Array.from({length:12},(_,i)=>String(i*5).padStart(2,'0'));
  if(!S.time) S.time = '19:00';
  let [hh, mm] = S.time.split(':');
  const setTime = () => { S.time = hh + ':' + mm; ready(); };
  mountWheel(document.getElementById('wh'), HRS, Math.max(0, HRS.indexOf(hh)), i => { hh = HRS[i]; setTime(); });
  mountWheel(document.getElementById('wm'), MINS, Math.max(0, MINS.indexOf(String(Math.round(+mm/5)*5 % 60).padStart(2,'0'))), i => { mm = MINS[i]; setTime(); });
  ready();
  go.onclick = () => { track('plan_when',{day:S.dayLabel, time:S.time}); next(); };
}

/* HOW OFTEN: one time or recurring */
function freqStep(){
  const dn = (S.dayDate || new Date()).toLocaleDateString('en-GB',{weekday:'long'});
  const keys = Object.keys(FREQS);
  const sub = { once:'Just ' + esc(S.dayLabel), weekly: dn + 's at ' + esc(S.time||''), monthly:'Once a month, around this date' };
  view(`
    <div class="eyebrow">How often</div>
    <h1>One time, or make it <em>your thing</em>?</h1>
    <p class="lede">A small ritual you keep coming back to does more for a friendship than one big plan.</p>
    <div class="opts">${keys.map(k=>`<button class="opt"><span>${FREQS[k].t}${k==='weekly'?'<span class="tag">Builds a rhythm</span>':''}<small>${sub[k]}</small></span></button>`).join('')}</div>`);
  bindOpts(i => { S.freq = keys[i]; track('plan_frequency',{freq:S.freq}); }, S.freq ? keys.indexOf(S.freq) : -1);
}
function countStep(){
  if(!S.recurrenceCount) S.recurrenceCount = 8;
  const clamp = (n) => Math.max(2, Math.min(52, n|0));
  const paint = () => {
    view(`
      <div class="eyebrow">How many times</div>
      <h1>How many check-ins on this plan?</h1>
      <p class="lede">We'll create this many dated check-ins. You can tweak this again in the app when you claim the plan.</p>
      <div class="panel" style="display:flex;align-items:center;justify-content:center;gap:16px;padding:20px">
        <button class="btn secondary" id="minus" type="button" style="width:48px;min-width:48px;padding:12px">−</button>
        <b id="cnt" style="font-size:2rem">${S.recurrenceCount}</b>
        <button class="btn secondary" id="plus" type="button" style="width:48px;min-width:48px;padding:12px">+</button>
      </div>
      <div class="chips" style="justify-content:center;margin-top:12px">
        ${[4,8,12].map(n=>`<button type="button" class="chip${S.recurrenceCount===n?' sel':''}" data-n="${n}">${n}×</button>`).join('')}
      </div>
      <div class="grow"></div>
      <button class="btn" id="go">Continue</button>`);
    document.getElementById('minus').onclick = () => { S.recurrenceCount = clamp(S.recurrenceCount - 1); paint(); };
    document.getElementById('plus').onclick = () => { S.recurrenceCount = clamp(S.recurrenceCount + 1); paint(); };
    document.querySelectorAll('.chip[data-n]').forEach((b) => {
      b.onclick = () => { S.recurrenceCount = clamp(+b.dataset.n); paint(); };
    });
    document.getElementById('go').onclick = () => {
      track('plan_recurrence_count', { count: S.recurrenceCount, freq: S.freq });
      commit();
      next();
    };
  };
  paint();
}

/* Review before locking in */
function lockIn(){
  const nd = nextDates(3);
  view(`
    <div class="eyebrow">Check it over</div>
    <h1>Let's make it real.</h1>
    <div class="panel">
      <div class="kv"><span>What</span><b>${esc(expT())}</b></div>
      <div class="kv"><span>With</span><b>${F()}</b></div>
      <div class="kv"><span>Where</span><b>${esc(placeLabel())}</b></div>
      <div class="kv"><span>When</span><b>${esc(S.dayLabel)} · ${esc(S.time||'')}</b></div>
      <div class="kv"><span>How often</span><b>${FREQS[S.freq||'once'].short}</b></div>
    </div>
    ${nd.length>1 ? `<div class="eyebrow">Your next dates</div><div class="chips">${nd.map(d=>`<span class="chip static">${fmt(d)}</span>`).join('')}</div>` : ''}
    <label class="field" for="name">Your first name, so ${F()} knows the invite is from you<input type="text" id="name" autocomplete="given-name" placeholder="e.g. Favour" value="${esc(S.name)}"></label>
    <div class="grow"></div>
    <button class="btn" id="go" ${S.name?'':'disabled'}>Looks good</button>`);
  const i = document.getElementById('name'), g = document.getElementById('go');
  const ready = () => { g.disabled = !i.value.trim(); };
  i.oninput = ready;
  i.onkeydown = e => { if(e.key==='Enter' && !g.disabled) g.click(); };
  ready();
  g.onclick = () => {
    S.name = i.value.trim().split(' ')[0];
    track('plan_locked', planPayload()); commit(); next();
  };
}

/* "Creating your challenge" bars with one mid-build question */
async function buildPlan(){
  const id = E.nextRun();
  const once = isOnce();
  const labels = once
    ? ["Your plan with "+(S.friend||'them'),"A day and a time","A reminder, if you want"]
    : ["Your plan with "+(S.friend||'them'),"Your recurring rhythm","Check-in slots"];
  view(`
    <div class="eyebrow">Almost done</div>
    <h1>${once ? `Saving your <em>plan</em> with ${F()}` : `Setting up your <em>recurring plan</em> with ${F()}`}</h1>
    <div class="bars">${labels.map((l,i)=>`<div class="bar"><b id="b${i}"></b><span>${l}</span><em id="e${i}"></em></div>`).join('')}</div>
    <div class="grow"></div>`);
  const fill = async i => { const b=document.getElementById('b'+i); if(!b) return false; b.style.width='100%'; await wait(950); if(id!==E.runId()) return false; document.getElementById('e'+i).textContent='Done'; return true; };
  await wait(250); if(!await fill(0)) return;
  await ask("Want a reminder the day before, so it doesn't slip?", 'p3'); if(id!==E.runId()) return;
  commit();
  if(!await fill(1)) return;
  if(!await fill(2)) return;
  await wait(350); if(id===E.runId()) next();
}

/* Challenge ready: projection chart built from their own answer + chosen plan */
function challengeReady(){
  const fq = FREQS[S.freq||'once'];
  const dates = nextDates(8);
  const start = dates[0] || S.dayDate || nextDow(6,1);
  view(`
    <div class="eyebrow">${N()}, your recurring plan is ready</div>
    <h1>One plan with <em>${F()}</em>. Check-ins that keep it going.</h1>
    <p class="lede">Fliq.it keeps this as a single ${fq.short.toLowerCase()} plan with <strong>${S.recurrenceCount || 8}</strong> check-ins. You can still tweak the count in the app when you claim it.</p>
    <span class="datechip">${fmt(start)}${dates.length>1 ? ' onwards' : ''}</span>
    <div class="panel">
      ${dates.slice(0,6).map((d,i)=>`<div class="kv"><span>Check-in ${i+1}</span><b>${fmt(d)} · ${esc(S.time||'')}</b></div>`).join('')}
      ${dates.length>6 ? `<div class="kv"><span>And more</span><b>${dates.length-6} further dates</b></div>` : ''}
    </div>
    <p class="fine">Preview of your rhythm. No separate “challenge” product — just this plan and its check-ins.</p>
    <div class="grow"></div>
    <button class="btn" id="go">See the rhythm</button>`);
  btn('go', next);
}

function weekGrid(){
  const fq = FREQS[S.freq||'once'];
  const dates = nextDates(8);
  view(`
    <div class="eyebrow">Your recurring plan with ${F()}</div>
    <h1>First date planned. Check-ins live in <em>Fliq.it</em>.</h1>
    <p class="lede">Your ${fq.short.toLowerCase()} ${esc(expT().toLowerCase())} is set. In the app each occurrence is a check-in on this same plan — and you can copy an invite for ${F()} until they're on Fliq.it.</p>
    <div class="wgrid">${dates.slice(0,8).map((d,i)=>`<div class="wk ${i===0?'on':i>3?'dim':''}"><small>Check-in ${i+1} · ${fmt(d)}</small><b>${i===0?'First date':WEEKS[Math.min(i,WEEKS.length-1)][0]}</b><span>${i===0 ? esc(expT())+', planned' : esc(WEEKS[Math.min(i,WEEKS.length-1)][1].replace('{f}', S.friend||'They'))}</span></div>`).join('')}</div>
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    <button class="btn" id="go">Continue</button>`);
  btn('go', next);
}


function inviteText(){
  const p = S.place || {};
  const where = p.type==='online' ? ' over ' + (p.name && p.name!=='Video call' ? p.name : 'video') : p.type==='home' ? (p.name==='My place' ? ' at mine' : ' at yours') : p.name ? ' at ' + p.name : '';
  const often = {weekly:" Thinking we make it a weekly thing?", monthly:" Thinking we make it a monthly thing?"}[S.freq] || "";
  return `Hey ${S.friend || ''}! It's ${S.name || 'me'}. I've realised it's been way too long. Fancy ${expT().toLowerCase()}${where} on ${S.dayLabel || 'the weekend'} at ${S.time || '19:00'}?${often} I'd really love to catch up properly.`;
}

function planReady(){
  view(`
    <div class="eyebrow">It's happening</div>
    <h1>Your first plan is ready.</h1>
    <div class="ticket">
      <div class="t-top"><small>You + ${F()}</small><strong>${esc(expT())}</strong></div>
      <div class="t-cut"></div>
      <div class="t-grid">
        <div><span>Date</span><b>${esc(S.dayLabel)}</b></div>
        <div><span>Time</span><b>${esc(S.time||'')}</b></div>
        <div><span>Where</span><b>${esc(placeLabel())}</b></div>
        <div><span>Repeats</span><b>${FREQS[S.freq||'once'].short}</b></div>
      </div>
    </div>
    <div class="eyebrow" style="margin-top:6px">Send ${F()} your invite</div>
    <div class="msg" id="msg">${esc(inviteText())}</div>
    <button class="btn alt" id="copy">Copy message</button>
    <p class="fine" id="copied" hidden>Copied. Paste it into WhatsApp or a text to ${F()}.</p>
    <div class="grow"></div>
    <button class="btn" id="go">Continue</button>`);
  btn('copy', async ev => {
    const b = ev.currentTarget, note = document.getElementById('copied');
    try{ await navigator.clipboard.writeText(inviteText()); b.textContent = 'Copied'; note.hidden = false; }
    catch(e){ const r=document.createRange(); r.selectNodeContents(document.getElementById('msg')); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); b.textContent='Selected. Copy it now'; }
    track('invite_copied');
  });
  btn('go', next);
}

function appStep(){
  const h = commit();
  const once = isOnce();
  const link = Fliq.appLink(h);
  // If they joined at the early email gate, the plan didn't exist yet — POST now.
  if(S.joined && S.email && h){
    Fliq.persistHandoffIfReady(S.email, MODE);
  }
  const items = [
    `<li><span class="n">1</span><div><b>Your plan, ready</b><span>${esc(expT())} with ${F()}, ${esc(placeLabel())}, ${esc(S.dayLabel)} at ${esc(S.time||'')}${!once ? ', ' + FREQS[S.freq].short.toLowerCase() : ''}.</span></div></li>`,
  ];
  let n = 2;
  if(S.pop.p3){
    items.push(`<li><span class="n">${n++}</span><div><b>Reminders so it doesn't slip</b><span>We’ll nudge you the day before, so it actually happens.</span></div></li>`);
  }
  if(!once){
    items.push(`<li><span class="n">${n++}</span><div><b>Check-ins on this plan</b><span>${S.recurrenceCount || 8}× ${FREQS[S.freq].short.toLowerCase()} — each date is a check-in on the same plan (editable in the app).</span></div></li>`);
  }
  items.push(`<li><span class="n">${n}</span><div><b>Invite ${F()} when you're ready</b><span>Copy the message for now. When they're on Fliq.it, add them by username and code, then invite them to this plan.</span></div></li>`);
  view(`
    <div class="eyebrow">Your plan with ${F()} is saved</div>
    <h1>Fliq.it is <em>almost here</em>.</h1>
    <p class="lede">The app isn't live yet. When it opens, this is what's waiting for you.</p>
    <ul class="list">${items.join('')}</ul>
    ${!once ? `<div class="weeks" aria-label="Upcoming check-ins">${[1,2,3,4,5,6,7,8].map(w=>`<i class="${w===1?'now':''}">${w}</i>`).join('')}</div>` : ''}
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    ${S.joined
      ? `<div class="panel joined"><h3>You're on the list</h3><p>We'll email <b>${esc(S.email)}</b> the day Fliq.it opens. Your plan with ${F()} is saved on this device.</p></div>`
      : `<label class="field" for="wl">Get early access<input type="email" id="wl" autocomplete="email" inputmode="email" placeholder="you@example.com"></label>
         <p class="err" id="wlerr" hidden></p>
         <button class="btn" id="wlgo">Join the early-access list</button>
         <p class="fine">By joining, you agree we can email you about the launch. See our <a href="${CONFIG.PRIVACY_URL}" target="_blank" rel="noopener">privacy policy</a>.</p>`}
    ${link ? `<a class="btn alt" id="dl" href="${esc(link)}">Lock in my plan on Fliq.it</a>` : ''}
    <a class="btn ghost" href="/solo-quiz/" id="other">Now try the Solo quiz</a>`);
  btn('wlgo', async () => {
    const b = document.getElementById('wlgo');
    if(await Fliq.submitEmail(S, document.getElementById('wl'), document.getElementById('wlerr'), b, MODE)){ track('lead_captured', {profile:S.profile, at:'final'}); commit(); E.paint(); }
  });
  btn('dl', () => track('app_open_click', {profile:S.profile, exp:S.exp, place_type:S.place && S.place.type, freq:S.freq}));
}

E.start();
