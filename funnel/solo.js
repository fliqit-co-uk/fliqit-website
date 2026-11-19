/* =========================================================
   FLIQ.IT SOLO FUNNEL: content and screens.
   Engine, waitlist and handoff live in core.js. Every claim must be true.
   ========================================================= */
const { CONFIG, esc, wait, isoDate, nextDow, fmt, fmtLong } = Fliq;
const { USER_COUNT, EXPERT, TESTIMONIALS } = CONFIG;
const MODE = 'solo';
const track = (event, props) => Fliq.track(MODE, event, props);

const S = { name:"", age:null, dob:null, dobParts:null, a:{}, src:null, pop:{}, email:"", joined:false, handoffId:null, exp:null, customExp:"", place:null, freq:null, dayLabel:"", dayDate:null, time:null, profile:null };
const E = Fliq.createEngine({ mode: MODE, S });
const { view, bindOpts, btn, ask, closeModal, next } = E;
const app = Fliq.$('#app');
const N = () => esc(S.name || "you");
const proofLine = () => USER_COUNT
  ? `<strong>${esc(USER_COUNT)} people</strong> are already planning time for themselves on Fliq.it`
  : `<strong>Be one of the first</strong> to plan time for yourself on Fliq.it`;

/* ---------- Questions ---------- */
const QUESTIONS = [
 {k:"q1", q:"A free Saturday, nothing planned. What usually happens?", o:["I stay in and scroll more than I meant to","I look for somewhere new to go","I text around to see who's free","I catch up on chores or a side project","I stay home, and honestly I love it","I plan a little date with myself"]},
 {k:"q2", q:"How do you feel about doing things on your own?", o:["I love it. It's how I reset","Exciting. I notice more when I'm alone","Awkward. I'd rather have company","Fine, as long as it's useful","I'd rather be home alone than out alone","It's my favourite kind of date"]},
 {k:"q3", q:"Be honest. How much of your downtime is spent on your phone?", o:["Most of it","Way more than I'd like","Some, but I still get out","Not much, I keep busy","Depends who I'm with"]},
 {k:"q4", q:"Your saved posts are mostly…", o:["Calming things I never actually try","Places I swear I'll go to","Things to do with friends","Courses, books and side hustles","Recipes and home ideas","Outfits and aesthetic spots"]},
 {k:"q5", q:"What do you secretly want more of?", o:["Real rest","Adventure","Confidence doing things alone","Doing things just for fun","A reason to leave the house","Moments that feel like a film"]},
 {k:"q6", q:"After a day to yourself, how do you usually feel?", o:["Still tired","Inspired","A bit lonely","Guilty I wasn't productive","Cosy and content","Like myself again"]},
 {k:"q7", q:"Which would bother you most?", o:["Burning out before 30","Never seeing the places on my list","Missing out because nobody could come","Realising I never did anything just for me","My world getting smaller every year","Looking back on years that all felt the same"]},
 {k:"q8", q:"When did you last do something alone, just for you?", o:["This week","This month","A few months ago","More than 6 months ago","I honestly can't remember"]},
 {k:"q9", q:"What usually stops you?", o:["I'm too tired after work","I never know where to go","It feels awkward on my own","It feels like a waste of time","Getting ready to go out feels like effort","I wait for the perfect day"]},
 {k:"q10", q:"If your free time looked exactly the same next year, how would you feel?", o:["Completely fine","A bit flat","Disappointed","Stuck","Like I'm wasting my 20s","I wouldn't be okay with that"]}
];

/* ---------- The six solo types ---------- */
const PROFILES = {
  recharger:{name:"The Recharger", need:"Real rest", line:"Alone time is how you refuel.",
    insight:"You need time alone to feel like yourself, and you protect it. But somewhere along the way, rest turned into the sofa and your phone. It feels like a break. It just doesn't fill you back up."},
  explorer:{name:"The Explorer", need:"Follow-through", line:"You want to see it all, ideally this weekend.",
    insight:"You're curious. New cafés, a gallery, a neighbourhood you've never walked. Your saved posts are full of places. The problem isn't wanting to go. It's that wanting never turns into a date."},
  plusone:{name:"The Plus-One", need:"Confidence alone", line:"Everything's better with company. So you wait for it.",
    insight:"You light up around people, and doing things with someone just feels right. But when nobody's free, the plan quietly dies. The film, the class, the new restaurant all wait until someone can come, and often nobody can."},
  achiever:{name:"The Achiever", need:"Joy for its own sake", line:"Even your free time has a to-do list.",
    insight:"You use time alone well: the gym, a course, the side project, the admin. You're building something, and it shows. But rest that doesn't produce anything makes you feel guilty, so you rarely do anything purely for fun."},
  homebody:{name:"The Homebody", need:"A reason to go out", line:"Home is your happy place. Maybe a little too happy.",
    insight:"You love your space, your routine and your sofa, and there's nothing wrong with that. But some weeks you only leave the house for work, and getting ready to go out feels like more effort every month."},
  main:{name:"The Main Character", need:"Consistency", line:"Solo dates are your thing, when the moment's right.",
    insight:"You know how good a solo date can be: the window seat, the book, the playlist, the walk home. But it only happens when everything lines up, the mood, the outfit, the weather. So it happens a lot less than you'd like."}
};

