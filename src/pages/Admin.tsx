import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Msg = { id:number; name:string; email:string; body:string; created_at:string; is_read:boolean };

export default function Admin(){
  const [msgs,setMsgs]=useState<Msg[]>([]); const [err,setErr]=useState('');
  useEffect(()=>{ (async()=>{ try{
    const d=await api<{ok:boolean; messages:Msg[]}>('/api/messages');
    setMsgs(d.messages);
  }catch(e:any){ setErr(e.message);} })(); },[]);
  return (<div style={{maxWidth:800,margin:'40px auto',fontFamily:'system-ui'}}>
    <h2>Admin — Messages</h2>
    {err && <p style={{color:'crimson'}}>{err}</p>}
    <ul>{msgs.map(m=><li key={m.id}><b>{m.name}</b> &lt;{m.email}&gt; – {new Date(m.created_at).toLocaleString()}<br/>{m.body}</li>)}</ul>
  </div>);
}
