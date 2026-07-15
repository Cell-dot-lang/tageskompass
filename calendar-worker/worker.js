const json = (data, status=200, origin="*") => new Response(JSON.stringify(data), {status, headers:{"content-type":"application/json; charset=utf-8","access-control-allow-origin":origin,"cache-control":"no-store"}});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN || "*";
    if (request.method === "OPTIONS") return new Response(null,{headers:{"access-control-allow-origin":origin,"access-control-allow-methods":"GET,OPTIONS","access-control-allow-headers":"Content-Type"}});
    if (url.pathname === "/health") return json({ok:true},200,origin);
    if (url.pathname !== "/calendar") return json({error:"Not found"},404,origin);
    if (!env.ICLOUD_CALENDAR_URL) return json({error:"ICLOUD_CALENDAR_URL fehlt"},500,origin);
    try {
      const feedUrl = env.ICLOUD_CALENDAR_URL.replace(/^webcal:/i,"https:");
      const response = await fetch(feedUrl,{headers:{"user-agent":"Tageskompass Calendar Sync"}});
      if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
      const text = await response.text();
      const now = new Date();
      const from = new Date(now); from.setDate(from.getDate()-30);
      const to = new Date(now); to.setDate(to.getDate()+180);
      const events = expandEvents(parseICS(text),from,to);
      return json({events,updatedAt:new Date().toISOString()},200,origin);
    } catch (error) {
      return json({error:"Kalender konnte nicht geladen werden",detail:String(error.message||error)},502,origin);
    }
  }
};
function unfold(text){return text.replace(/\r?\n[ \t]/g,"");}
function unescapeText(v=""){return v.replace(/\\n/gi,"\n").replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\");}
function prop(lines,name){const line=lines.find(x=>x.startsWith(name+":")||x.startsWith(name+";"));if(!line)return null;return {meta:line.slice(name.length,line.indexOf(":")),value:line.slice(line.indexOf(":")+1)};}
function parseDate(p){if(!p)return null;const v=p.value.trim();const allDay=/VALUE=DATE/.test(p.meta)||/^\d{8}$/.test(v);if(allDay)return {date:new Date(`${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}T00:00:00Z`),allDay:true};const m=v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);if(!m)return null;return {date:new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]||"00"}${m[7]?"Z":""}`),allDay:false};}
function parseICS(text){return unfold(text).split("BEGIN:VEVENT").slice(1).map((block,i)=>{const lines=block.split("END:VEVENT")[0].split(/\r?\n/);const s=parseDate(prop(lines,"DTSTART"));if(!s)return null;const e=parseDate(prop(lines,"DTEND"));return {id:(prop(lines,"UID")?.value||`event-${i}`),title:unescapeText(prop(lines,"SUMMARY")?.value||"Termin"),start:s.date,end:e?.date||new Date(s.date.getTime()+(s.allDay?86400000:3600000)),allDay:s.allDay,location:unescapeText(prop(lines,"LOCATION")?.value||""),notes:unescapeText(prop(lines,"DESCRIPTION")?.value||""),rrule:prop(lines,"RRULE")?.value||"",exdates:lines.filter(x=>x.startsWith("EXDATE")).flatMap(x=>x.slice(x.indexOf(":")+1).split(",")).map(v=>parseDate({meta:"",value:v})?.date).filter(Boolean)};}).filter(Boolean);}
function serialize(ev,start,end,suffix=""){return {id:ev.id+suffix,title:ev.title,start:ev.allDay?start.toISOString().slice(0,10):start.toISOString(),end:ev.allDay?end.toISOString().slice(0,10):end.toISOString(),allDay:ev.allDay,location:ev.location,notes:ev.notes};}
function expandEvents(events,from,to){const out=[];for(const ev of events){const duration=ev.end-ev.start;if(!ev.rrule){if(ev.end>=from&&ev.start<=to)out.push(serialize(ev,ev.start,ev.end));continue;}const rule=Object.fromEntries(ev.rrule.split(";").map(x=>x.split("=")));const freq=rule.FREQ;const interval=Number(rule.INTERVAL||1);const count=Number(rule.COUNT||0);const until=rule.UNTIL?parseDate({meta:"",value:rule.UNTIL})?.date:null;let cur=new Date(ev.start);let n=0;while(cur<=to&&n<1000){if((!until||cur<=until)&&cur>=from&&!ev.exdates.some(d=>Math.abs(d-cur)<1000))out.push(serialize(ev,new Date(cur),new Date(cur.getTime()+duration),`-${cur.toISOString()}`));n++;if(count&&n>=count)break;if(freq==="DAILY")cur.setUTCDate(cur.getUTCDate()+interval);else if(freq==="WEEKLY")cur.setUTCDate(cur.getUTCDate()+7*interval);else if(freq==="MONTHLY")cur.setUTCMonth(cur.getUTCMonth()+interval);else if(freq==="YEARLY")cur.setUTCFullYear(cur.getUTCFullYear()+interval);else break;}}
return out.sort((a,b)=>a.start.localeCompare(b.start));}