const REVEAL = {
  recharger:{strength:"You know you need space, and you're not afraid to take it.",
    blind:"Your “rest” is mostly scrolling, so you end the weekend more tired than you started.",
    cost:"Weekends that disappear and leave you emptier than Friday.",
    fix:[["Plans that match your energy","Tell Fliq.it how drained you are and get a plan that fits."],["20-minute resets","Small solo plans for evenings when you've got nothing left."],["A protected weekly slot","Time for you, in the diary, every week."]]},
  explorer:{strength:"You notice the world. Anywhere new feels like an adventure.",
    blind:"You save places on TikTok and never go. The list keeps growing, and so does the gap.",
    cost:"A city full of places you've been meaning to try.",
    fix:[["Saved ideas, booked","Turn your list into solo dates with a day and a time."],["Spontaneous mode","Something new to do nearby, in the next hour."],["A weekly adventure","One new place a week, on repeat."]]},
  plusone:{strength:"You're warm, social and fun to be around.",
    blind:"You put your life on hold until someone's free to come.",
    cost:"Saying no to things you want, just because you'd be doing them alone.",
    fix:[["Easy first solo dates","Low-pressure plans that make going alone feel normal."],["Waves","Do something at the same moment as other people, so alone never feels lonely."],["Invite someone, if you want","Turn any solo plan into a plan with a friend."]]},
  achiever:{strength:"You're driven and disciplined, and you get things done.",
    blind:"Even your downtime has targets. Nothing is just for fun anymore.",
    cost:"Ticking every box and still feeling like you're missing something.",
    fix:[["Plans just for joy","No goals, no output. Just something you'll enjoy."],["Hobbies to unrot your brain","Pottery, chess, a dance class, picked for you."],["Guilt-free time, booked","If it's in the diary, it counts."]]},
  homebody:{strength:"You know how to make anywhere feel calm and cosy.",
    blind:"Your comfort zone is quietly shrinking. Some weeks you only leave for work.",
    cost:"A world that gets a little smaller every year.",
    fix:[["Low-effort outings","Close to home, no dressing up, back on the sofa by nine."],["Gentle nudges","A small push on the days you'd otherwise stay in."],["Plans you can't talk yourself out of","Booked, reminded, done."]]},
  main:{strength:"You romanticise your life, and you're good at it.",
    blind:"You only go when the mood, the outfit and the weather are perfect, so it rarely happens.",
    cost:"Years that blur together, with only a few days that felt like yours.",
    fix:[["Magic Build","A solo date planned around your mood in seconds."],["A recurring solo date","Same time every week, whatever the weather."],["Ideas worth dressing up for","New spots that make the moment feel special."]]}
};

const BA = {
  recharger:[["Scroll-rest","Hours gone, still tired","Real rest","Plans that actually refill you"],["Weekends disappear","Nothing to show for them","Weekends you remember","One plan just for you"],["Empty by Wednesday","Every single week","A weekly reset","Booked before you need it"]],
  explorer:[["A saved list","That never gets shorter","Places ticked off","One new spot every week"],["“One day”","Always next weekend","This Saturday","With a time attached"],["The same few places","Out of habit","A city you actually know","Street by street"]],
  plusone:[["Waiting for company","Plans die when no one's free","Going anyway","And enjoying it"],["Awkward alone","Phone out, eyes down","At ease alone","Your own good company"],["Missing out","On things you wanted","Saying yes","Even when it's just you"]],
  achiever:[["Downtime with targets","Even rest has a goal","Time just for fun","No output required"],["Guilt when resting","Should be doing something","Rest that counts","Because it's in the plan"],["Work, gym, repeat","Not much else","A life outside the grind","Hobbies you love"]],
  homebody:[["Only out for work","Some weeks","Out once a week","Somewhere close and easy"],["Effort to go out","Every single time","Easy plans","That get you out the door"],["A shrinking world","Same four walls","New favourite spots","Close to home"]],
  main:[["Waiting for the moment","Mood, outfit, weather","Making the moment","Every week"],["Rare solo dates","A few times a year","A weekly ritual","That's just yours"],["Days that blur","One into the next","Days that feel like yours","Worth remembering"]]
};

const EXPERIENCES = {
  cafe:{t:"Café and a book", d:"A window seat and no rush.", h:1.5, p:"out"},
  walk:{t:"A long solo walk", d:"Headphones optional. Phone in your pocket.", h:1.5, p:"out"},
  gallery:{t:"Gallery or museum", d:"Wander at your own pace.", h:2, p:"out"},
  class:{t:"Try a class", d:"Pottery, dance, life drawing, anything new.", h:2, p:"out"},
  cinema:{t:"Solo cinema", d:"Best seat, your choice of film.", h:2.5, p:"out"},
  journal:{t:"Journal night", d:"Tea, a notebook and an hour for you.", h:1, p:"home"},
  cook:{t:"Cook something new", d:"A proper meal, just for you.", h:1.5, p:"home"},
  reset:{t:"20-minute reset", d:"A short plan for a long week.", h:0.33, p:"home"},
  workshop:{t:"Online workshop", d:"Learn something from your sofa.", h:1.5, p:"online"}
};
const RECS = { recharger:["reset","walk","journal"], explorer:["gallery","walk","cafe"], plusone:["cinema","class","cafe"], achiever:["class","cook","gallery"], homebody:["walk","cafe","cook"], main:["cafe","gallery","cinema"] };
const PLACE_TYPES = { out:{t:"Out somewhere", d:"A café, park, gallery or venue."}, home:{t:"At home", d:"Your space, made special."}, online:{t:"Online", d:"A live class or workshop."} };
const FREQS = {
  once:{t:"Just this once", short:"One time", rrule:null, every:0},
  weekly:{t:"Every week", short:"Weekly", rrule:"FREQ=WEEKLY;INTERVAL=1", every:1},
  monthly:{t:"Every month", short:"Monthly", rrule:"FREQ=MONTHLY;INTERVAL=1", every:4}
};
/* The 8-week Solo challenge. Week 1 is booked here; weeks 2-8 unlock one at a time in the app. */
const WEEKS = [
  ["The first date","The plan you just made."],
  ["Somewhere new","A place you've never been."],
  ["Phone down","A plan with no scrolling allowed."],
  ["Learn something","A class, a workshop, a new skill."],
  ["Low battery","An easy plan for a tired week."],
  ["Say yes","Something you'd normally wait to do with someone."],
  ["Dress up for you","A plan worth getting ready for."],
  ["Make it yours","Choose the ritual you'll keep going."]
];

/* ---------- Helpers ---------- */
const expT = () => S.exp==='custom' ? (S.customExp || 'Your plan') : EXPERIENCES[S.exp || 'cafe'].t;
const expH = () => S.exp==='custom' ? 1.5 : EXPERIENCES[S.exp || 'cafe'].h;
const placeLabel = () => { const p=S.place; if(!p) return ''; if(p.type==='online') return p.name ? 'Online · '+p.name : 'Online'; return p.name || PLACE_TYPES[p.type].t; };
/* Energy the plan asks for, in the app's own vocabulary (low | mid | high). */
const ENERGY = { cafe:'low', walk:'mid', gallery:'mid', class:'high', cinema:'low', journal:'low', cook:'mid', reset:'low', workshop:'mid' };

/* Analytics: categories only. No names, no free text (custom plan / place names stay out). */
function planPayload(){
  const f = FREQS[S.freq||'once'];
  return { mode:'solo', activity: S.exp, place_type: S.place ? S.place.type : null, recurrence: S.freq || 'once', rrule: f.rrule,
    solo_type: S.profile, age_range: S.age, has_date: !!S.dayDate };
}

/* The HANDOFF: everything the app needs to create this plan after install. See README "Funnel handoff". */
function handoff(){
  const f = FREQS[S.freq||'once'], d = S.dayDate ? isoDate(S.dayDate) : null;
  const custom = S.exp === 'custom';
  return Fliq.buildHandoff(S, {
    funnel: { id:'solo_type', mode:'solo' },
    profile: { type: S.profile, name: S.profile ? PROFILES[S.profile].name : null },
    user: { first_name: S.name || null, dob: S.dob || null, age_range: S.age || null },
    plan: {
      mode: 'solo',
      title: expT(),
      activity: custom ? 'custom' : S.exp,
      place: { type: S.place ? S.place.type : null, name: S.place ? S.place.name : null },
      start_date: d, start_time: S.time || null,
      start_at: d && S.time ? d + 'T' + S.time : null,      // local wall-clock time, interpret with `timezone`
      duration_minutes: Math.round(expH() * 60),
      energy: custom ? 'mid' : ENERGY[S.exp],
      recurrence: S.freq || 'once', rrule: f.rrule,
    },
    challenge: { id: 'solo_8_week', weeks: 8, planned_weeks: [1], start_date: d },
    reminders: { day_before: !!S.pop.p3 },
  });
}
/* Save the latest handoff locally. Called whenever something it contains changes. */
function commit(){ if(S.dayDate && S.time && S.place && S.name){ const h = handoff(); Fliq.saveHandoff(h); return h; } return null; }
function nextDates(n){
  const out=[]; if(!S.dayDate) return out; const f=FREQS[S.freq||'once'];
  for(let k=0;k<n;k++){ const d=new Date(S.dayDate); if(S.freq==='monthly') d.setMonth(d.getMonth()+k); else d.setDate(d.getDate()+7*f.every*k); out.push(d); if(!f.every) break; }
  return out;
}

/* ---------- Scoring (from their own answers) ---------- */
function pickProfile(){
  const c = {recharger:0, explorer:0, plusone:0, achiever:0, homebody:0, main:0};
  const map = {
    q1:["recharger","explorer","plusone","achiever","homebody","main"],
    q2:["recharger","explorer","plusone","achiever","homebody","main"],
    q3:["recharger","recharger","explorer","achiever","plusone"],
    q4:["recharger","explorer","plusone","achiever","homebody","main"],
    q5:["recharger","explorer","plusone","achiever","homebody","main"],
    q6:["recharger","explorer","plusone","achiever","homebody","main"],
    q7:["recharger","explorer","plusone","achiever","homebody","main"],
    q8:["main","explorer","recharger","homebody","plusone"],
    q9:["recharger","explorer","plusone","achiever","homebody","main"]
  };
  const weight = {q5:1.5, q7:1.5};
  for(const k in map){ const v = S.a[k]; if(v!==undefined && map[k][v]) c[map[k][v]] += (weight[k] || 1); }
  const max = Math.max(...Object.values(c));
  const tied = Object.keys(c).filter(k => c[k]===max);
  if(tied.length===1) return tied[0];
  for(const k of ["q5","q7"]){ const t = S.a[k]!==undefined ? map[k][S.a[k]] : null; if(t && tied.includes(t)) return t; }
  return tied[0];
}
function gapScore(){ // how much time-for-you is missing, 0..1
  let s = 0;
  s += [3,3,1,0,1][S.a.q3 ?? 1];
  s += [0,1,2,3,4][S.a.q8 ?? 1];
  s += [2,0,1,2,0,0][S.a.q6 ?? 0];
  if(S.pop.p1) s += 1;
  return Math.min(1, s/10);
}
const gapLevel = v => v < .34 ? "Low" : v < .67 ? "Medium" : "High";
function readiness(){
  let r = 58 + [0,10,14,18,22,24][S.a.q10 ?? 1];
  if(S.pop.p1) r += 5; if(S.pop.p2) r += 6;
  return Math.min(96, r);
}
function baselineWeekly(){ return [1.5, 0.4, 0.1, 0.05, 0][S.a.q8 ?? 1]; }

/* ---------- Steps ---------- */
const add = E.add;
add(-1, landing);
QUESTIONS.forEach((q,i) => {
  add(0, () => question(q, i), {name:'question_'+(i+1)});
  if(i===3) add(0, () => pause("You're doing great.", "Six more questions and your score is ready. Answer with your gut. There are no right answers."));
  if(i===6) add(0, research);
});
add(0, sourceStep);
if(EXPERT) add(0, expertStep);
if(TESTIMONIALS.length) add(0, wallStep);
add(1, ringLoader, {transient:true, name:'ring_loader'});
add(1, emailGate, {name:'email_gate'});
add(1, summary);
add(1, insight);
add(1, beforeAfter);
add(1, fixes);
add(2, experienceStep);
add(2, placeStep);
add(2, whenStep);
add(2, freqStep);
add(2, lockIn);
add(2, buildPlan, {transient:true, name:'build_plan'});
add(2, challengeReady);
add(2, weekGrid);
add(2, planReady);
add(2, appStep, {name:'waitlist'});



/* ---------- Screens ---------- */
function landing(){
  view(`
    <div class="eyebrow">60-second self check-in</div>
    <h1>How disconnected are you <em>from yourself</em>?</h1>
    <p class="lede">Work, sofa, scroll, repeat. Somewhere in there, it's easy to lose touch with what you actually enjoy, and who you are when nobody needs anything from you. Ten quick questions to find out how far you've drifted, what's causing it, and one plan to come back to yourself this week.</p>
    <div class="types" aria-label="What you'll get">
      <span>Your disconnection score</span><span>What's causing it</span><span>Your first plan back</span>
    </div>
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    <button class="btn" id="go">Check in with myself</button>
    ${E.resumeBlock()}
    <p class="fine">Free. No sign-up needed to see your result.</p>`);
  btn('go', () => { track('quiz_start'); next(); });
  E.bindResume();
}
function question(q, i){
  view(`<div class="qcount">Question ${i+1} of ${QUESTIONS.length}</div><h1>${q.q}</h1><div class="opts">${q.o.map(o=>`<button class="opt">${esc(o)}</button>`).join('')}</div>`);
  bindOpts(v => { S.a[q.k] = v; track('quiz_answer',{q:q.k, a:v}); }, S.a[q.k]);
}
function single(title, sub, opts, set){
  view(`<h1>${title}</h1>${sub?`<p class="lede">${sub}</p>`:''}<div class="opts">${opts.map(o=>`<button class="opt">${esc(o)}</button>`).join('')}</div>`);
  bindOpts(i => set(opts[i]));
}
function pause(title, body){
  view(`<div class="grow"></div><div class="eyebrow">Progress saved</div><h1>${title}</h1><p class="lede">${body}</p><div class="grow"></div><button class="btn" id="go">Keep going</button>`);
  btn('go', next);
}
function research(){
  view(`
    <div class="eyebrow">Why this matters</div>
    <h1>Time alone works, <em>when you use it well</em>.</h1>
    <div class="fact">
      <div class="big">15 min</div>
      <p>Fifteen minutes alone, without a phone, was enough to leave people calmer and less stressed.</p>
      <cite>Nguyen, Ryan &amp; Deci, University of Rochester. Personality and Social Psychology Bulletin, 2018.</cite>
    </div>
    <div class="fact">
      <p>People avoid doing fun things alone because they think others will judge them. When they go anyway, they enjoy it about as much as going with a friend.</p>
      <cite>Ratner &amp; Hamilton, University of Maryland and Georgetown University. Journal of Consumer Research, 2015.</cite>
    </div>
    <p class="lede">That's why Fliq.it Solo focuses on one thing: getting time for you in the diary.</p>
    <div class="grow"></div>
    <button class="btn" id="go">Three questions left</button>`);
  btn('go', next);
}
function sourceStep(){
  single("Last one. How did you find us?", "It helps us reach more people like you.", ["TikTok","Instagram","A friend sent it to me","Somewhere else"], v => { S.src=v; track('attribution',{src:v}); });
}
function expertStep(){
  view(`<div class="eyebrow">Reviewed by an expert</div><h1>Your plan is shaped by people who study wellbeing.</h1>
    <div class="expert"><div class="av">${esc(EXPERT.name.charAt(0))}</div><div><b>${esc(EXPERT.name)}</b><span>${esc(EXPERT.role)}</span></div></div>
    ${EXPERT.quote?`<div class="panel"><p>“${esc(EXPERT.quote)}”</p></div>`:''}<div class="grow"></div><button class="btn" id="go">Continue</button>`);
  btn('go', next);
}
function wallStep(){
  view(`<div class="eyebrow">From the Fliq.it community</div><h1>What people say after their first solo plan</h1>
    ${TESTIMONIALS.slice(0,3).map(t=>`<div class="quote"><p>“${esc(t.text)}”</p><span>${esc(t.name)}</span></div>`).join('')}<div class="grow"></div><button class="btn" id="go">Continue</button>`);
  btn('go', next);
}
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
  await ask("Do you often end a free day feeling like you didn't do anything for yourself?", 'p1'); if(id!==E.runId()) return;
  if(!await run(38,74,1500,"Mapping how you spend time alone")) return;
  await ask("Would a set time each week, just for you, make it easier?", 'p2'); if(id!==E.runId()) return;
  if(!await run(74,100,1200,"Calculating your disconnection score")) return;
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
function summary(){
  const p = PROFILES[S.profile], d = gapScore(), lvl = gapLevel(d), r = readiness(), pct = Math.round(15 + d*80);
  view(`
    <div class="reveal">
      <div class="eyebrow">Your disconnection score</div>
      <div class="score" id="sc">0%</div>
      <p style="margin:0;color:#DCD4EE">disconnected from yourself</p>
      <span class="pill ${lvl}">${lvl}</span>
      <div style="width:100%;display:flex;flex-direction:column;gap:8px;margin-top:6px">
        <div class="meter"><i id="mk" style="left:0%"></i></div>
        <div class="meterscale"><span>Connected</span><span>Drifting</span><span>Disconnected</span></div>
      </div>
    </div>
    <div class="panel"><p>${lvl==='High' ? "You've drifted a long way from yourself. Most of your time goes to work, your phone or other people, and very little goes to you. The good news: this changes fast once time for you is in the diary." : lvl==='Medium' ? "You still check in with yourself, but not often enough to feel like you. One regular plan is usually all it takes." : "You're fairly connected to yourself already. A regular plan keeps it that way."}</p></div>
    <div class="typecard"><div class="seal">${p.name.replace('The ','').charAt(0)}</div><div><span>Your solo type</span><b>${p.name}</b><span>“${p.line}”</span></div></div>
    <div class="ready">
      <h3 style="margin:0;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent)">Ready to reconnect with yourself</h3>
      <div class="big" id="rd">0%</div>
      <p>Your answers show you want this. You just need a plan that's easy to keep. That's the part we'll help with.</p>
    </div>
    <p class="fine">Scores are based on your answers in this quiz.</p>
    <div class="grow"></div>
    <button class="btn" id="go">What's causing it?</button>`);
  requestAnimationFrame(()=> setTimeout(()=>{ const mk=document.getElementById('mk'); if(mk) mk.style.left = Math.round(8+d*84)+'%'; }, 60));
  const count = (id, target) => { const el = document.getElementById(id); let v = 0; const t = setInterval(()=>{ if(!document.body.contains(el)) return clearInterval(t); v = Math.min(target, v+2); el.textContent = v+'%'; if(v>=target) clearInterval(t); }, 22); };
  count('sc', pct); count('rd', r);
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
    <p class="lede">It doesn't have to go that way. Here's where you could be in eight weeks.</p>
    <div class="ba">
      <div class="now"><h3>You now</h3><ul>${rows.map(r=>`<li><b>${r[0]}</b><span>${r[1]}</span></li>`).join('')}</ul></div>
      <div class="then"><h3>You with Fliq.it</h3><ul>${rows.map(r=>`<li><b>${r[2]}</b><span>${r[3]}</span></li>`).join('')}</ul></div>
    </div>
    <div class="grow"></div>
    <button class="btn" id="go">Show me how</button>`);
  btn('go', next);
}
function fixes(){
  const p = PROFILES[S.profile], r = REVEAL[S.profile], type = p.name.replace('The ','');
  view(`
    <div class="eyebrow">Built for ${type}s</div>
    <h1>How Fliq.it fixes <em>your blind spot</em></h1>
    <ul class="list">${r.fix.map((f,i)=>`<li><span class="n">${i+1}</span><div><b>${f[0]}</b><span>${f[1]}</span></div></li>`).join('')}</ul>
    <div class="panel"><p>Knowing your type changes nothing on its own. So let's book your first solo plan right now. It takes under a minute.</p></div>
    <div class="grow"></div>
    <button class="btn" id="go">Build my first plan</button>`);
  btn('go', () => { track('plan_start'); next(); });
}
function experienceStep(){
  const rec = RECS[S.profile];
  const order = rec.concat(Object.keys(EXPERIENCES).filter(k=>!rec.includes(k))).slice(0,7);
  const p = PROFILES[S.profile];
  view(`
    <div class="eyebrow">Take action today</div>
    <h1>Set your first plan, <em>just for you</em>.</h1>
    <p class="lede">Ranked for ${p.name.replace('The ','')}s. Pick one, or name your own.</p>
    <div class="opts">${order.map((k,i)=>`<button class="opt"><span>${EXPERIENCES[k].t}${i===0?'<span class="tag">Best fit</span>':''}<small>${EXPERIENCES[k].d}</small></span></button>`).join('')}</div>
    <label class="field" for="custom">Something else<input type="text" id="custom" maxlength="40" placeholder="e.g. Sunset swim, record shopping" value="${esc(S.customExp)}"></label>
    <button class="btn" id="go" ${S.exp==='custom' && S.customExp ? '' : 'hidden'}>Use this plan</button>`);
  bindOpts(i => { S.exp = order[i]; track('plan_experience',{exp:S.exp}); }, S.exp && S.exp!=='custom' ? order.indexOf(S.exp) : -1);
  const c = document.getElementById('custom'), g = document.getElementById('go');
  c.oninput = () => { g.hidden = !c.value.trim(); };
  c.onkeydown = e => { if(e.key==='Enter' && c.value.trim()) g.click(); };
  g.onclick = () => { S.exp = 'custom'; S.customExp = c.value.trim(); track('plan_experience',{exp:'custom', name:S.customExp}); next(); };
}
function placeStep(){
  const sug = S.exp==='custom' ? null : EXPERIENCES[S.exp || 'cafe'].p;
  const st = S.place ? {type:S.place.type, name:S.place.name} : {type:null, name:""};
  view(`
    <div class="eyebrow">Where</div>
    <h1>Where are you taking yourself?</h1>
    <p class="lede">Out, at home or online. They all count.</p>
    <div class="opts">${Object.entries(PLACE_TYPES).map(([k,v])=>`<button class="opt pt" data-k="${k}"><span>${v.t}${k===sug?'<span class="tag">Suggested</span>':''}<small>${v.d}</small></span></button>`).join('')}</div>
    <div id="pdetail"></div>
    <div class="grow"></div>
    <button class="btn" id="go" disabled>Continue</button>`);
  const det = document.getElementById('pdetail'), go = document.getElementById('go');
  const ok = () => { go.disabled = !(st.type && (st.type!=='out' || st.name)); };
  const chips = arr => `<div class="chips" id="pc">${arr.map(a=>`<button class="chip${st.name===a?' sel':''}">${esc(a)}</button>`).join('')}</div>`;
  const draw = focus => {
    if(st.type==='out'){
      det.innerHTML = `<label class="field" for="pname">Name the place<input type="text" id="pname" maxlength="60" placeholder="e.g. Tate Modern, or your local café" value="${esc(st.name)}"></label><p class="fine" style="text-align:left;margin-top:8px">You can change it later in the app.</p>`;
      const i = document.getElementById('pname'); i.oninput = () => { st.name = i.value.trim(); ok(); }; if(focus) i.focus();
    } else if(st.type==='online'){
      det.innerHTML = `<div class="eyebrow" style="margin-bottom:10px">Where online? Optional</div>` + chips(["Zoom","YouTube","A live class"]);
    } else det.innerHTML = '';
    det.querySelectorAll('#pc .chip').forEach(c => c.onclick = () => { det.querySelectorAll('#pc .chip').forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); st.name = c.textContent; ok(); });
    ok();
  };
  app.querySelectorAll('.pt').forEach(b => {
    if(b.dataset.k===st.type) b.classList.add('sel');
    b.onclick = () => { app.querySelectorAll('.pt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); if(st.type!==b.dataset.k){ st.type = b.dataset.k; st.name = ""; } draw(true); };
  });
  draw(false);
  go.onclick = () => { S.place = {type:st.type, name: st.name || (st.type==='home' ? 'Home' : st.type==='online' ? 'Online' : '')}; track('plan_place',{type:S.place.type}); next(); };
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
    <h1>When is this happening?</h1>
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
function freqStep(){
  const dn = (S.dayDate || new Date()).toLocaleDateString('en-GB',{weekday:'long'});
  const keys = Object.keys(FREQS);
  const sub = { once:'Just ' + esc(S.dayLabel), weekly: dn + 's at ' + esc(S.time||''), monthly:'Once a month, around this date' };
  view(`
    <div class="eyebrow">How often</div>
    <h1>One time, or make it <em>your thing</em>?</h1>
    <p class="lede">A small ritual you keep coming back to does more for you than one big day off.</p>
    <div class="opts">${keys.map(k=>`<button class="opt"><span>${FREQS[k].t}${k==='weekly'?'<span class="tag">Fits your challenge</span>':''}<small>${sub[k]}</small></span></button>`).join('')}</div>`);
  bindOpts(i => { S.freq = keys[i]; track('plan_frequency',{freq:S.freq}); }, S.freq ? keys.indexOf(S.freq) : -1);
}
function ageRange(dt){
  const t = new Date(); let a = t.getFullYear() - dt.getFullYear();
  if(t.getMonth() < dt.getMonth() || (t.getMonth()===dt.getMonth() && t.getDate() < dt.getDate())) a--;
  return a < 18 ? 'Under 18' : a <= 20 ? '18–20' : a <= 24 ? '21–24' : a <= 29 ? '25–29' : a <= 34 ? '30–34' : '35+';
}
function lockIn(){
  const nd = nextDates(3), yNow = new Date().getFullYear();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const P = S.dobParts || {};
  const opt = (v, t, cur) => `<option value="${v}"${String(cur)===String(v)?' selected':''}>${t}</option>`;
  view(`
    <div class="eyebrow">Check it over</div>
    <h1>Let's make it real.</h1>
    <div class="panel">
      <div class="kv"><span>What</span><b>${esc(expT())}</b></div>
      
      <div class="kv"><span>Where</span><b>${esc(placeLabel())}</b></div>
      <div class="kv"><span>When</span><b>${esc(S.dayLabel)} · ${esc(S.time||'')}</b></div>
      <div class="kv"><span>How often</span><b>${FREQS[S.freq||'once'].short}</b></div>
    </div>
    ${nd.length>1 ? `<div class="eyebrow">Your next dates</div><div class="chips">${nd.map(d=>`<span class="chip static">${fmt(d)}</span>`).join('')}</div>` : ''}
    <label class="field" for="name">Your first name, so we can save your plan<input type="text" id="name" autocomplete="given-name" placeholder="e.g. Favour" value="${esc(S.name)}"></label>
    <div class="eyebrow" style="margin-top:4px">Date of birth</div>
    <div class="dob">
      <select id="dd" aria-label="Day" autocomplete="bday-day">${opt('','Day',P.d)}${Array.from({length:31},(_,i)=>opt(i+1,i+1,P.d)).join('')}</select>
      <select id="dm" aria-label="Month" autocomplete="bday-month">${opt('','Month',P.m)}${months.map((m,i)=>opt(i+1,m,P.m)).join('')}</select>
      <select id="dy" aria-label="Year" autocomplete="bday-year">${opt('','Year',P.y)}${Array.from({length:78},(_,i)=>opt(yNow-13-i,yNow-13-i,P.y)).join('')}</select>
    </div>
    <p class="err" id="dobErr" hidden>That date doesn't exist. Check the day and month.</p>
    <div class="grow"></div>
    <button class="btn" id="go" disabled>Looks good</button>`);
  const i = document.getElementById('name'), g = document.getElementById('go'), err = document.getElementById('dobErr');
  const dd = document.getElementById('dd'), dm = document.getElementById('dm'), dy = document.getElementById('dy');
  const dob = () => { const d=+dd.value, m=+dm.value, y=+dy.value; if(!d||!m||!y) return null; const dt = new Date(y, m-1, d, 12); return dt.getMonth()===m-1 ? dt : 'bad'; };
  let blockedLogged = false;
  const ready = () => {
    const v = dob(), bad = v === 'bad', young = !!v && !bad && ageRange(v) === 'Under 18';
    err.hidden = !(bad || young);
    err.textContent = young ? "Fliq.it is for people aged 18 and over, so we can't build this plan for you yet." : "That date doesn't exist. Check the day and month.";
    if(young){ S.dob = null; S.age = null; Fliq.clearHandoff(); if(!blockedLogged){ blockedLogged = true; track('under_18_blocked'); } }
    g.disabled = !(i.value.trim() && v && !bad && !young);
  };
  i.oninput = ready; [dd,dm,dy].forEach(el => el.onchange = ready);
  i.onkeydown = e => { if(e.key==='Enter' && !g.disabled) g.click(); };
  ready();
  g.onclick = () => {
    const v = dob();
    if(!v || v === 'bad' || ageRange(v) === 'Under 18') return;
    S.name = i.value.trim().split(' ')[0];
    S.dobParts = {d:dd.value, m:dm.value, y:dy.value}; S.dob = isoDate(v); S.age = ageRange(v);
    track('plan_locked', planPayload()); commit(); next();
  };
}
async function buildPlan(){
  const id = E.nextRun();
  const labels = ["Your solo map","Eight weeks of plans","Your weekly rhythm"];
  view(`
    <div class="eyebrow">Almost done</div>
    <h1>Creating your <em>8-week Solo challenge</em>, ${N()}</h1>
    <div class="bars">${labels.map((l,i)=>`<div class="bar"><b id="b${i}"></b><span>${l}</span><em id="e${i}"></em></div>`).join('')}</div>
    <div class="grow"></div>`);
  const fill = async i => { const b=document.getElementById('b'+i); if(!b) return false; b.style.width='100%'; await wait(950); if(id!==E.runId()) return false; document.getElementById('e'+i).textContent='Done'; return true; };
  await wait(250); if(!await fill(0)) return;
  await ask("Want a reminder the day before, so you don't talk yourself out of it?", 'p3'); if(id!==E.runId()) return;
  commit();
  if(!await fill(1)) return;
  if(!await fill(2)) return;
  await wait(350); if(id===E.runId()) next();
}
function challengeReady(){
  const h = expH(), fq = FREQS[S.freq||'once'], every = fq.every || 1;
  const start = S.dayDate || nextDow(6,1);
  const end = new Date(start); end.setDate(end.getDate()+49);
  const plan = [], base = [];
  for(let w=0; w<=8; w++){ plan.push(+(Math.ceil(w/every)*h).toFixed(1)); base.push(+(w*baselineWeekly()).toFixed(1)); }
  const max = Math.max(4, Math.ceil(plan[8]/4)*4);
  const W=320, H=170, L=30, Rt=10, T=14, B=26;
  const x = i => L + (W-L-Rt)*i/8, y = v => T + (H-T-B)*(1 - v/max);
  const path = arr => arr.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = path(plan) + ` L${x(8)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, max/2, max];
  view(`
    <div class="eyebrow">${N()}, your challenge is ready</div>
    <h1>Eight weeks of time <em>just for you</em>.</h1>
    <span class="datechip">${fmt(start)} to ${fmtLong(end)}</span>
    <div class="chartbox">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Hours just for you over eight weeks">
        <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A0FF" stop-opacity=".35"/><stop offset="1" stop-color="#B9A0FF" stop-opacity="0"/></linearGradient></defs>
        ${ticks.map(t=>`<line x1="${L}" x2="${W-Rt}" y1="${y(t)}" y2="${y(t)}" stroke="rgba(236,226,255,.1)"/><text x="${L-6}" y="${y(t)+4}" text-anchor="end" font-size="10" fill="#7E7499">${t}h</text>`).join('')}
        ${[0,2,4,6,8].map(w=>`<text x="${x(w)}" y="${H-8}" text-anchor="middle" font-size="10" fill="#7E7499">${w?'Wk '+w:'Now'}</text>`).join('')}
        <path d="${area}" fill="url(#ga)"/>
        <path d="${path(base)}" fill="none" stroke="#7E7499" stroke-width="2" stroke-dasharray="4 4"/>
        <path id="pl" d="${path(plan)}" fill="none" stroke="#B9A0FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${x(0)}" cy="${y(0)}" r="5" fill="#FF9BBB" stroke="#120D20" stroke-width="2"/>
        <circle cx="${x(8)}" cy="${y(plan[8])}" r="6" fill="#B9A0FF" stroke="#120D20" stroke-width="2"/>
        <text x="${x(8)-8}" y="${y(plan[8])-10}" text-anchor="end" font-size="12" font-weight="700" fill="#F3EEFF">${plan[8]} hours for you</text>
      </svg>
      <div class="legend"><span><i></i>With your plan</span><span><i class="dash"></i>If nothing changes</span></div>
    </div>
    <p class="fine">“If nothing changes” uses your answer about the last time you did something just for you. “With your plan” assumes ${fq.every ? esc(expT().toLowerCase()) + ', ' + fq.short.toLowerCase() : 'one plan a week from your challenge'}. An illustration, not a promise.</p>
    <div class="grow"></div>
    <button class="btn" id="go">See my eight weeks</button>`);
  const pl = document.getElementById('pl');
  if(pl && pl.getTotalLength){ const len = pl.getTotalLength(); pl.style.strokeDasharray=len; pl.style.strokeDashoffset=len; pl.getBoundingClientRect(); pl.style.transition='stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)'; pl.style.strokeDashoffset=0; }
  btn('go', next);
}
function weekGrid(){
  const f = S.freq || 'once', ev = FREQS[f].every, start = S.dayDate || nextDow(6,1);
  const dates = {0:start};
  if(f==='monthly'){ const d = new Date(start); d.setMonth(d.getMonth()+1); dates[Math.round((d-start)/6048e5)] = d; }
  else if(ev){ for(let i=ev;i<8;i+=ev){ const d = new Date(start); d.setDate(d.getDate()+7*i); dates[i] = d; } }
  view(`
    <div class="eyebrow">Your 8-week Solo challenge</div>
    <h1>Week 1 is planned. The rest happens in <em>Fliq.it</em>.</h1>
    <p class="lede">${ev ? `Your ${FREQS[f].short.toLowerCase()} ${esc(expT().toLowerCase())} is planned. Each week the app gives it a new twist.` : 'Each week the app unlocks a new prompt. You pick the plan, and Fliq.it reminds you.'}</p>
    <div class="wgrid">${WEEKS.map(([t,d],i)=>`<div class="wk ${dates[i]?'on':i>3?'dim':''}"><small>Week ${i+1}${dates[i]?' · '+fmt(dates[i]):''}</small><b>${t}</b><span>${dates[i] ? esc(expT())+', planned' : d}</span></div>`).join('')}</div>
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    <button class="btn" id="go">Continue</button>`);
  btn('go', next);
}
function shareText(){
  const p = S.place || {};
  const where = p.type==='online' ? ' online' : p.type==='home' ? ' at home' : p.name ? ' at ' + p.name : '';
  const often = {weekly:" Making it a weekly thing.", monthly:" Once a month from now on."}[S.freq] || "";
  return `Taking myself on a solo date: ${expT().toLowerCase()}${where}, ${S.dayLabel} at ${S.time || ''}.${often} Holding myself to it.`;
}
function planReady(){
  view(`
    <div class="eyebrow">It's happening</div>
    <h1>Your first solo plan is ready.</h1>
    <div class="ticket">
      <div class="t-top"><small>Just you, ${N()}</small><strong>${esc(expT())}</strong></div>
      <div class="t-cut"></div>
      <div class="t-grid">
        <div><span>Date</span><b>${esc(S.dayLabel)}</b></div>
        <div><span>Time</span><b>${esc(S.time||'')}</b></div>
        <div><span>Where</span><b>${esc(placeLabel())}</b></div>
        <div><span>Repeats</span><b>${FREQS[S.freq||'once'].short}</b></div>
      </div>
    </div>
    <div class="eyebrow" style="margin-top:6px">Tell someone, so you actually go</div>
    <div class="msg" id="msg">${esc(shareText())}</div>
    <button class="copy" id="copy">Copy for your story</button>
    <div class="grow"></div>
    <button class="btn" id="go">Continue</button>`);
  btn('copy', async ev => {
    const b = ev.currentTarget;
    try{ await navigator.clipboard.writeText(shareText()); b.textContent = 'Copied'; }
    catch(e){ const r=document.createRange(); r.selectNodeContents(document.getElementById('msg')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent='Selected. Copy it now'; }
    track('share_copied');
  });
  btn('go', next);
}
function appStep(){
  const h = commit();
  const typeName = PROFILES[S.profile].name.replace('The ','');
  const link = Fliq.appLink(h);   // null until the app is live and CONFIG.APP_LINK_BASE is set
  view(`
    <div class="eyebrow">Your plan is saved, ${N()}</div>
    <h1>Fliq.it is <em>almost here</em>.</h1>
    <p class="lede">The app isn't live yet. When it opens, this is what's waiting for you.</p>
    <ul class="list">
      <li><span class="n">1</span><div><b>It's in your week</b><span>${esc(expT())}, ${esc(placeLabel())}, ${esc(S.dayLabel)} at ${esc(S.time||'')}${S.freq && S.freq!=='once' ? ', ' + FREQS[S.freq].short.toLowerCase() : ''}.${S.pop.p3?' We’ll remind you the day before.':''}</span></div></li>
      <li><span class="n">2</span><div><b>Plans that match your mood</b><span>Tell Fliq.it how you feel and how much energy you've got. It builds the plan.</span></div></li>
      <li><span class="n">3</span><div><b>Weeks 2 to 8 of your challenge</b><span>A new prompt each week, ideas picked for ${typeName}s, and a quick check-in after every plan.</span></div></li>
    </ul>
    <div class="weeks" aria-label="8-week challenge, week 1 planned">${[1,2,3,4,5,6,7,8].map(w=>`<i class="${w===1?'now':''}">W${w}</i>`).join('')}</div>
    <div class="grow"></div>
    <div class="proof"><div class="faces"><i></i><i></i><i></i></div><span>${proofLine()}</span></div>
    ${S.joined
      ? `<div class="panel joined"><h3>You're on the list</h3><p>We'll email <b>${esc(S.email)}</b> the day Fliq.it opens. Your plan is saved on this device.</p></div>`
      : `<label class="field" for="wl">Get early access<input type="email" id="wl" autocomplete="email" inputmode="email" placeholder="you@example.com"></label>
         <p class="err" id="wlerr" hidden></p>
         <button class="btn" id="wlgo">Join the early-access list</button>
         <p class="fine">By joining, you agree we can email you about the launch. See our <a href="${CONFIG.PRIVACY_URL}" target="_blank" rel="noopener">privacy policy</a>.</p>`}
    ${link ? `<a class="btn alt" id="dl" href="${esc(link)}">Lock in my plan on Fliq.it</a>` : ''}
    <a class="btn ghost" href="/friends-quiz/" id="other">Now try the Friends quiz</a>`);
  btn('wlgo', async () => {
    const b = document.getElementById('wlgo');
    if(await Fliq.submitEmail(S, document.getElementById('wl'), document.getElementById('wlerr'), b, MODE)){ track('lead_captured', {profile:S.profile, at:'final'}); commit(); E.paint(); }
  });
  btn('dl', () => track('app_open_click', {profile:S.profile, exp:S.exp, place_type:S.place && S.place.type, freq:S.freq}));
}

E.start();
