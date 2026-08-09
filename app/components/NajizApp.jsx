"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import {
  Home, BookOpen, ClipboardList, Brain, Flame, Trophy, Clock, ChevronLeft,
  ChevronRight, Check, X, RotateCcw, Award, TrendingUp, Layers, Calendar,
  Sparkles, Target, ListChecks, Loader2, Sun, Moon, Bell, BellRing, Star,
  Shield, Users, GraduationCap, Menu, ArrowLeft, Zap, MapPin, Lock, ShoppingCart, CheckCircle2,
  Mail, LogOut, KeyRound, AlertCircle, UserCircle, Phone, Cake, Upload, FileCheck2, Hourglass, Settings2, Plus, Minus,
  PlayCircle, Video, Film, ListVideo, CheckCircle
} from "lucide-react";

/* ============================= بنك الأسئلة ============================= */
/* [id, domain, السؤال, [4 خيارات], index الإجابة الصحيحة, الشرح] */
/* بنك تجريبي عام صغير (10 أسئلة) — الوحيد المسموح يكون داخل الكود لأنه مجاني ومعلن أصلًا،
   بعكس بنك الأسئلة الكامل اللي بقى محفوظ بأمان في قاعدة البيانات ومتاح بس لمين دفع فعليًا */
const TRIAL_QUESTIONS = [
[1,"business","مدير مشروع لاحظ أن فوائد المشروع لم تعد متوافقة مع استراتيجية الشركة بعد تغيير في الإدارة العليا. ما أفضل إجراء؟",["الاستمرار في تنفيذ الخطة كما هي","رفع الأمر للراعي لمراجعة الـBusiness Case ومواءمته مع التوجه الجديد","إيقاف المشروع فورًا دون الرجوع لأي جهة","تعديل النطاق بمفرده دون الرجوع للجهات المعنية"],1,"مواءمة المشروع مع الاستراتيجية مسؤولية مشتركة، ويجب تصعيد أي انحراف عن القيمة للراعي لمراجعة الـBusiness Case."],
[9,"business","منظمة بدأت تستخدم أدوات الذكاء الاصطناعي للمساعدة في تحليل بيانات المخاطر. ما مسؤولية مدير المشروع الأساسية؟",["الاعتماد الكامل على مخرجات الأداة دون مراجعة","التحقق من دقة وأخلاقيات وموثوقية مخرجات الأداة قبل اتخاذ القرار","منع استخدام أي أدوات ذكاء اصطناعي في المشروع","تفويض القرار بالكامل للأداة"],1,"دمج الذكاء الاصطناعي محور جديد، لكن يبقى الحكم البشري والتحقق من الجودة والأخلاقيات مسؤولية المدير."],
[15,"business","ما أهم معيار يجب مراعاته عند تقييم قيمة مشروع من منظور 2026؟",["عدد ساعات العمل المنجزة فقط","مدى تحقيق النتائج (Outcomes) والفوائد المستدامة","عدد الاجتماعات المعقودة","حجم الوثائق المنتجة"],1,"التوجه الجديد يقيس النجاح بالقيمة والنتائج المستدامة لا فقط الالتزام بالقيود الثلاثية."],
[27,"process","أثناء تنفيذ المشروع، طلب أحد أصحاب المصلحة تغييرًا في النطاق دون المرور بعملية إدارة التغيير الرسمية. ما أول إجراء؟",["تنفيذ التغيير فورًا لإرضاء صاحب المصلحة","توجيه الطلب عبر Integrated Change Control الرسمية لتقييمه","رفض الطلب نهائيًا دون تقييم","تجاهل الطلب حتى ينساه صاحب المصلحة"],1,"أي تغيير مقترح يجب أن يمر عبر Integrated Change Control لضمان تقييم الأثر قبل القرار."],
[40,"process","أثناء اجتماع مراجعة الجودة، وُجد أن أحد المخرجات لا يطابق المواصفات المتفق عليها. ما أول إجراء مناسب؟",["رفض المخرج نهائيًا وإنهاء عقد المورد فورًا","تحليل السبب الجذري للانحراف وتحديد إجراء تصحيحي بالتنسيق مع الفريق","تجاهل الانحراف إذا كان بسيطًا","تسليم المخرج للعميل كما هو"],1,"معالجة انحرافات الجودة تبدأ بتحليل السبب الجذري قبل أي إجراء تصحيحي أو تصعيدي."],
[50,"process","ما الغرض من إجراء Quality Audit أثناء تنفيذ المشروع؟",["تحديد ما إذا كانت الأنشطة تتبع سياسات وإجراءات الجودة المعتمدة في المنظمة","تحديد سعر المشروع النهائي","تحديد عدد الموظفين المطلوبين","إلغاء خطة إدارة الجودة"],0,"المراجعة (Audit) تتحقق من الالتزام بالعمليات والمعايير المعتمدة وتُستخدم لتحديد فرص التحسين."],
[71,"people","أحد أعضاء الفريق يشعر بالإحباط بسبب تضارب في الأولويات بينه وبين زميل آخر. ما أفضل تصرف من مدير المشروع؟",["تجاهل الأمر لأنه شأن شخصي بين الموظفين","عقد اجتماع منفصل مع الطرفين لفهم جذور الخلاف ثم تسهيل حوار مباشر للوصول لحل مشترك (Collaborate)","اتخاذ قرار نهائي بمعزل عن الطرفين وفرضه عليهما","تحويل الأمر فورًا للموارد البشرية دون أي محاولة داخلية"],1,"أسلوب التعاون وحل المشكلات (Collaborate) هو الأنسب لحل النزاعات الجوهرية بشكل يحافظ على العلاقة."],
[80,"people","ما المقصود بمفهوم Emotional Intelligence في سياق القيادة؟",["القدرة على التحكم الكامل في مشاعر الآخرين","القدرة على إدراك وفهم وإدارة مشاعر الذات والآخرين بفعالية لتحسين التفاعل والقرارات","القدرة على حفظ أكبر قدر من المعلومات التقنية","القدرة على العمل دون أي تفاعل اجتماعي"],1,"الذكاء العاطفي يشمل الوعي الذاتي وإدارة الانفعالات والتعاطف مع الآخرين، وهو مهارة قيادية أساسية."],
[90,"people","ما أفضل نمط تواصل عند الحاجة لنقل معلومة معقدة وحساسة لصاحب مصلحة رئيسي يفضل التفاصيل الدقيقة؟",["تواصل شفهي سريع دون توثيق","تقرير مكتوب مفصل مدعوم بلقاء لمناقشة النقاط الحساسة والإجابة عن الأسئلة","رسالة نصية قصيرة فقط","تجاهل التواصل حتى يُطلب منه ذلك"],1,"المعلومات المعقدة والحساسة تحتاج توثيقًا مكتوبًا دقيقًا مدعومًا بتواصل مباشر للرد على الاستفسارات."],
[100,"people","ما أفضل إجراء لبناء الثقة مع فريق جديد يعمل مع مدير المشروع لأول مرة؟",["فرض القواعد دون أي تفسير","التواصل الصريح والشفاف حول التوقعات والأهداف والوفاء بالوعود الصغيرة باستمرار لبناء المصداقية تدريجيًا","تجنب أي تفاعل شخصي مع الفريق","التركيز فقط على متابعة الأداء دون أي بناء للعلاقة"],1,"بناء الثقة يبدأ بالشفافية والوفاء المستمر بالالتزامات الصغيرة، وهو أساس العلاقة القيادية الفعالة."]
];

const FLASHCARDS = [
["EV","القيمة المكتسبة: قيمة العمل المنجز فعليًا حتى تاريخه — EV = BAC × نسبة الإنجاز الفعلي"],
["CPI","مؤشر أداء التكلفة: CPI = EV ÷ AC — أقل من 1 يعني تجاوزًا في التكلفة"],
["SPI","مؤشر أداء الجدول: SPI = EV ÷ PV — أقل من 1 يعني تأخرًا عن الجدول"],
["EAC","التقدير عند الإكمال: التكلفة الإجمالية المتوقعة للمشروع عند انتهائه"],
["Critical Path","المسار الحرج: أطول مسار من الأنشطة المترابطة، يحدد أقصر مدة ممكنة للمشروع"],
["Float","الوقت المتاح لتأخير نشاط دون التأثير — Free على النشاط التالي، Total على نهاية المشروع"],
["Servant Leadership","القيادة الخادمة: التركيز على تمكين ودعم الفريق وإزالة العوائق"],
["DoD","تعريف الاكتمال: معايير متفق عليها تحدد متى يكون العمل مكتملًا فعليًا"],
["Velocity","السرعة: متوسط نقاط القصة المنجزة في كل Sprint، يُستخدم للتنبؤ بالسعة المستقبلية"],
["Transfer","نقل الخطر: تحويل الأثر المالي لطرف ثالث (مثل التأمين) دون إلغاء احتمال حدوثه"],
["ROM Estimate","تقدير تقريبي سريع (-25% إلى +75%) يُستخدم في المراحل المبكرة جدًا من المشروع"],
["Business Case","تحليل الجدوى: يبرر الاستثمار بمقارنة التكلفة بالفائدة المتوقعة"],
["Stakeholder Register","سجل أصحاب المصلحة: يوثق معلوماتهم ومصالحهم وتأثيرهم لإدارة إشراكهم بفعالية"],
["Progressive Elaboration","التفصيل التدريجي: تحسين دقة الخطط باستمرار مع توفر معلومات أكثر أثناء التقدم"]
];

/* meta المجالات الخاصة بشاشة التجربة المجانية بس (بتستخدم بنك PMP التجريبي الصغير) */
const PMP_TRIAL_DOMAIN_META = {
  business: { label: "بيئة العمل", color: "#FFC857" },
  process:  { label: "العمليات",   color: "#00B894" },
  people:   { label: "الأفراد",    color: "#3A2E8C" },
};

const COLORS = { bg:"var(--bg)", panel:"var(--panel)", panel2:"var(--panel2)", purple:"var(--purple)", teal:"var(--teal)", gold:"var(--gold)", light:"var(--text)", sub:"var(--sub)" };

const PRICE_USD = 79;

/* بريد/بريدك الإداري — بدّله ببريدك الحقيقي، ولازم يطابق نفس البريد المكتوب في سياسات RLS بتاعة Supabase */
const ADMIN_EMAILS = ["papamoussaxp@gmail.com"];

/* الشهادات وأسعارها ومجالاتها بقت مُدارة بالكامل من قاعدة البيانات (جدول certifications) —
   الإدارة تقدر تضيف/تعدّل/تخفي أي شهادة من لوحة الإدارة من غير أي تعديل في الكود */
const ICON_MAP = { Target, Shield, Users, ClipboardList, Lock, GraduationCap, BookOpen, Award, Video, Film };
const iconFor = (key) => ICON_MAP[key] || Target;

function useCertifications(){
  const [certList, setCertList] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    setCertList((data||[]).map(c => ({
      code: c.code, name: c.name, full: c.full_name, desc: c.description,
      status: c.status, icon: iconFor(c.icon_key), price_usd: c.price_usd,
      gumroad_url: c.gumroad_url, domains: c.domains || {},
    })));
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const domainMetaByCode = {};
  (certList||[]).forEach(c => { domainMetaByCode[c.code] = c.domains; });

  return { certList: certList || [], domainMetaByCode, loading, refetch: load };
}

/* بيانات آراء نموذجية توضيحية — يُستحسن استبدالها بآراء عملاء حقيقيين بعد الإطلاق */
const TESTIMONIALS = [
  { name:"عبدالله الحربي", city:"الرياض", stars:5, text:"جدول المذاكرة رتّب وقتي بشكل مختلف تمامًا، وقدرت أحدد نقاط ضعفي بدقة قبل الامتحان." },
  { name:"نورة القحطاني", city:"جدة", stars:5, text:"الأسئلة قريبة جدًا من أسلوب الامتحان الفعلي، والشرح بعد كل سؤال وفّر عليّ وقت مراجعة كبير." },
  { name:"سلطان العتيبي", city:"الدمام", stars:5, text:"حبيت إن المنصة بتوريني بالظبط أنا ضعيف في إيه، مش بس بتديني درجة نهائية." },
  { name:"ريم الغامدي", city:"مكة المكرمة", stars:4, text:"استخدمت الامتحان التجريبي بالمؤقت قبل الاختبار الحقيقي بأسبوع، ساعدني أدير وقتي صح." },
  { name:"فهد الزهراني", city:"الطائف", stars:5, text:"تصميم واضح وسهل حتى من الموبايل، وحسيت إن في حد فعليًا بيتابع معايا مذاكرتي." },
];

/* ============================= أدوات مساعدة ============================= */
const todayStr = () => new Date().toISOString().slice(0,10);
const shuffle = (arr) => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
/* يبعثر ترتيب الاختيارات الأربعة لسؤال معين ويتتبّع فهرس الإجابة الصحيحة الجديد،
   عشان محدش يقدر يحفظ نمط ثابت (زي "الإجابة دايمًا حرف ب" أو "أطول سطر هو الصح") */
const shuffleOptions = (q) => {
  const [qid, domain, text, opts, ans, exp] = q;
  const order = shuffle(opts.map((_,i)=>i));
  return [qid, domain, text, order.map(i=>opts[i]), order.indexOf(ans), exp];
};
const emptyCertProgress = () => ({ examDate:null, activity:[], records:{}, mockHistory:[] });
const emptyProgress = () => ({ certs:{} });
const getCertProgress = (progress, certCode) => (progress && progress.certs && progress.certs[certCode]) || emptyCertProgress();

/* بيانات المستخدمين القدامى كانت محفوظة بشكل مسطّح (سؤال واحد فقط لـ PMP) —
   لو لقينا شكل قديم نحوّله تلقائيًا لصيغة متعددة الشهادات بدون ما نفقد تقدمهم */
const migrateProgress = (raw) => {
  if(!raw) return emptyProgress();
  if(raw.certs) return raw;
  if(raw.records || raw.activity || raw.examDate){
    return { certs: { PMP: { examDate: raw.examDate||null, activity: raw.activity||[], records: raw.records||{}, mockHistory: raw.mockHistory||[] } } };
  }
  return emptyProgress();
};

function useAuth(){
  const [session, setSession] = useState(undefined); // undefined = loading, null = logged out
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess)=>{
      setSession(sess);
    });
    return ()=> listener.subscription.unsubscribe();
  },[]);
  return session;
}

function useProgress(userId){
  const [progress,setProgress] = useState(null);
  const [loading,setLoading] = useState(true);
  const [saveError,setSaveError] = useState(false);

  useEffect(()=>{
    if(!userId){ setProgress(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    (async ()=>{
      const { data, error } = await supabase.from("progress").select("data").eq("user_id", userId).maybeSingle();
      if(cancelled) return;
      if(error || !data){
        setProgress(emptyProgress());
      } else {
        setProgress(migrateProgress(data.data));
      }
      setLoading(false);
    })();
    return ()=>{ cancelled = true; };
  },[userId]);

  const save = async (next) => {
    setProgress(next);
    if(!userId) return;
    try{
      const { error } = await supabase.from("progress").upsert(
        { user_id: userId, data: next, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      setSaveError(!!error);
    }catch(e){ setSaveError(true); }
  };

  return { progress, setProgressAndSave: save, loading, saveError };
}

function useProfile(userId){
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!userId){ setProfile(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    (async ()=>{
      const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
      if(cancelled) return;
      setProfile(data || { user_id:userId, full_name:"", birth_date:"", phone:"", selected_certs:[] });
      setLoading(false);
    })();
    return ()=>{ cancelled = true; };
  },[userId]);

  const save = async (next) => {
    setProfile(next);
    if(!userId) return { ok:false };
    const { error } = await supabase.from("profiles").upsert(
      { ...next, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    return { ok: !error, error };
  };

  return { profile, saveProfile: save, loading };
}

function usePurchases(userId){
  const [purchases, setPurchases] = useState({});
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    if(!userId) return;
    const { data } = await supabase.from("purchases").select("*").eq("user_id", userId).order("created_at",{ascending:false});
    const byCode = {};
    (data||[]).forEach(row=>{ if(!byCode[row.cert_code]) byCode[row.cert_code]=row; });
    setPurchases(byCode);
  };

  useEffect(()=>{
    if(!userId){ setPurchases({}); setLoading(false); return; }
    setLoading(true);
    refetch().finally(()=>setLoading(false));
  },[userId]);

  const addLocal = (certCode, row) => setPurchases(p=>({...p, [certCode]: row}));

  return { purchases, loading, refetch, addLocal };
}

/* يجيب بنك أسئلة شهادة معينة من قاعدة البيانات — Postgres نفسه بيرفض الطلب لو المستخدم
   مدفعش، بغض النظر عن أي حاجة في الواجهة، فده الحماية الحقيقية مش مجرد إخفاء بصري */
function useQuestions(certCode){
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!certCode){ setQuestions(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    (async ()=>{
      const { data, error } = await supabase.from("questions").select("*").eq("cert_code", certCode).order("id");
      if(cancelled) return;
      if(error || !data){ setQuestions([]); }
      else {
        setQuestions(data.map(r => [r.id, r.domain, r.question, r.options, r.correct_index, r.explanation]));
      }
      setLoading(false);
    })();
    return ()=>{ cancelled = true; };
  },[certCode]);

  return { questions, loading };
}

/* ============================= الكورسات — الأدوات المساعدة ============================= */
function useCourses(){
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    (async ()=>{
      const { data } = await supabase.from("courses").select("*").eq("status","published").order("created_at");
      setCourses(data||[]);
      setLoading(false);
    })();
  },[]);
  return { courses, loading };
}

function useCoursePurchases(userId){
  const [purchases, setPurchases] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(!userId){ setPurchases({}); setLoading(false); return; }
    (async ()=>{
      const { data } = await supabase.from("course_purchases").select("*").eq("user_id", userId).order("created_at",{ascending:false});
      const byId = {};
      (data||[]).forEach(row=>{ if(!byId[row.course_id]) byId[row.course_id]=row; });
      setPurchases(byId);
      setLoading(false);
    })();
  },[userId]);
  const addLocal = (courseId, row) => setPurchases(p=>({...p, [courseId]: row}));
  return { purchases, loading, addLocal };
}

function useLessons(courseId){
  const [lessons, setLessons] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(!courseId){ setLessons(null); setLoading(false); return; }
    setLoading(true);
    (async ()=>{
      const { data } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order_index");
      setLessons(data||[]);
      setLoading(false);
    })();
  },[courseId]);
  return { lessons, loading };
}


function useLessonProgress(userId){
  const [done, setDone] = useState({});
  const [completedAt, setCompletedAt] = useState({});
  useEffect(()=>{
    if(!userId) return;
    (async ()=>{
      const { data } = await supabase.from("lesson_progress").select("lesson_id, completed_at").eq("user_id", userId);
      const map = {}; const dates = {};
      (data||[]).forEach(r=>{ map[r.lesson_id]=true; dates[r.lesson_id]=r.completed_at; });
      setDone(map); setCompletedAt(dates);
    })();
  },[userId]);
  const markDone = async (userId, lessonId) => {
    const now = new Date().toISOString();
    setDone(d=>({...d,[lessonId]:true}));
    setCompletedAt(d=>({...d,[lessonId]:now}));
    await supabase.from("lesson_progress").upsert({ user_id:userId, lesson_id:lessonId, completed:true, completed_at:now });
  };
  return { done, completedAt, markDone };
}

function youtubeEmbedUrl(url){
  if(!url) return "";
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
  const id = m ? m[1] : url.trim();
  return `https://www.youtube.com/embed/${id}`;
}

/* ============================= المكون الرئيسي ============================= */
export default function NajizApp(){
  const session = useAuth();
  const userId = session?.user?.id || null;
  const { progress, setProgressAndSave, loading } = useProgress(userId);
  const { profile, saveProfile, loading: profileLoading } = useProfile(userId);
  const { purchases, loading: purchasesLoading, addLocal: addPurchaseLocal } = usePurchases(userId);

  /* التنقل بقى مبني على الرابط الحقيقي في المتصفح — كل شاشة ليها URL خاص بيها،
     يدعم الرجوع للخلف، حفظ الصفحة، والـ Refresh بشكل صحيح */
  const router = useRouter();
  const pathname = usePathname();
  const segments = (pathname || "/").split("/").filter(Boolean);
  const routeCourseId = (segments[0]==="courses" && segments[1]) ? segments[1] : null;
  const view = segments.length===0 ? "landing" : (routeCourseId ? "coursePlayer" : segments[0]);
  const setView = (v) => { router.push(v==="landing" ? "/" : `/${v}`); };

  const theme = "light"; // الوضع النهاري ثابت بقرار من صاحب المنصة
  const [activeCert, setActiveCert] = useState(null);
  const { questions: activeQuestions, loading: questionsLoading } = useQuestions(activeCert);
  const { courses, loading: coursesLoading } = useCourses();
  const { certList, domainMetaByCode, loading: certsLoading } = useCertifications();
  const { purchases: coursePurchases, loading: coursePurchasesLoading, addLocal: addCoursePurchaseLocal } = useCoursePurchases(userId);
  const selectedCourseId = routeCourseId;

  const unlockedCerts = Object.keys(purchases).filter(c=>purchases[c]?.status==="approved");

  useEffect(()=>{
    // نختار شهادة نشطة تلقائيًا: أول شهادة مفعّلة، أو أول شهادة اختارها المستخدم لو مفيش شراء بعد
    if(!activeCert){
      if(unlockedCerts.length>0) setActiveCert(unlockedCerts[0]);
      else if(profile?.selected_certs?.length>0) setActiveCert(profile.selected_certs[0]);
    } else if(!unlockedCerts.includes(activeCert) && unlockedCerts.length>0){
      setActiveCert(unlockedCerts[0]);
    }
  },[purchases, profile]); // eslint-disable-line

  const PROTECTED_VIEWS = ["dashboard","practice","review","mock","flashcards","profile","courses","coursePlayer"];
  useEffect(()=>{
    // بمجرد تسجيل الدخول بنجاح، لو المستخدم كان في صفحة auth ننقله للوحة التحكم
    if(session && view==="auth") setView("dashboard");
    if(!session && session!==undefined && PROTECTED_VIEWS.includes(view)) setView("landing");
  },[session]); // eslint-disable-line

  const goStart = () => setView(session ? "dashboard" : "auth");
  const startTrial = () => setView("trial");
  const signOut = async () => { await supabase.auth.signOut(); setView("landing"); };

  if(session===undefined){
    return (
      <div className={`theme-${theme}`} style={{minHeight:"100vh",background:COLORS.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cairo',sans-serif"}}>
        <FontLoader /><GlobalStyle />
        <div style={{color:COLORS.light,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <Loader2 className="spin" size={32} color={COLORS.teal}/>
          <span>جاري التحقق من حسابك...</span>
        </div>
      </div>
    );
  }

  if(view==="auth"){
    return (
      <div dir="rtl" className={`theme-${theme}`} style={{minHeight:"100vh",background:COLORS.bg,fontFamily:"'Cairo',sans-serif",color:COLORS.light}}>
        <FontLoader /><GlobalStyle />
        <AuthScreen onBack={()=>setView("landing")} />
      </div>
    );
  }

  if(view==="trial"){
    return (
      <div dir="rtl" className={`theme-${theme}`} style={{minHeight:"100vh",background:COLORS.bg,fontFamily:"'Cairo',sans-serif",color:COLORS.light}}>
        <FontLoader /><GlobalStyle />
        <TrialQuiz onBack={()=>setView("landing")} onWantAccount={goStart} />
      </div>
    );
  }

  if(session && (loading || !progress || purchasesLoading)){
    return (
      <div className={`theme-${theme}`} style={{minHeight:"100vh",background:COLORS.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cairo',sans-serif"}}>
        <FontLoader /><GlobalStyle />
        <div style={{color:COLORS.light,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <Loader2 className="spin" size={32} color={COLORS.teal}/>
          <span>جاري تحميل بياناتك...</span>
        </div>
      </div>
    );
  }

  const recordAnswer = (certCode, qid, correct, domain) => {
    const next = JSON.parse(JSON.stringify(progress));
    if(!next.certs[certCode]) next.certs[certCode] = emptyCertProgress();
    const cp = next.certs[certCode];
    const rec = cp.records[qid] || { attempts:0, correct:false };
    rec.attempts += 1; rec.correct = correct; rec.domain = domain;
    cp.records[qid] = rec;
    const t = todayStr();
    if(!cp.activity.includes(t)) cp.activity.push(t);
    setProgressAndSave(next);
  };

  const setExamDate = (certCode, d) => {
    const next = JSON.parse(JSON.stringify(progress));
    if(!next.certs[certCode]) next.certs[certCode] = emptyCertProgress();
    next.certs[certCode].examDate = d;
    setProgressAndSave(next);
  };

  const addMockResult = (certCode, entry) => {
    const next = JSON.parse(JSON.stringify(progress));
    if(!next.certs[certCode]) next.certs[certCode] = emptyCertProgress();
    next.certs[certCode].mockHistory.push(entry);
    setProgressAndSave(next);
  };

  const certProgress = activeCert ? getCertProgress(progress, activeCert) : null;
  const isUnlocked = activeCert && unlockedCerts.includes(activeCert);
  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email);
  const questionsReady = isUnlocked && !questionsLoading && activeQuestions;

  return (
    <div dir="rtl" className={`theme-${theme}`} style={{minHeight:"100vh",background:COLORS.bg,fontFamily:"'Cairo',sans-serif",color:COLORS.light,transition:"background .2s ease,color .2s ease"}}>
      <FontLoader />
      <GlobalStyle />
      {view!=="landing" && (
        <NavBar view={view} setView={setView} signOut={signOut} userEmail={session?.user?.email}
          unlockedCerts={unlockedCerts} activeCert={activeCert} setActiveCert={setActiveCert} isAdmin={isAdmin} certList={certList} />
      )}
      {view==="landing" && <Landing onStart={goStart} onTrial={startTrial} certList={certList} certsLoading={certsLoading} courses={courses} coursesLoading={coursesLoading} />}
      {view==="admin" && (isAdmin ? <AdminScreen /> : <PaywallScreen setView={setView} />)}
      {view==="dashboard" && (
        unlockedCerts.length===0 ? (
          <PaywallScreen setView={setView} />
        ) : !questionsReady ? (
          <LoadingBlock text="جاري تحميل بنك الأسئلة..." />
        ) : (
          <Dashboard progress={certProgress} certCode={activeCert} questions={activeQuestions} domainMeta={domainMetaByCode[activeCert]||{}} certList={certList}
            setExamDate={(d)=>setExamDate(activeCert,d)} setView={setView} profile={profile} />
        )
      )}
      {view==="profile" && (
        <ProfileScreen profile={profile} loading={profileLoading} saveProfile={saveProfile} progress={progress} certList={certList}
          userId={userId} setView={setView} purchases={purchases} onPurchaseAdded={addPurchaseLocal} />
      )}
      {view==="practice" && (
        !isUnlocked ? <PaywallScreen setView={setView} /> :
        !questionsReady ? <LoadingBlock text="جاري تحميل الأسئلة..." /> :
        <Practice progress={certProgress} certCode={activeCert} domainMeta={domainMetaByCode[activeCert]||{}} recordAnswer={(qid,c,d)=>recordAnswer(activeCert,qid,c,d)} onExit={()=>setView("dashboard")} pool={activeQuestions} title="التدريب الحر" />
      )}
      {view==="review" && (
        !isUnlocked ? <PaywallScreen setView={setView} /> :
        !questionsReady ? <LoadingBlock text="جاري تحميل الأسئلة..." /> :
        <Practice progress={certProgress} certCode={activeCert} domainMeta={domainMetaByCode[activeCert]||{}} recordAnswer={(qid,c,d)=>recordAnswer(activeCert,qid,c,d)} onExit={()=>setView("dashboard")}
          pool={activeQuestions.filter(q=>certProgress.records[q[0]] && certProgress.records[q[0]].correct===false)} title="مراجعة الأخطاء" isReview />
      )}
      {view==="mock" && (
        !isUnlocked ? <PaywallScreen setView={setView} /> :
        !questionsReady ? <LoadingBlock text="جاري تحميل الأسئلة..." /> :
        <MockExam certCode={activeCert} domainMeta={domainMetaByCode[activeCert]||{}} pool={activeQuestions} recordAnswer={(qid,c,d)=>recordAnswer(activeCert,qid,c,d)} addMockResult={(e)=>addMockResult(activeCert,e)} onExit={()=>setView("dashboard")} />
      )}
      {view==="flashcards" && <Flashcards onExit={()=>setView("dashboard")} />}
      {view==="courses" && (
        <CourseCatalog courses={courses} loading={coursesLoading} purchases={coursePurchases}
          userId={userId} onPurchaseAdded={addCoursePurchaseLocal}
          onOpenCourse={(id)=>{ router.push(`/courses/${id}`); }} />
      )}
      {view==="coursePlayer" && (
        <CoursePlayer courseId={selectedCourseId} course={courses?.find(c=>c.id===selectedCourseId)}
          purchased={coursePurchases[selectedCourseId]?.status==="approved"} userId={userId} profile={profile} saveProfile={saveProfile}
          onExit={()=>setView("courses")} />
      )}
    </div>
  );
}

function LoadingBlock({ text }){
  return (
    <div style={{textAlign:"center",padding:"100px 20px",color:COLORS.sub}}>
      <Loader2 className="spin" size={26} color={COLORS.teal}/>
      <div style={{marginTop:12}}>{text}</div>
    </div>
  );
}

/* ============================= شاشة القفل (لسه ما فُعِّلتش أي شهادة) ============================= */
function PaywallScreen({ setView }){
  return (
    <div style={{maxWidth:520,margin:"0 auto",padding:"80px 20px",textAlign:"center"}}>
      <div className="card" style={{padding:36}}>
        <Lock size={30} color={COLORS.gold}/>
        <h3 style={{margin:"14px 0 6px"}}>لسه ما فعّلتش أي شهادة</h3>
        <p style={{color:COLORS.sub,fontSize:14,lineHeight:1.9,marginBottom:22}}>
          عشان توصل لبنك الأسئلة والامتحانات التجريبية الكاملة، لازم تشتري شهادة الأول من ملفك الشخصي ونعتمد إيصال الدفع.
        </p>
        <button className="btn btn-primary" onClick={()=>setView("profile")}>روح لملفي الشخصي</button>
      </div>
    </div>
  );
}

/* ============================= شاشة تسجيل الدخول ============================= */
function AuthScreen({ onBack }){
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    try{
      if(mode==="signup"){
        const { data, error } = await supabase.auth.signUp({ email, password });
        if(error){ setError(error.message); setBusy(false); return; }
        // ننشئ صف الملف الشخصي فورًا ببيانات التسجيل، سواء احتاج تأكيد إيميل أو لأ
        if(data?.user?.id){
          await supabase.from("profiles").upsert({
            user_id: data.user.id,
            full_name: fullName,
            birth_date: birthDate || null,
            phone: phone,
            selected_certs: [],
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id" });
        }
        if(data?.session){
          // تأكيد الإيميل مش مفعّل في المشروع، فالحساب دخل على طول
          setNotice("تم إنشاء الحساب بنجاح!");
        } else {
          setNotice("تم إنشاء الحساب! افتح إيميلك ودوس على رابط التأكيد، وبعدين ارجع سجّل دخول.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) setError(error.message);
      }
    }catch(e){ setError("حدث خطأ غير متوقع، حاول مرة أخرى."); }
    setBusy(false);
  };

  const inputStyle = {width:"100%",padding:"12px 44px 12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14};

  return (
    <div style={{maxWidth:440,margin:"0 auto",padding:"50px 20px",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:26}}><Logo /></div>
      <div className="card" style={{padding:28}}>
        <div style={{display:"flex",gap:8,marginBottom:22,background:"var(--panel2)",borderRadius:12,padding:4}}>
          <button type="button" onClick={()=>setMode("signin")} style={{flex:1,padding:"10px 0",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontWeight:700,background:mode==="signin"?COLORS.teal:"transparent",color:mode==="signin"?"#00190f":COLORS.sub}}>تسجيل الدخول</button>
          <button type="button" onClick={()=>setMode("signup")} style={{flex:1,padding:"10px 0",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontWeight:700,background:mode==="signup"?COLORS.teal:"transparent",color:mode==="signup"?"#00190f":COLORS.sub}}>حساب جديد</button>
        </div>

        <form onSubmit={submit}>
          {mode==="signup" && <>
            <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>الاسم الكامل</label>
            <div style={{position:"relative",marginBottom:16}}>
              <UserCircle size={17} color={COLORS.sub} style={{position:"absolute",right:14,top:14}}/>
              <input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="مثال: أحمد الغامدي" style={inputStyle}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>تاريخ الميلاد</label>
                <input required type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} style={{...inputStyle,padding:"12px 14px"}}/>
              </div>
              <div>
                <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>رقم الجوال</label>
                <input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xxxxxxxx" style={{...inputStyle,padding:"12px 14px"}}/>
              </div>
            </div>
          </>}

          <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>البريد الإلكتروني</label>
          <div style={{position:"relative",marginBottom:16}}>
            <Mail size={17} color={COLORS.sub} style={{position:"absolute",right:14,top:14}}/>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
          </div>
          <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>كلمة المرور</label>
          <div style={{position:"relative",marginBottom:20}}>
            <KeyRound size={17} color={COLORS.sub} style={{position:"absolute",right:14,top:14}}/>
            <input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
          </div>

          {error && <div style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#ff8a8a",marginBottom:14}}><AlertCircle size={16} style={{marginTop:2,flexShrink:0}}/> {error}</div>}
          {notice && <div style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:COLORS.teal,marginBottom:14}}><Check size={16} style={{marginTop:2,flexShrink:0}}/> {notice}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy} style={{width:"100%",opacity:busy?0.7:1}}>
            {busy ? "لحظة..." : mode==="signin" ? "دخول" : "إنشاء الحساب"}
          </button>
        </form>
      </div>
      <button onClick={onBack} style={{marginTop:20,background:"none",border:"none",color:COLORS.sub,fontFamily:"'Cairo',sans-serif",fontSize:13,cursor:"pointer"}}>← رجوع للصفحة الرئيسية</button>
    </div>
  );
}

/* ============================= تجربة مجانية 10 أسئلة (بدون تسجيل دخول) ============================= */
function TrialQuiz({ onBack, onWantAccount }){
  const [pool] = useState(()=> shuffle(TRIAL_QUESTIONS).map(shuffleOptions));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const finished = idx >= pool.length;
  const q = pool[idx];

  const submit = (i) => {
    if(revealed) return;
    setSelected(i); setRevealed(true);
    if(i===q[4]) setCorrectCount(c=>c+1);
  };
  const next = () => { setIdx(idx+1); setSelected(null); setRevealed(false); };

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"24px 20px 60px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <Logo />
      </div>

      {!finished ? (
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:800,fontSize:18}}>تجربة مجانية — سؤال {idx+1} من {pool.length}</div>
            <div style={{fontSize:12.5,color:COLORS.sub}}>بدون تسجيل</div>
          </div>
          <div style={{height:6,borderRadius:6,background:"var(--track)",marginBottom:20,overflow:"hidden"}}>
            <div style={{width:`${(idx/pool.length)*100}%`,height:"100%",background:COLORS.teal}}/>
          </div>
          <div className="card" style={{padding:24}}>
            <span style={{display:"inline-block",fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:8,background:`${PMP_TRIAL_DOMAIN_META[q[1]].color}22`,color:PMP_TRIAL_DOMAIN_META[q[1]].color,marginBottom:14}}>{PMP_TRIAL_DOMAIN_META[q[1]].label}</span>
            <div style={{fontSize:16.5,lineHeight:1.9,marginBottom:20}}>{q[2]}</div>
            {q[3].map((o,i)=>{
              let bg = "var(--panel2)", border = "var(--border)";
              if(revealed){
                if(i===q[4]){ bg="rgba(0,184,148,0.15)"; border=COLORS.teal; }
                else if(i===selected){ bg="rgba(255,90,90,0.12)"; border="#ff5a5a"; }
              }
              return (
                <button key={i} className="opt-btn" style={{background:bg,borderColor:border}} onClick={()=>submit(i)}>{o}</button>
              );
            })}
            {revealed && (
              <div style={{marginTop:14,padding:14,borderRadius:12,background:"rgba(58,46,140,0.15)",fontSize:13.5,lineHeight:1.8}}>
                {q[5]}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:18}}>
              <button className="btn btn-outline" onClick={onBack}>خروج</button>
              {revealed && <button className="btn btn-primary" onClick={next}>{idx+1<pool.length?"التالي":"شوف نتيجتك"}</button>}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{padding:32,textAlign:"center"}}>
          <Trophy size={30} color={COLORS.gold}/>
          <div style={{fontSize:26,fontWeight:800,margin:"12px 0"}}>{correctCount}/{pool.length}</div>
          <div style={{color:COLORS.sub,fontSize:14,marginBottom:24}}>كده خلصت التجربة المجانية. عشان تكمل باقي بنك الأسئلة والامتحانات التجريبية الكاملة، سجّل حساب واشترِ بنك الأسئلة.</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-outline" onClick={onBack}>رجوع للرئيسية</button>
            <button className="btn btn-primary" onClick={onWantAccount}>سجّل حساب مجانًا</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================= لوحة الإدارة ============================= */
function AdminScreen(){
  const [tab, setTab] = useState("certs");
  const { certList } = useCertifications();
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"30px 20px 60px"}}>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>لوحة الإدارة</h2>
      <p style={{color:COLORS.sub,fontSize:13.5,marginBottom:20}}>راجع طلبات الشراء وأدِر محتوى الشهادات والكورسات من هنا.</p>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {[["certs","طلبات الشهادات"],["courses","طلبات الكورسات"],["manageCerts","إدارة الشهادات"],["manage","إدارة الكورسات"]].map(([k,label])=>(
          <button key={k} onClick={()=>setTab(k)} className="btn" style={{fontSize:13,padding:"9px 16px",background:tab===k?COLORS.teal:"var(--panel2)",color:tab===k?"#00190f":COLORS.light}}>{label}</button>
        ))}
      </div>
      {tab==="certs" && <PurchaseReviewList table="purchases" itemLabel={r=>certList.find(c=>c.code===r.cert_code)?.name || r.cert_code} />}
      {tab==="courses" && <PurchaseReviewList table="course_purchases" itemLabel={r=>r.courseTitle || "كورس"} joinCourses />}
      {tab==="manageCerts" && <CertificationManager />}
      {tab==="manage" && <CourseManager />}
    </div>
  );
}

function PurchaseReviewList({ table, itemLabel, joinCourses }){
  const [rows, setRows] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("pending");

  const load = async () => {
    setRows(null);
    const { data: items, error } = await supabase.from(table).select("*").order("created_at",{ascending:false});
    if(error){ setRows([]); return; }
    const userIds = [...new Set((items||[]).map(p=>p.user_id))];
    let profilesById = {};
    if(userIds.length){
      const { data: profs } = await supabase.from("profiles").select("*").in("user_id", userIds);
      (profs||[]).forEach(p=>{ profilesById[p.user_id]=p; });
    }
    let coursesById = {};
    if(joinCourses){
      const courseIds = [...new Set((items||[]).map(p=>p.course_id))];
      if(courseIds.length){
        const { data: crs } = await supabase.from("courses").select("id,title").in("id", courseIds);
        (crs||[]).forEach(c=>{ coursesById[c.id]=c.title; });
      }
    }
    setRows((items||[]).map(p=>({ ...p, profile: profilesById[p.user_id], courseTitle: coursesById[p.course_id] })));
  };

  useEffect(()=>{ load(); },[]); // eslint-disable-line

  const viewReceipt = async (path) => {
    const { data, error } = await supabase.storage.from("receipts").createSignedUrl(path, 120);
    if(error){ alert("تعذر فتح الإيصال: "+error.message); return; }
    window.open(data.signedUrl, "_blank");
  };

  const setStatus = async (id, status) => {
    setBusyId(id);
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if(error){ alert("تعذر تحديث الحالة: "+error.message); }
    else setRows(rs => rs.map(r=> r.id===id ? {...r, status} : r));
    setBusyId(null);
  };

  const visible = rows ? rows.filter(r => filter==="all" ? true : r.status===filter) : null;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-outline" style={{fontSize:12.5,padding:"7px 12px"}} onClick={load}><RotateCcw size={13} style={{verticalAlign:"middle",marginLeft:6}}/> تحديث</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["pending","قيد المراجعة"],["approved","معتمدة"],["rejected","مرفوضة"],["all","الكل"]].map(([k,label])=>(
          <button key={k} onClick={()=>setFilter(k)} className="btn" style={{fontSize:12.5,padding:"7px 14px",background:filter===k?COLORS.teal:"var(--panel2)",color:filter===k?"#00190f":COLORS.light}}>{label}</button>
        ))}
      </div>

      {!visible ? (
        <div style={{textAlign:"center",padding:60,color:COLORS.sub}}><Loader2 className="spin" size={24}/></div>
      ) : visible.length===0 ? (
        <div className="card" style={{padding:30,textAlign:"center",color:COLORS.sub}}>مفيش طلبات في القسم ده حاليًا.</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {visible.map(r=>(
            <div key={r.id} className="card" style={{padding:18,display:"flex",flexWrap:"wrap",gap:14,alignItems:"center"}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{fontWeight:700,fontSize:15}}>{r.profile?.full_name || "بدون اسم"}</div>
                <div style={{fontSize:12,color:COLORS.sub,marginTop:2}}>{r.profile?.phone || "بدون رقم"} · {itemLabel(r)}</div>
                <div style={{fontSize:11,color:COLORS.sub,marginTop:2}}>{new Date(r.created_at).toLocaleString("ar-EG")}</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,
                background: r.status==="approved"?"rgba(0,217,166,0.12)": r.status==="rejected"?"rgba(255,90,90,0.12)":"rgba(255,200,87,0.12)",
                color: r.status==="approved"?COLORS.teal: r.status==="rejected"?"#ff8a8a":COLORS.gold}}>
                {r.status==="approved"?"معتمدة":r.status==="rejected"?"مرفوضة":"قيد المراجعة"}
              </span>
              <button className="btn btn-outline" style={{fontSize:12.5,padding:"7px 12px"}} onClick={()=>viewReceipt(r.receipt_path)}>عرض الإيصال</button>
              {r.status!=="approved" && (
                <button className="btn btn-primary" style={{fontSize:12.5,padding:"7px 14px"}} disabled={busyId===r.id} onClick={()=>setStatus(r.id,"approved")}>اعتماد</button>
              )}
              {r.status!=="rejected" && (
                <button className="btn" style={{fontSize:12.5,padding:"7px 14px",background:"rgba(255,90,90,0.12)",color:"#ff8a8a"}} disabled={busyId===r.id} onClick={()=>setStatus(r.id,"rejected")}>رفض</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================= إدارة الكورسات (إضافة كورسات ودروس) ============================= */
/* ============================= إدارة الشهادات (تحكم كامل في المعروض والأسعار) ============================= */
function CertificationManager(){
  const { certList, loading, refetch } = useCertifications();
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({ code:"", name:"", full_name:"", description:"", price_usd:79, status:"soon", icon_key:"Target", gumroad_url:"", domains:"{}" });
  const [saving, setSaving] = useState(false);

  const startEdit = (c) => {
    setEditingCode(c.code);
    setForm({ name:c.name, full_name:c.full, description:c.desc, price_usd:c.price_usd, status:c.status, gumroad_url:c.gumroad_url||"", domains: JSON.stringify(c.domains||{}, null, 2) });
  };

  const saveEdit = async (code) => {
    setSaving(true);
    let domainsParsed;
    try{ domainsParsed = JSON.parse(form.domains); }catch(e){ alert("صيغة JSON لمجالات الشهادة غير صحيحة"); setSaving(false); return; }
    const { error } = await supabase.from("certifications").update({
      name: form.name, full_name: form.full_name, description: form.description,
      price_usd: form.price_usd, status: form.status, gumroad_url: form.gumroad_url, domains: domainsParsed
    }).eq("code", code);
    setSaving(false);
    if(error){ alert("تعذر الحفظ: "+error.message); return; }
    setEditingCode(null);
    refetch();
  };

  const createCert = async (e) => {
    e.preventDefault();
    setSaving(true);
    let domainsParsed;
    try{ domainsParsed = JSON.parse(newForm.domains); }catch(e){ alert("صيغة JSON لمجالات الشهادة غير صحيحة"); setSaving(false); return; }
    const { error } = await supabase.from("certifications").insert({ ...newForm, domains: domainsParsed });
    setSaving(false);
    if(error){ alert("تعذر إنشاء الشهادة: "+error.message); return; }
    setNewForm({ code:"", name:"", full_name:"", description:"", price_usd:79, status:"soon", icon_key:"Target", gumroad_url:"", domains:"{}" });
    setCreating(false);
    refetch();
  };

  const inputStyle = {width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:13};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <p style={{color:COLORS.sub,fontSize:13,margin:0}}>تحكّم في أي شهادة تظهر في الرئيسية، حالتها، وسعرها.</p>
        <button className="btn btn-primary" style={{fontSize:12.5,padding:"7px 14px"}} onClick={()=>setCreating(c=>!c)}>{creating?"إلغاء":"+ شهادة جديدة"}</button>
      </div>

      {creating && (
        <form onSubmit={createCert} className="card" style={{padding:18,marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <input required placeholder="الكود (PMP, RMP...)" value={newForm.code} onChange={e=>setNewForm(f=>({...f,code:e.target.value.toUpperCase()}))} style={inputStyle}/>
            <input required placeholder="اسم الشهادة" value={newForm.name} onChange={e=>setNewForm(f=>({...f,name:e.target.value}))} style={inputStyle}/>
          </div>
          <input placeholder="الاسم الكامل (بالإنجليزي)" value={newForm.full_name} onChange={e=>setNewForm(f=>({...f,full_name:e.target.value}))} style={{...inputStyle,marginBottom:10}}/>
          <textarea placeholder="وصف مختصر" value={newForm.description} onChange={e=>setNewForm(f=>({...f,description:e.target.value}))} style={{...inputStyle,marginBottom:10,minHeight:60}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
            <input type="number" placeholder="السعر $" value={newForm.price_usd} onChange={e=>setNewForm(f=>({...f,price_usd:e.target.value}))} style={inputStyle}/>
            <select value={newForm.status} onChange={e=>setNewForm(f=>({...f,status:e.target.value}))} style={inputStyle}>
              <option value="available">متاح الآن</option>
              <option value="soon">قريبًا</option>
              <option value="hidden">مخفي</option>
            </select>
            <select value={newForm.icon_key} onChange={e=>setNewForm(f=>({...f,icon_key:e.target.value}))} style={inputStyle}>
              {Object.keys(ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <input placeholder="رابط Gumroad" value={newForm.gumroad_url} onChange={e=>setNewForm(f=>({...f,gumroad_url:e.target.value}))} style={{...inputStyle,marginBottom:10}}/>
          <label style={{fontSize:11.5,color:COLORS.sub,display:"block",marginBottom:4}}>مجالات الشهادة (JSON) — مثال: {`{"domain1":{"label":"اسم المجال","weight":50,"color":"#00B894"}}`}</label>
          <textarea value={newForm.domains} onChange={e=>setNewForm(f=>({...f,domains:e.target.value}))} style={{...inputStyle,marginBottom:12,minHeight:80,fontFamily:"monospace",fontSize:12}}/>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving?"جاري الإنشاء...":"إنشاء الشهادة"}</button>
        </form>
      )}

      {loading ? (
        <div style={{textAlign:"center",padding:40,color:COLORS.sub}}><Loader2 className="spin" size={22}/></div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {certList.map(c=>(
            <div key={c.code} className="card" style={{padding:18}}>
              {editingCode===c.code ? (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle}/>
                    <input value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} style={inputStyle}/>
                  </div>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{...inputStyle,marginBottom:10,minHeight:50}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <input type="number" value={form.price_usd} onChange={e=>setForm(f=>({...f,price_usd:e.target.value}))} style={inputStyle}/>
                    <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={inputStyle}>
                      <option value="available">متاح الآن</option>
                      <option value="soon">قريبًا</option>
                      <option value="hidden">مخفي</option>
                    </select>
                  </div>
                  <input placeholder="رابط Gumroad" value={form.gumroad_url} onChange={e=>setForm(f=>({...f,gumroad_url:e.target.value}))} style={{...inputStyle,marginBottom:10}}/>
                  <label style={{fontSize:11.5,color:COLORS.sub,display:"block",marginBottom:4}}>مجالات الشهادة (JSON)</label>
                  <textarea value={form.domains} onChange={e=>setForm(f=>({...f,domains:e.target.value}))} style={{...inputStyle,marginBottom:12,minHeight:100,fontFamily:"monospace",fontSize:12}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-primary" style={{fontSize:12.5,padding:"7px 16px"}} disabled={saving} onClick={()=>saveEdit(c.code)}>{saving?"...":"حفظ"}</button>
                    <button className="btn btn-outline" style={{fontSize:12.5,padding:"7px 16px"}} onClick={()=>setEditingCode(null)}>إلغاء</button>
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:15}}>{c.name} <span style={{color:COLORS.sub,fontSize:12}}>({c.code})</span></div>
                    <div style={{fontSize:12,color:COLORS.sub}}>${c.price_usd} · {c.status==="available"?"متاح الآن":c.status==="soon"?"قريبًا":"مخفي"}</div>
                  </div>
                  <button className="btn btn-outline" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>startEdit(c)}>تعديل</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_COURSE_FORM = { title:"", description:"", price_usd:79, thumbnail_url:"", gumroad_url:"", instructor_name:"", instructor_photo_url:"" };

function CourseFormFields({ form, setForm, uploadingThumb, uploadingInstructor, onUploadThumb, onUploadInstructor }){
  const fieldStyle = {width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14,marginBottom:12};
  const f = (key,val)=>setForm(c=>({...c,[key]:val}));
  return (
    <>
      <input required placeholder="اسم الكورس" value={form.title} onChange={e=>f("title",e.target.value)} style={fieldStyle}/>
      <textarea placeholder="وصف مختصر" value={form.description} onChange={e=>f("description",e.target.value)} style={{...fieldStyle,minHeight:70}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <input type="number" placeholder="السعر بالدولار" value={form.price_usd} onChange={e=>f("price_usd",e.target.value)} style={{...fieldStyle,marginBottom:0}}/>
        <input placeholder="رابط منتج الشراء (Gumroad)" value={form.gumroad_url} onChange={e=>f("gumroad_url",e.target.value)} style={{...fieldStyle,marginBottom:0}}/>
      </div>

      <label style={{fontSize:12.5,color:COLORS.sub,display:"block",marginBottom:6}}>صورة الكورس الرئيسية (تظهر في الصفحة الرئيسية للكورس)</label>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
        {form.thumbnail_url && <img src={form.thumbnail_url} alt="" style={{width:56,height:40,objectFit:"cover",borderRadius:8}}/>}
        <label className="btn btn-outline" style={{fontSize:12.5,cursor:"pointer",display:"flex",alignItems:"center",gap:6,opacity:uploadingThumb?0.6:1}}>
          {uploadingThumb ? <Loader2 size={13} className="spin"/> : <Upload size={13}/>}
          {uploadingThumb ? "جاري الرفع..." : "ارفع صورة الغلاف"}
          <input type="file" accept="image/*" style={{display:"none"}} disabled={uploadingThumb}
            onChange={e=>{ if(e.target.files[0]) onUploadThumb(e.target.files[0]); }}/>
        </label>
        <input placeholder="أو الصق رابط صورة" value={form.thumbnail_url} onChange={e=>f("thumbnail_url",e.target.value)} style={{...fieldStyle,marginBottom:0,flex:1}}/>
      </div>

      <div style={{borderTop:"1px dashed var(--border)",paddingTop:14,marginBottom:4}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>مقدّم الكورس</div>
        <input placeholder="اسم مقدّم الكورس (مثال: المهندس محمد المطيري)" value={form.instructor_name} onChange={e=>f("instructor_name",e.target.value)} style={fieldStyle}/>
        <label style={{fontSize:12.5,color:COLORS.sub,display:"block",marginBottom:6}}>صورة مقدّم الكورس</label>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
          {form.instructor_photo_url && <img src={form.instructor_photo_url} alt="" style={{width:40,height:40,objectFit:"cover",borderRadius:"50%"}}/>}
          <label className="btn btn-outline" style={{fontSize:12.5,cursor:"pointer",display:"flex",alignItems:"center",gap:6,opacity:uploadingInstructor?0.6:1}}>
            {uploadingInstructor ? <Loader2 size={13} className="spin"/> : <Upload size={13}/>}
            {uploadingInstructor ? "جاري الرفع..." : "ارفع صورة المقدّم"}
            <input type="file" accept="image/*" style={{display:"none"}} disabled={uploadingInstructor}
              onChange={e=>{ if(e.target.files[0]) onUploadInstructor(e.target.files[0]); }}/>
          </label>
        </div>
      </div>
    </>
  );
}

function CourseManager(){
  const [courses, setCourses] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // إدارة الدروس
  const [editingId, setEditingId] = useState(null);   // تعديل بيانات الكورس نفسه
  const [editForm, setEditForm] = useState(null);
  const [newCourse, setNewCourse] = useState(EMPTY_COURSE_FORM);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploading, setUploading] = useState({}); // { [courseKey+field]: bool }

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at",{ascending:false});
    setCourses(data||[]);
  };
  useEffect(()=>{ load(); },[]);

  const uploadImage = async (file, keyPrefix) => {
    const path = `covers/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(path, file, { upsert:true });
    if(error){ alert("تعذر رفع الصورة: "+error.message); return null; }
    const { data } = supabase.storage.from("course-materials").getPublicUrl(path);
    return data?.publicUrl || null;
  };

  const createCourse = async (e) => {
    e.preventDefault();
    setSavingCourse(true);
    const { error } = await supabase.from("courses").insert({ ...newCourse, status:"draft" });
    setSavingCourse(false);
    if(error){ alert("تعذر إنشاء الكورس: "+error.message); return; }
    setNewCourse(EMPTY_COURSE_FORM);
    load();
  };

  const togglePublish = async (course) => {
    const status = course.status==="published" ? "draft" : "published";
    await supabase.from("courses").update({ status }).eq("id", course.id);
    load();
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({
      title:c.title||"", description:c.description||"", price_usd:c.price_usd||0,
      thumbnail_url:c.thumbnail_url||"", gumroad_url:c.gumroad_url||"",
      instructor_name:c.instructor_name||"", instructor_photo_url:c.instructor_photo_url||"",
    });
    setExpandedId(null);
  };

  const saveEdit = async (courseId) => {
    setSavingEdit(true);
    const { error } = await supabase.from("courses").update(editForm).eq("id", courseId);
    setSavingEdit(false);
    if(error){ alert("تعذر حفظ التعديلات: "+error.message); return; }
    setEditingId(null);
    load();
  };

  const deleteCourse = async (courseId) => {
    if(!confirm("متأكد إنك عايز تمسح الكورس ده نهائيًا؟ هيتمسح معاه كل الدروس.")) return;
    await supabase.from("lessons").delete().eq("course_id", courseId);
    await supabase.from("courses").delete().eq("id", courseId);
    load();
  };

  return (
    <div>
      <form onSubmit={createCourse} className="card" style={{padding:20,marginBottom:24}}>
        <div style={{fontWeight:700,marginBottom:14}}>كورس جديد</div>
        <CourseFormFields
          form={newCourse} setForm={setNewCourse}
          uploadingThumb={!!uploading["new-thumb"]} uploadingInstructor={!!uploading["new-inst"]}
          onUploadThumb={async(file)=>{ setUploading(u=>({...u,"new-thumb":true})); const url=await uploadImage(file); setUploading(u=>({...u,"new-thumb":false})); if(url) setNewCourse(c=>({...c,thumbnail_url:url})); }}
          onUploadInstructor={async(file)=>{ setUploading(u=>({...u,"new-inst":true})); const url=await uploadImage(file); setUploading(u=>({...u,"new-inst":false})); if(url) setNewCourse(c=>({...c,instructor_photo_url:url})); }}
        />
        <button className="btn btn-primary" type="submit" disabled={savingCourse} style={{marginTop:6}}>{savingCourse?"جاري الإنشاء...":"إنشاء الكورس"}</button>
      </form>

      {!courses ? (
        <div style={{textAlign:"center",padding:40,color:COLORS.sub}}><Loader2 className="spin" size={22}/></div>
      ) : courses.length===0 ? (
        <div className="card" style={{padding:30,textAlign:"center",color:COLORS.sub}}>لسه معملتش أي كورس.</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {courses.map(c=>(
            <div key={c.id} className="card" style={{padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15}}>{c.title}</div>
                  <div style={{fontSize:12,color:COLORS.sub}}>${c.price_usd} · {c.status==="published"?"منشور":"مسودة"} {c.instructor_name && `· ${c.instructor_name}`} {!c.gumroad_url && <span style={{color:"#ff8a8a"}}>· بدون رابط شراء!</span>}</div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="btn btn-outline" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>togglePublish(c)}>
                    {c.status==="published" ? "إخفاء" : "نشر"}
                  </button>
                  <button className="btn" style={{fontSize:12,padding:"6px 12px",background:"var(--panel2)"}} onClick={()=>editingId===c.id?setEditingId(null):startEdit(c)}>
                    {editingId===c.id ? "إغلاق التعديل" : "تعديل بيانات الكورس"}
                  </button>
                  <button className="btn" style={{fontSize:12,padding:"6px 12px",background:"var(--panel2)"}} onClick={()=>{ setExpandedId(expandedId===c.id?null:c.id); setEditingId(null); }}>
                    {expandedId===c.id ? "إغلاق الدروس" : "إدارة الدروس"}
                  </button>
                  <button className="btn" style={{fontSize:12,padding:"6px 12px",background:"rgba(255,80,80,0.12)",color:"#ff8a8a"}} onClick={()=>deleteCourse(c.id)}>
                    مسح الكورس
                  </button>
                </div>
              </div>

              {editingId===c.id && editForm && (
                <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)"}}>
                  <CourseFormFields
                    form={editForm} setForm={setEditForm}
                    uploadingThumb={!!uploading[c.id+"-thumb"]} uploadingInstructor={!!uploading[c.id+"-inst"]}
                    onUploadThumb={async(file)=>{ setUploading(u=>({...u,[c.id+"-thumb"]:true})); const url=await uploadImage(file); setUploading(u=>({...u,[c.id+"-thumb"]:false})); if(url) setEditForm(f=>({...f,thumbnail_url:url})); }}
                    onUploadInstructor={async(file)=>{ setUploading(u=>({...u,[c.id+"-inst"]:true})); const url=await uploadImage(file); setUploading(u=>({...u,[c.id+"-inst"]:false})); if(url) setEditForm(f=>({...f,instructor_photo_url:url})); }}
                  />
                  <button className="btn btn-primary" onClick={()=>saveEdit(c.id)} disabled={savingEdit} style={{marginTop:6}}>
                    {savingEdit ? "جاري الحفظ..." : "حفظ تعديلات الكورس"}
                  </button>
                </div>
              )}

              {expandedId===c.id && <LessonManager courseId={c.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_LESSON_FORM = { title:"", section:"", video_url:"", duration_minutes:10, is_preview:false, pdf_url:"" };

function LessonFormFields({ form, setForm, uploadingPdf, onUploadPdf }){
  const f = (key,val)=>setForm(l=>({...l,[key]:val}));
  const style = {padding:"9px 12px",borderRadius:9,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:13};
  return (
    <>
      <input placeholder="اسم القسم (مثال: Domain 01: People) — اختياري" value={form.section} onChange={e=>f("section",e.target.value)} style={style}/>
      <input required placeholder="اسم الدرس" value={form.title} onChange={e=>f("title",e.target.value)} style={style}/>
      <input placeholder="رابط فيديو يوتيوب (سيبه فاضي دلوقتي لو لسه مرفعتش الفيديو)" value={form.video_url} onChange={e=>f("video_url",e.target.value)} style={style}/>
      <label className="btn btn-outline" style={{fontSize:12.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:uploadingPdf?0.6:1}}>
        {uploadingPdf ? <Loader2 size={13} className="spin"/> : <Upload size={13}/>}
        {uploadingPdf ? "جاري الرفع..." : form.pdf_url ? "✓ ملف PDF مرفوع — دوس لتغييره" : "ارفع ملف PDF مرفق (اختياري)"}
        <input type="file" accept="application/pdf" style={{display:"none"}} disabled={uploadingPdf}
          onChange={e=>{ if(e.target.files[0]) onUploadPdf(e.target.files[0]); }}/>
      </label>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <input type="number" placeholder="المدة بالدقايق" value={form.duration_minutes} onChange={e=>f("duration_minutes",e.target.value)}
          style={{...style,flex:1}}/>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12.5,color:COLORS.sub,whiteSpace:"nowrap"}}>
          <input type="checkbox" checked={form.is_preview} onChange={e=>f("is_preview",e.target.checked)}/>
          معاينة مجانية
        </label>
      </div>
    </>
  );
}

function LessonManager({ courseId }){
  const [lessons, setLessons] = useState(null);
  const [newLesson, setNewLesson] = useState(EMPTY_LESSON_FORM);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState({}); // key -> bool

  const load = async () => {
    const { data } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order_index");
    setLessons(data||[]);
  };
  useEffect(()=>{ load(); },[courseId]); // eslint-disable-line

  const uploadPdf = async (file) => {
    const path = `${courseId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(path, file);
    if(error){ alert("تعذر رفع الملف: "+error.message); return null; }
    return path;
  };

  const addLesson = async (e) => {
    e.preventDefault();
    setSaving(true);
    const orderIndex = lessons ? lessons.length : 0;
    const { error } = await supabase.from("lessons").insert({ ...newLesson, course_id: courseId, order_index: orderIndex });
    setSaving(false);
    if(error){ alert("تعذر إضافة الدرس: "+error.message); return; }
    setNewLesson(l=>({ ...EMPTY_LESSON_FORM, section: l.section })); // نسيب اسم القسم زي ما هو عشان تضيف دروس تانية في نفس القسم بسرعة
    load();
  };

  const deleteLesson = async (id) => {
    if(!confirm("متأكد إنك عايز تمسح الدرس ده؟")) return;
    await supabase.from("lessons").delete().eq("id", id);
    load();
  };

  const startEdit = (l) => {
    setEditingLessonId(l.id);
    setEditForm({ title:l.title||"", section:l.section||"", video_url:l.video_url||"", duration_minutes:l.duration_minutes||0, is_preview:!!l.is_preview, pdf_url:l.pdf_url||"" });
  };

  const saveEdit = async (id) => {
    setSavingEdit(true);
    const { error } = await supabase.from("lessons").update(editForm).eq("id", id);
    setSavingEdit(false);
    if(error){ alert("تعذر حفظ التعديلات: "+error.message); return; }
    setEditingLessonId(null);
    load();
  };

  // بيبدّل ترتيب درسين ببعض (order_index) عشان تقدر تحرك الدرس لفوق أو لتحت داخل نفس القسم أو حتى بين الأقسام
  const move = async (index, direction) => {
    if(!lessons) return;
    const targetIndex = index + direction;
    if(targetIndex<0 || targetIndex>=lessons.length) return;
    const a = lessons[index], b = lessons[targetIndex];
    await Promise.all([
      supabase.from("lessons").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("lessons").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    load();
  };

  return (
    <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)"}}>
      <form onSubmit={addLesson} style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:13}}>إضافة درس جديد</div>
        <LessonFormFields form={newLesson} setForm={setNewLesson}
          uploadingPdf={!!uploadingPdf["new"]}
          onUploadPdf={async(file)=>{ setUploadingPdf(u=>({...u,new:true})); const path=await uploadPdf(file); setUploadingPdf(u=>({...u,new:false})); if(path) setNewLesson(l=>({...l,pdf_url:path})); }}
        />
        <button className="btn btn-primary" type="submit" disabled={saving} style={{fontSize:12.5,padding:"9px 16px"}}>{saving?"...":"إضافة الدرس"}</button>
      </form>

      {lessons && lessons.length>0 && (
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {lessons.map((l,i)=>(
            <div key={l.id} style={{background:"var(--panel2)",borderRadius:8,padding:"8px 10px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <button onClick={()=>move(i,-1)} disabled={i===0} style={{background:"none",border:"none",color:COLORS.sub,cursor:i===0?"default":"pointer",opacity:i===0?0.3:1,padding:0}}><ChevronRight size={13} style={{transform:"rotate(90deg)"}}/></button>
                  <button onClick={()=>move(i,1)} disabled={i===lessons.length-1} style={{background:"none",border:"none",color:COLORS.sub,cursor:i===lessons.length-1?"default":"pointer",opacity:i===lessons.length-1?0.3:1,padding:0}}><ChevronRight size={13} style={{transform:"rotate(-90deg)"}}/></button>
                </div>
                <span style={{fontSize:12.5,flex:1}}>
                  {l.section && <span style={{color:COLORS.purple,fontWeight:700}}>[{l.section}] </span>}
                  {i+1}. {l.title} {l.is_preview && <span style={{color:COLORS.teal,fontSize:10.5}}>(معاينة)</span>} {l.pdf_url && <FileCheck2 size={11} style={{verticalAlign:"middle",marginRight:4}} color={COLORS.teal}/>} {!l.video_url && <span style={{color:"#ff8a8a",fontSize:10.5}}>(بدون فيديو)</span>}
                </span>
                <span style={{fontSize:11,color:COLORS.sub}}>{l.duration_minutes}د</span>
                <button onClick={()=>editingLessonId===l.id?setEditingLessonId(null):startEdit(l)} style={{background:"none",border:"none",color:COLORS.teal,cursor:"pointer",fontSize:11.5,fontFamily:"'Cairo',sans-serif"}}>
                  {editingLessonId===l.id ? "إلغاء" : "تعديل"}
                </button>
                <button onClick={()=>deleteLesson(l.id)} style={{background:"none",border:"none",color:"#ff8a8a",cursor:"pointer"}}><X size={14}/></button>
              </div>

              {editingLessonId===l.id && editForm && (
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:8}}>
                  <LessonFormFields form={editForm} setForm={setEditForm}
                    uploadingPdf={!!uploadingPdf[l.id]}
                    onUploadPdf={async(file)=>{ setUploadingPdf(u=>({...u,[l.id]:true})); const path=await uploadPdf(file); setUploadingPdf(u=>({...u,[l.id]:false})); if(path) setEditForm(f=>({...f,pdf_url:path})); }}
                  />
                  <button className="btn btn-primary" onClick={()=>saveEdit(l.id)} disabled={savingEdit} style={{fontSize:12.5,padding:"9px 16px"}}>
                    {savingEdit ? "جاري الحفظ..." : "حفظ تعديلات الدرس"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================= الملف الشخصي ============================= */
function ProfileScreen({ profile, loading, saveProfile, progress, userId, setView, purchases, onPurchaseAdded, certList=[] }){
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({}); // certCode -> "uploading" | "done" | "error"

  useEffect(()=>{ if(profile) setForm(profile); },[profile]);

  if(loading || !form){
    return (
      <div style={{maxWidth:680,margin:"0 auto",padding:"60px 20px",textAlign:"center",color:COLORS.sub}}>
        <Loader2 className="spin" size={26} color={COLORS.teal}/>
        <div style={{marginTop:10}}>جاري تحميل ملفك...</div>
      </div>
    );
  }

  const field = (key, val) => { setForm(f=>({...f, [key]:val})); setSaved(false); };
  const toggleCert = (code) => {
    const current = form.selected_certs || [];
    const next = current.includes(code) ? current.filter(c=>c!==code) : [...current, code];
    field("selected_certs", next);
  };
  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await saveProfile(form);
    setSaving(false);
    setSaved(!!res.ok);
    if(res.ok) setEditing(false);
  };

  const selectedCerts = form.selected_certs || [];
  const initial = (form.full_name||"?").trim()[0] || "?";

  const uploadReceipt = async (certCode, file) => {
    if(!file || !userId) return;
    setUploadStatus(s=>({...s, [certCode]:"uploading"}));
    const path = `${userId}/receipt-${certCode}-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("receipts").upload(path, file);
    if(upErr){
      setUploadStatus(s=>({...s, [certCode]:"error"}));
      alert("تعذر رفع الإيصال: " + upErr.message);
      return;
    }
    const { data, error } = await supabase.from("purchases").insert({
      user_id: userId, cert_code: certCode, receipt_path: path, status: "pending", amount_usd: PRICE_USD
    }).select().single();
    if(!error){
      onPurchaseAdded(certCode, data);
      setUploadStatus(s=>({...s, [certCode]:"done"}));
    } else {
      setUploadStatus(s=>({...s, [certCode]:"error"}));
      alert("اتحفظ الملف بس حصل خطأ في تسجيل الطلب: " + error.message);
    }
  };

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"30px 20px 60px"}}>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>ملفي الشخصي</h2>

      {/* بطاقة الهوية */}
      <div className="card" style={{padding:22,marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg, var(--teal), var(--purple))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",flexShrink:0}}>
          {initial}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:17}}>{form.full_name || "بدون اسم"}</div>
          <div style={{fontSize:12.5,color:COLORS.sub,marginTop:2,display:"flex",gap:14,flexWrap:"wrap"}}>
            {form.phone && <span><Phone size={11} style={{verticalAlign:"middle",marginLeft:3}}/>{form.phone}</span>}
            {form.birth_date && <span><Cake size={11} style={{verticalAlign:"middle",marginLeft:3}}/>{form.birth_date}</span>}
          </div>
        </div>
        <button className="btn btn-outline" style={{padding:"8px 16px",fontSize:13}} onClick={()=>setEditing(e=>!e)}>{editing?"إغلاق":"تعديل"}</button>
      </div>

      {/* فورم التعديل */}
      {editing && (
        <form onSubmit={onSave} className="card" style={{padding:22,marginBottom:24}}>
          <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>الاسم الكامل</label>
          <input value={form.full_name||""} onChange={e=>field("full_name", e.target.value)}
            style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14,marginBottom:16}}/>
          <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>اسمك بالإنجليزي (هيظهر على شهاداتك)</label>
          <input value={form.certificate_name_en||""} onChange={e=>field("certificate_name_en", e.target.value)} placeholder="مثال: Ahmed Al-Ghamdi" dir="ltr"
            style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14,marginBottom:16,textAlign:"left"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div>
              <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>تاريخ الميلاد</label>
              <input type="date" value={form.birth_date||""} onChange={e=>field("birth_date", e.target.value)}
                style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14}}/>
            </div>
            <div>
              <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:6}}>رقم الجوال</label>
              <input type="tel" value={form.phone||""} onChange={e=>field("phone", e.target.value)}
                style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14}}/>
            </div>
          </div>

          <label style={{fontSize:13,color:COLORS.sub,display:"block",marginBottom:10}}>الشهادات اللي بتحضّرلها</label>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {certList.map(c=>{
              const Icon = c.icon;
              const available = c.status==="available";
              const checked = selectedCerts.includes(c.code);
              return (
                <label key={c.code} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,border:`1.5px solid ${checked?COLORS.teal:"var(--border)"}`,background:"var(--panel2)",cursor:available?"pointer":"not-allowed",opacity:available?1:0.6}}>
                  <input type="checkbox" checked={checked} disabled={!available} onChange={()=>toggleCert(c.code)} style={{width:17,height:17}}/>
                  <Icon size={17} color={available?COLORS.teal:COLORS.sub}/>
                  <span style={{fontSize:14,flex:1}}>{c.name}</span>
                  {!available && <span style={{fontSize:11,color:COLORS.sub}}>قريبًا</span>}
                </label>
              );
            })}
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving} style={{width:"100%"}}>
            {saving ? "جاري الحفظ..." : "حفظ البيانات"}
          </button>
          {saved && <div style={{marginTop:12,fontSize:13,color:COLORS.teal,display:"flex",alignItems:"center",gap:6}}><Check size={15}/> اتحفظت بياناتك بنجاح</div>}
        </form>
      )}

      {/* تقرير الشهادات */}
      <div style={{fontWeight:700,fontSize:16,marginBottom:14}}>شهاداتي</div>
      {selectedCerts.length===0 ? (
        <div className="card" style={{padding:24,textAlign:"center",color:COLORS.sub,fontSize:13.5}}>
          لسه ما اخترتش أي شهادة. دوس "تعديل" فوق واختار الشهادة اللي بتحضّرلها.
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {selectedCerts.map(code=>{
            const cert = certList.find(c=>c.code===code);
            if(!cert) return null;
            const Icon = cert.icon;
            const purchase = purchases[code];
            const hasBank = cert.status==="available";
            const cp = getCertProgress(progress, code);
            const answeredIds = Object.keys(cp.records);
            const attempted = answeredIds.length;
            const correctCount = answeredIds.filter(id=>cp.records[id].correct).length;
            const accuracy = attempted ? Math.round((correctCount/attempted)*100) : 0;
            const weakCount = answeredIds.filter(id=>!cp.records[id].correct).length;
            const daysLeft = cp.examDate ? Math.ceil((new Date(cp.examDate) - new Date(todayStr()))/86400000) : null;
            return (
              <div key={code} className="card" style={{padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <Icon size={19} color={COLORS.teal}/>
                  <div style={{fontWeight:700,fontSize:15,flex:1}}>{cert.name}</div>
                  {purchase?.status==="approved" && <span style={{fontSize:11,fontWeight:700,color:COLORS.teal,background:"rgba(0,217,166,0.12)",padding:"4px 10px",borderRadius:8}}>✓ مفعّلة</span>}
                  {purchase?.status==="pending" && <span style={{fontSize:11,fontWeight:700,color:COLORS.gold,background:"rgba(255,200,87,0.12)",padding:"4px 10px",borderRadius:8}}>قيد المراجعة</span>}
                  {!purchase && <span style={{fontSize:11,fontWeight:700,color:COLORS.sub,background:"var(--panel2)",padding:"4px 10px",borderRadius:8}}>لسه ما اتفعلتش</span>}
                </div>

                {/* حالة الشراء */}
                <div style={{padding:"12px 14px",borderRadius:10,background:"var(--panel2)",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {purchase?.status==="approved" && (
                    <><CheckCircle2 size={16} color={COLORS.teal}/><span style={{fontSize:13,color:COLORS.teal,fontWeight:700}}>تم تفعيل الشراء ✓</span></>
                  )}
                  {purchase?.status==="pending" && (
                    <><Hourglass size={16} color={COLORS.gold}/><span style={{fontSize:13,color:COLORS.gold}}>استلمنا إيصالك، بنراجعه ونفعّل خلال ساعات</span></>
                  )}
                  {!purchase && cert.gumroad_url && (
                    <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
                      <div style={{fontSize:13,color:COLORS.sub}}>لسه ما اشتريتش بنك أسئلة {cert.name} (${cert.price_usd})</div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                        <a href={cert.gumroad_url} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{textDecoration:"none",fontSize:13}}>اشترِ الآن — ${cert.price_usd}</a>
                        <label className="btn btn-outline" style={{fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,opacity:uploadStatus[code]==="uploading"?0.6:1}}>
                          {uploadStatus[code]==="uploading" ? <Loader2 size={14} className="spin"/> : <Upload size={14}/>}
                          {uploadStatus[code]==="uploading" ? "جاري الرفع..." : "ارفع إيصال الدفع"}
                          <input type="file" accept="image/*,application/pdf" style={{display:"none"}} disabled={uploadStatus[code]==="uploading"}
                            onChange={e=>{ if(e.target.files[0]) uploadReceipt(code, e.target.files[0]); }}/>
                        </label>
                        {uploadStatus[code]==="done" && (
                          <span style={{fontSize:12.5,color:COLORS.teal,fontWeight:700,display:"flex",alignItems:"center",gap:5}}><CheckCircle2 size={15}/> تم رفع الإيصال بنجاح ✓</span>
                        )}
                        {uploadStatus[code]==="error" && (
                          <span style={{fontSize:12.5,color:"#ff8a8a",fontWeight:700,display:"flex",alignItems:"center",gap:5}}><AlertCircle size={15}/> حصل خطأ، جرب تاني</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {hasBank ? (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    <MiniStat label="نسبة الدقة" value={attempted?`${accuracy}%`:"—"} />
                    <MiniStat label="أيام للامتحان" value={daysLeft!=null?daysLeft:"—"} />
                    <MiniStat label="نقاط ضعف" value={weakCount} />
                  </div>
                ) : (
                  <div style={{fontSize:12.5,color:COLORS.sub}}>بنك الأسئلة لسه قيد الإعداد لهذه الشهادة.</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }){
  return (
    <div style={{background:"var(--panel2)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
      <div style={{fontWeight:800,fontSize:18}}>{value}</div>
      <div style={{fontSize:10.5,color:COLORS.sub,marginTop:2}}>{label}</div>
    </div>
  );
}

function FontLoader(){
  return <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap');`}</style>;
}
function GlobalStyle(){
  return <style>{`
    * { box-sizing:border-box; }
    body { margin:0; }
    .theme-dark {
      --bg:#0D132B; --panel:#141B36; --panel2:#1B2547; --text:#F2F4F7; --sub:#96A0C8;
      --purple:#7C6CF0; --teal:#00D9A6; --gold:#FFC857;
      --border: rgba(255,255,255,0.09); --border-strong: rgba(255,255,255,0.22);
      --track: rgba(255,255,255,0.08); --navbg: rgba(13,19,43,0.82); --scrollbar:#2a3560;
      --heroglow: radial-gradient(60% 60% at 50% 0%, rgba(0,217,166,0.16), transparent 70%);
    }
    .theme-light {
      --bg:#F4F5FB; --panel:#FFFFFF; --panel2:#F0F1F9; --text:#10142B; --sub:#5B6485;
      --purple:#5B4BC4; --teal:#00966F; --gold:#B9860B;
      --border: rgba(16,20,43,0.1); --border-strong: rgba(16,20,43,0.2);
      --track: rgba(16,20,43,0.08); --navbg: rgba(255,255,255,0.86); --scrollbar:#c9cde3;
      --heroglow: radial-gradient(60% 60% at 50% 0%, rgba(0,150,111,0.10), transparent 70%);
    }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes fadeUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
    .fade-up { animation: fadeUp .6s ease both; }
    .float { animation: floatY 4.5s ease-in-out infinite; }
    .card { background:var(--panel); border:1px solid var(--border); border-radius:16px; }
    .btn { border:none; border-radius:12px; padding:12px 22px; font-family:'Cairo',sans-serif; font-weight:700; cursor:pointer; font-size:15px; transition:transform .15s ease, opacity .15s ease, box-shadow .15s ease; }
    .btn:hover { transform: translateY(-1px); opacity:.92; }
    .btn:active { transform: translateY(0); }
    .btn-primary { background: linear-gradient(90deg, var(--teal), #00d9a6); color:#00190f; box-shadow:0 8px 24px -8px rgba(0,217,166,0.55); }
    .btn-outline { background:transparent; border:1.5px solid var(--border-strong); color:var(--text); }
    .btn-gold { background:var(--gold); color:#241800; }
    .opt-btn { width:100%; text-align:right; padding:14px 16px; border-radius:12px; border:1.5px solid var(--border); background:var(--panel2); color:var(--text); font-family:'Cairo',sans-serif; font-size:15px; cursor:pointer; margin-bottom:10px; transition: all .15s ease; }
    .opt-btn:hover { border-color: var(--teal); }
    .icon-btn { width:38px; height:38px; border-radius:10px; border:1px solid var(--border); background:var(--panel2); color:var(--text); display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .marquee-track { display:flex; width:max-content; animation: marquee 28s linear infinite; gap:14px; }
    .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
    ::-webkit-scrollbar { width:8px; } ::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:8px; }
  `}</style>;
}

function ThemeToggle({ theme, onToggle }){
  return (
    <button className="icon-btn" onClick={onToggle} aria-label="تبديل الوضع الليلي/النهاري">
      {theme==="dark" ? <Sun size={17}/> : <Moon size={17}/>}
    </button>
  );
}

/* ============================= الشريط العلوي ============================= */
function NavBar({ view, setView, signOut, userEmail, unlockedCerts=[], activeCert, setActiveCert, isAdmin, certList=[] }){
  const items = [
    { id:"dashboard", label:"الرئيسية", icon:Home },
    { id:"practice", label:"تدريب", icon:BookOpen },
    { id:"mock", label:"امتحان تجريبي", icon:ClipboardList },
    { id:"review", label:"مراجعة الأخطاء", icon:Brain },
    { id:"flashcards", label:"بطاقات", icon:Layers },
    { id:"courses", label:"الكورسات", icon:Video },
    { id:"profile", label:"ملفي الشخصي", icon:UserCircle },
    ...(isAdmin ? [{ id:"admin", label:"الإدارة", icon:Settings2 }] : []),
  ];
  return (
    <div style={{position:"sticky",top:0,zIndex:20,background:"var(--navbg)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--border)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",flexWrap:"wrap",gap:10}}>
        <Logo onClick={()=>setView("dashboard")} />
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {unlockedCerts.length>1 && (
            <select value={activeCert||""} onChange={e=>setActiveCert(e.target.value)}
              style={{background:"var(--panel2)",color:COLORS.light,border:"1px solid var(--border)",borderRadius:10,padding:"7px 10px",fontFamily:"'Cairo',sans-serif",fontSize:12.5,marginLeft:4}}>
              {unlockedCerts.map(code=>{
                const c = certList.find(x=>x.code===code);
                return <option key={code} value={code}>{c?.name||code}</option>;
              })}
            </select>
          )}
          {items.map(it=>{
            const Icon = it.icon; const active = view===it.id;
            return (
              <button key={it.id} onClick={()=>setView(it.id)} style={{
                display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",
                background: active ? "rgba(0,184,148,0.15)" : "transparent",
                color: active ? COLORS.teal : COLORS.sub, fontFamily:"'Cairo',sans-serif", fontWeight:600, fontSize:13.5
              }}>
                <Icon size={16}/> {it.label}
              </button>
            );
          })}
          {signOut && (
            <button onClick={signOut} title={userEmail||"تسجيل خروج"} className="icon-btn">
              <LogOut size={16}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LogoMark({ size=36 }){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink:0}}>
      <defs>
        <linearGradient id="najizGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)"/>
          <stop offset="100%" stopColor="var(--purple)"/>
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#najizGrad)"/>
      <path d="M12.5 24.5 L20 32 L36.5 13.5" fill="none" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M39 7.5 L40.6 11.3 L44.5 12.9 L40.6 14.5 L39 18.3 L37.4 14.5 L33.5 12.9 L37.4 11.3 Z" fill="var(--gold)"/>
    </svg>
  );
}

function Logo({ onClick, big }){
  const markSize = big ? 88 : 36;
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:big?18:10,cursor:onClick?"pointer":"default"}}>
      <LogoMark size={markSize} />
      <div style={{lineHeight:1}}>
        <div style={{fontWeight:800,fontSize:big?34:19,color:COLORS.light}}>Najiz</div>
        <div style={{fontSize:big?13:10,color:COLORS.sub,letterSpacing:2,marginTop:big?6:0}}>PREPARE · PRACTICE · PASS</div>
      </div>
    </div>
  );
}

function FAQAccordion({ items }){
  const [open, setOpen] = useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {items.map((it,i)=>{
        const isOpen = open===i;
        return (
          <div key={i} className="card" style={{padding:0,overflow:"hidden"}}>
            <button onClick={()=>setOpen(isOpen?null:i)} style={{
              width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,
              padding:"18px 20px",background:"transparent",border:"none",cursor:"pointer",textAlign:"right",
              fontFamily:"'Cairo',sans-serif",color:COLORS.light,fontWeight:700,fontSize:15
            }}>
              <span>{it.q}</span>
              {isOpen ? <Minus size={18} color={COLORS.teal} style={{flexShrink:0}}/> : <Plus size={18} color={COLORS.sub} style={{flexShrink:0}}/>}
            </button>
            {isOpen && (
              <div style={{padding:"0 20px 20px",color:COLORS.sub,fontSize:13.5,lineHeight:1.9}}>{it.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CertCatalog({ onStart, certList=[], loading }){
  const [selected, setSelected] = useState([]);
  const [waitlisted, setWaitlisted] = useState([]);

  const toggle = (code) => {
    setSelected(sel => sel.includes(code) ? sel.filter(c=>c!==code) : [...sel, code]);
  };
  const joinWaitlist = (code) => {
    setWaitlisted(w => w.includes(code) ? w : [...w, code]);
  };

  const visibleCerts = certList.filter(c => c.status !== "hidden");
  const selectedCerts = visibleCerts.filter(c=>selected.includes(c.code));
  const total = selectedCerts.reduce((sum,c)=>sum + Number(c.price_usd||0), 0);

  return (
    <div style={{padding:"56px 0 20px",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontWeight:800,fontSize:26}}>منصة واحدة… لكل شهاداتك المهنية</div>
          <div style={{color:COLORS.sub,marginTop:8}}>اختر أي عدد من بنوك الأسئلة، وتقدر تجمع أكتر من شهادة في نفس الاشتراك</div>
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:40,color:COLORS.sub}}><Loader2 className="spin" size={24}/></div>
        ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,paddingBottom: selected.length?90:0}}>
          {visibleCerts.map((c,i)=>{
            const Icon = c.icon;
            const available = c.status==="available";
            const isSelected = selected.includes(c.code);
            const isWaitlisted = waitlisted.includes(c.code);
            return (
              <div key={i} className="card" style={{padding:22,position:"relative",borderColor: isSelected? "var(--teal)":undefined, opacity: available?1:0.94}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div style={{width:44,height:44,borderRadius:12,background: available?"rgba(0,217,166,0.15)":"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon size={21} color={available?COLORS.teal:COLORS.sub}/>
                  </div>
                  <span style={{fontSize:10.5,fontWeight:800,padding:"5px 10px",borderRadius:8,background: available?"rgba(0,217,166,0.15)":"rgba(255,200,87,0.12)",color: available?COLORS.teal:COLORS.gold}}>
                    {available ? "متاح الآن" : "قريبًا"}
                  </span>
                </div>
                <div style={{fontWeight:800,fontSize:16.5,marginBottom:3}}>{c.name}</div>
                <div style={{fontSize:11.5,color:COLORS.sub,marginBottom:10,fontWeight:600}}>{c.full}</div>
                <div style={{fontSize:13,color:COLORS.sub,lineHeight:1.8,marginBottom:18,minHeight:56}}>{c.desc}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontWeight:800,fontSize:19}}>${c.price_usd}<span style={{fontSize:11,color:COLORS.sub,fontWeight:500}}> / بنك الأسئلة</span></div>
                </div>
                <div style={{marginTop:14}}>
                  {available ? (
                    <button className={isSelected? "btn btn-primary":"btn btn-outline"} style={{width:"100%"}} onClick={()=>toggle(c.code)}>
                      {isSelected ? <><CheckCircle2 size={16} style={{verticalAlign:"middle",marginLeft:6}}/> مُضاف للسلة</> : "أضف للسلة"}
                    </button>
                  ) : isWaitlisted ? (
                    <div className="btn" style={{width:"100%",background:"var(--panel2)",color:COLORS.teal,cursor:"default"}}>✓ هنبلغك عند الإطلاق</div>
                  ) : (
                    <button className="btn btn-outline" style={{width:"100%"}} onClick={()=>joinWaitlist(c.code)}>أعلمني عند الإطلاق</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {selected.length>0 && (
        <div style={{position:"sticky",bottom:16,marginTop:20,display:"flex",justifyContent:"center",padding:"0 20px"}}>
          <div className="card fade-up" style={{padding:"14px 22px",display:"flex",alignItems:"center",gap:18,boxShadow:"0 20px 40px -12px rgba(0,0,0,0.4)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <ShoppingCart size={18} color={COLORS.teal}/>
              <span style={{fontSize:13.5}}>{selected.length} {selected.length===1?"شهادة":"شهادات"} مختارة</span>
            </div>
            <div style={{fontWeight:800,fontSize:17}}>${total}</div>
            <button className="btn btn-primary" onClick={onStart}>متابعة</button>
          </div>
        </div>
      )}
    </div>
  );
}


function CoursesTeaser({ courses, loading, onStart }){
  return (
    <div style={{padding:"56px 0 20px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,108,240,0.1)",border:"1px solid rgba(124,108,240,0.3)",borderRadius:20,padding:"6px 16px",fontSize:13,color:COLORS.purple,marginBottom:14}}>
            <Video size={14}/> جديد
          </div>
          <div style={{fontWeight:800,fontSize:26}}>دورات تدريبية بالفيديو</div>
          <div style={{color:COLORS.sub,marginTop:8}}>اشرح المفاهيم بعمق بالفيديو قبل ما تتدرب عليها ببنك الأسئلة — منتج منفصل تمامًا</div>
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:30,color:COLORS.sub}}><Loader2 className="spin" size={22}/></div>
        ) : !courses || courses.length===0 ? (
          <div className="card" style={{padding:40,textAlign:"center",color:COLORS.sub}}>
            <Film size={26} color={COLORS.sub} style={{marginBottom:10}}/>
            <div>أول دورة تدريبية قريبًا جدًا — تابعنا.</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            {courses.map(c=>(
              <div key={c.id} className="card" style={{overflow:"hidden"}}>
                <div style={{height:140,background: c.thumbnail_url? `url(${c.thumbnail_url}) center/cover`:"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {!c.thumbnail_url && <Film size={26} color={COLORS.sub}/>}
                </div>
                <div style={{padding:18}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{c.title}</div>
                  {c.instructor_name && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      {c.instructor_photo_url ? (
                        <img src={c.instructor_photo_url} alt={c.instructor_name} style={{width:22,height:22,borderRadius:"50%",objectFit:"cover"}}/>
                      ) : (
                        <div style={{width:22,height:22,borderRadius:"50%",background:"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center"}}><UserCircle size={13} color={COLORS.sub}/></div>
                      )}
                      <span style={{fontSize:11.5,color:COLORS.sub}}>{c.instructor_name}</span>
                    </div>
                  )}
                  <div style={{fontSize:12.5,color:COLORS.sub,lineHeight:1.7,marginBottom:14,minHeight:36}}>{c.description}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontWeight:800,fontSize:16}}>${c.price_usd}</div>
                    <button className="btn btn-outline" style={{fontSize:12.5,padding:"7px 14px"}} onClick={onStart}>التفاصيل</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Landing({ onStart, onTrial, certList=[], certsLoading, courses, coursesLoading }){
  return (
    <div>
      {/* Top bar */}
      <div style={{position:"sticky",top:0,zIndex:20,background:"var(--navbg)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--border)"}}>
        <div style={{maxWidth:1160,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px"}}>
          <Logo />
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="btn btn-outline" style={{padding:"9px 16px",fontSize:13.5}} onClick={onStart}>تسجيل الدخول</div>
            <button className="btn btn-primary" style={{padding:"9px 18px",fontSize:13.5}} onClick={onStart}>ابدأ مجانًا</button>
            </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"var(--heroglow)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"56px 20px 20px",position:"relative"}}>
          <div className="fade-up float" style={{marginBottom:30,display:"flex",justifyContent:"center"}}>
            <Logo big />
          </div>

          <div style={{display:"flex",alignItems:"center",gap:44,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 440px",minWidth:300,textAlign:"center"}}>
              <div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,200,87,0.1)",border:"1px solid rgba(255,200,87,0.3)",borderRadius:20,padding:"6px 16px",fontSize:13,color:COLORS.gold,marginBottom:22}}>
                <Sparkles size={14}/> منصة عربية بالكامل — بلا وسطاء ولا ترجمة ركيكة
              </div>
              <h1 className="fade-up" style={{fontSize:"clamp(28px,4.6vw,44px)",fontWeight:800,lineHeight:1.35,margin:"0 0 18px"}}>
                أقوى منصة عربية للتحضير<br/>
                <span style={{background:`linear-gradient(90deg, var(--teal), var(--gold))`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>للشهادات المهنية الاحترافية</span>
              </h1>
              <p className="fade-up" style={{color:COLORS.sub,fontSize:16,lineHeight:2,maxWidth:560,margin:"0 auto 28px"}}>
                من إعداد المهندس <b style={{color:COLORS.light}}>رفعت رسلان</b> — بنك أسئلة يحاكي صعوبة الامتحان الفعلي،
                نظام يكتشف نقاط ضعفك أول بأول، وخطة مذاكرة ذكية ترتّب وقتك وتفكّرك تكمل لحد الامتحان.
              </p>
              <div className="fade-up" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:34}}>
                <button className="btn btn-primary" style={{padding:"14px 30px",fontSize:16}} onClick={onStart}>ابدأ رحلتك مجانًا</button>
                <button className="btn btn-outline" style={{padding:"14px 30px",fontSize:16}} onClick={onTrial}>جرّب 10 أسئلة الآن بدون تسجيل</button>
              </div>
              <div className="fade-up" style={{display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap",color:COLORS.sub,fontSize:13}}>
                <span style={{display:"flex",alignItems:"center",gap:6}}><Check size={15} color={COLORS.teal}/> بنك أسئلة ينمو أسبوعيًا</span>
                <span style={{display:"flex",alignItems:"center",gap:6}}><Check size={15} color={COLORS.teal}/> شرح تفصيلي لكل إجابة</span>
                <span style={{display:"flex",alignItems:"center",gap:6}}><Check size={15} color={COLORS.teal}/> متوافق مع ECO 2026</span>
              </div>
            </div>

            <div className="fade-up" style={{flex:"1 1 300px",minWidth:260,maxWidth:400,margin:"0 auto",position:"relative"}}>
              <div style={{position:"absolute",inset:-30,background:"radial-gradient(60% 60% at 50% 40%, rgba(0,217,166,0.25), transparent 70%)",filter:"blur(20px)",zIndex:0}}/>
              <div style={{position:"relative",zIndex:1,borderRadius:28,overflow:"hidden",boxShadow:"0 30px 70px -20px rgba(0,0,0,0.55)",border:"1px solid var(--border)"}}>
                <img src="/hero-person.png" alt="متدرب يذاكر على منصة Najiz" style={{width:"100%",display:"block"}} />
              </div>
              <div className="card" style={{position:"absolute",bottom:-18,left:-18,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,zIndex:2}}>
                <div style={{width:34,height:34,borderRadius:10,background:"rgba(0,217,166,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Trophy size={16} color={COLORS.teal}/>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:14}}>جاهز للاختبار</div>
                  <div style={{fontSize:11,color:COLORS.sub}}>تتبّع لحظي لجاهزيتك</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسمين واضحين: بنك أسئلة + دورات تدريبية */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"10px 20px 30px",textAlign:"center"}}>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <div className="card" style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,minWidth:220}}>
            <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,217,166,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Brain size={18} color={COLORS.teal}/></div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700,fontSize:14}}>بنك أسئلة تفاعلي</div>
              <div style={{fontSize:11.5,color:COLORS.sub}}>تدريب وامتحانات تجريبية</div>
            </div>
          </div>
          <div className="card" style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,minWidth:220}}>
            <div style={{width:38,height:38,borderRadius:10,background:"rgba(124,108,240,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Video size={18} color={COLORS.purple}/></div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700,fontSize:14}}>دورات تدريبية بالفيديو</div>
              <div style={{fontSize:11.5,color:COLORS.sub}}>شرح مفصّل قبل التدريب</div>
            </div>
          </div>
        </div>
      </div>

      {/* الشهادات — كتالوج حقيقي (بنك الأسئلة) */}
      <CertCatalog onStart={onStart} certList={certList} loading={certsLoading} />

      {/* الدورات التدريبية — قسم منفصل تمامًا عن بنك الأسئلة */}
      <CoursesTeaser courses={courses} loading={coursesLoading} onStart={onStart} />

      {/* Features grid */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"56px 20px 10px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontWeight:800,fontSize:26}}>مصممة عشان تخليك تذاكر صح، مش بس تذاكر كتير</div>
          <div style={{color:COLORS.sub,marginTop:8}}>كل ميزة في Najiz لها هدف واحد: توصلك للنجاح من أول محاولة</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          {[
            {icon:Target, title:"كشف نقاط الضعف تلقائيًا", text:"كل سؤال تغلط فيه يُسجَّل ويظهر في مراجعة الأخطاء، وتقدر تعيد اختبارك عليه وحده."},
            {icon:Clock, title:"امتحان تجريبي بمؤقت حقيقي", text:"محاكاة فعلية لظروف الامتحان بتوزيع الأوزان الرسمي بين النطاقات."},
            {icon:BellRing, title:"نظام تركيز وتذكير ذكي", text:"يقترح عليك جدول مذاكرة أسبوعي حسب وقتك المتاح، ويذكّرك تكمل قبل ما تنسى."},
            {icon:Flame, title:"Streak يحافظ على استمراريتك", text:"نتابع أيام مذاكرتك المتتالية عشان تفضل مركّز لحد يوم الامتحان."},
            {icon:Layers, title:"بطاقات مصطلحات وصيغ", text:"مراجعة سريعة للمعادلات والمفاهيم الحرجة (EVM، Float، DoD) قبل الامتحان."},
            {icon:GraduationCap, title:"شهادات مهنية متعددة قادمة", text:"إدارة المخاطر، الموارد البشرية، المحاسبة، واللغة الإنجليزية — كلها على نفس المنصة."},
          ].map((f,i)=>{
            const Icon=f.icon;
            return (
              <div key={i} className="card" style={{padding:22}}>
                <div style={{width:42,height:42,borderRadius:11,background:"rgba(0,217,166,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                  <Icon size={20} color={COLORS.teal}/>
                </div>
                <div style={{fontWeight:700,fontSize:16,margin:"0 0 6px"}}>{f.title}</div>
                <div style={{color:COLORS.sub,fontSize:13.5,lineHeight:1.8}}>{f.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart focus spotlight */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 20px"}}>
        <div className="card" style={{padding:"36px 30px",display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:30,alignItems:"center",background:"linear-gradient(135deg, var(--panel), var(--panel2))"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,color:COLORS.purple,fontWeight:700,fontSize:13,marginBottom:14}}>
              <Zap size={16}/> نظام التركيز الذكي
            </div>
            <div style={{fontWeight:800,fontSize:24,lineHeight:1.5,marginBottom:14}}>مش بس أسئلة… في حد فعليًا بيرتب مذاكرتك</div>
            <p style={{color:COLORS.sub,fontSize:14.5,lineHeight:2}}>
              حدد تاريخ امتحانك والأيام المتاحة عندك، والمنصة بتوزّعلك تركيزك أسبوع بأسبوع بين النطاقات الثلاثة
              حسب أوزانها الرسمية، وبتبعتلك تذكير لحظة ما يجيلك وقت مذاكرتك عشان محدش يضيع تركيزه.
            </p>
            <ul style={{listStyle:"none",padding:0,margin:"18px 0 0",display:"flex",flexDirection:"column",gap:10}}>
              {["توزيع أسبوعي تلقائي حسب نسبة كل نطاق في الامتحان","تنبيه وقت المذاكرة اليومي","تتبّع مباشر لمدى التزامك بالخطة"].map((t,i)=>(
                <li key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:14}}><Check size={16} color={COLORS.teal}/> {t}</li>
              ))}
            </ul>
          </div>
          <SmartPlanPreview />
        </div>
      </div>

      {/* Testimonials */}
      <div style={{padding:"56px 0 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",textAlign:"center",marginBottom:30}}>
          <div style={{fontWeight:800,fontSize:26}}>متدربون بدأوا رحلتهم معنا</div>
          <div style={{color:COLORS.sub,marginTop:8}}>نماذج توضيحية لتجربة الاستخدام — قصص عملائنا الحقيقية قريبًا هنا</div>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="card" style={{padding:22}}>
              <div style={{display:"flex",gap:2,marginBottom:12}}>
                {Array.from({length:5}).map((_,s)=><Star key={s} size={14} fill={s<t.stars?"#FFC857":"none"} color="#FFC857"/>)}
              </div>
              <div style={{fontSize:13.5,lineHeight:1.9,color:COLORS.light,marginBottom:16,minHeight:80}}>"{t.text}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg, var(--teal), var(--purple))`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#fff",flexShrink:0}}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                  <div style={{fontSize:11,color:COLORS.sub,display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/> {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{maxWidth:820,margin:"0 auto",padding:"20px 20px 20px"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontWeight:800,fontSize:26}}>أسئلة بتتكرر كتير</div>
          <div style={{color:COLORS.sub,marginTop:8}}>وإجاباتها بصراحة تامة</div>
        </div>
        <FAQAccordion items={[
          { q:"الأسئلة دي مسرّبة من الامتحان الفعلي؟", a:"لأ، وده مهم نوضحه بصراحة: PMI بيمنع نشر أي أسئلة حقيقية من الامتحان قانونيًا، وأي منصة تدّعي عندها «أسئلة مسربة» فعليًا بتخالف القانون وبتعرّضك للمشكلة معاها. أسئلتنا مؤلَّفة بالكامل بأسلوب موقفي (Situational) مطابق لمنطق ونمط الامتحان الفعلي ومبني على أحدث تحديث لمخطط المحتوى (ECO 2026) — وده الأسلوب الوحيد القانوني والمعترف بيه لأي بنك أسئلة تدريبي جاد." },
          { q:"إمتى هيتفعّل حسابي بعد ما أدفع؟", a:"بعد ما تشتري من Gumroad، ترجع للمنصة وترفع صورة من إيصال الشراء من صفحة «ملفي الشخصي». المراجعة والتفعيل بيحصلوا خلال ساعات قليلة (مش أوتوماتيك فوري دلوقتي، بس سريع)." },
          { q:"أقدر أذاكر من الموبايل عادي؟", a:"أيوه، المنصة مصممة تشتغل بنفس الجودة على الموبايل والكمبيوتر من غير أي فرق." },
          { q:"أقدر أشتري أكتر من شهادة في نفس الوقت؟", a:"أيوه، تقدر تفعّل أكتر من شهادة (PMP وRMP مثلاً) وتذاكرهم مع بعض أو تفصل بينهم بالكامل — كل شهادة ليها تقدم وجدول منفصل تمامًا." },
          { q:"المحتوى محدث لآخر نسخة من الامتحان؟", a:"أيوه، بنك الأسئلة مبني على أحدث تحديث لمخطط محتوى الامتحان (ECO 2026) بنفس توزيع الأوزان الرسمي." },
          { q:"لو معنديش وسيلة دفع تقبل بطاقتي إيه الحل؟", a:"بوابة الدفع بتقبل فيزا وماستركارد الدولية (ومعظم بطاقات مدى المزدوجة). لو واجهت مشكلة في الدفع، تواصل معانا وهنساعدك تلاقي حل." },
        ]}/>
      </div>


      <div style={{maxWidth:820,margin:"0 auto",padding:"20px 20px 80px",textAlign:"center"}}>
        <div className="card" style={{padding:"46px 30px",background:`linear-gradient(135deg, rgba(0,217,166,0.12), rgba(124,108,240,0.12))`}}>
          <div style={{fontWeight:800,fontSize:24,marginBottom:10}}>جاهز تبدأ طريقك للنجاح؟</div>
          <div style={{color:COLORS.sub,marginBottom:24}}>سجّل دلوقتي وابدأ أول تدريب مجانًا في أقل من دقيقة</div>
          <button className="btn btn-primary" style={{padding:"14px 34px",fontSize:16}} onClick={onStart}>ابدأ مجانًا الآن</button>
        </div>
      </div>

      <div style={{borderTop:"1px solid var(--border)",padding:"26px 20px",textAlign:"center",color:COLORS.sub,fontSize:12.5}}>
        <Logo />
        <div style={{marginTop:14}}>© {new Date().getFullYear()} Najiz — منصة عربية للتحضير للشهادات المهنية</div>
      </div>
    </div>
  );
}

function SmartPlanPreview(){
  const weeks = [
    { d:"people", t:"الأسبوع 1", note:"القيادة وبناء الفريق", label:"الأفراد", color:"#3A2E8C", weight:33 },
    { d:"process", t:"الأسبوع 3", note:"الجدول والتكلفة والجودة", label:"العمليات", color:"#00B894", weight:41 },
    { d:"business", t:"الأسبوع 5", note:"القيمة والحوكمة والاستراتيجية", label:"بيئة العمل", color:"#FFC857", weight:26 },
  ];
  return (
    <div className="card" style={{padding:20,background:"var(--bg)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,fontSize:13,color:COLORS.sub}}>
        <Calendar size={15}/> معاينة خطة مذاكرة تلقائية
      </div>
      {weeks.map((w,i)=>{
        const meta = w;
        return (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop: i>0 ? "1px dashed var(--border)":"none"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:meta.color,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{w.t} — التركيز على {meta.label}</div>
              <div style={{fontSize:11.5,color:COLORS.sub}}>{w.note}</div>
            </div>
            <span style={{fontSize:10.5,color:meta.color,fontWeight:700}}>{meta.weight}%</span>
          </div>
        );
      })}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:14,padding:"10px 12px",borderRadius:10,background:"rgba(255,200,87,0.1)",fontSize:12,color:COLORS.gold}}>
        <Bell size={14}/> تذكير: النهاردة معاد مذاكرتك — 45 دقيقة Process
      </div>
    </div>
  );
}

/* ============================= لوحة التحكم ============================= */
function Dashboard({ progress, certCode, questions, domainMeta, certList=[], setExamDate, setView, profile }){
  const firstName = profile?.full_name ? profile.full_name.trim().split(" ")[0] : null;
  const QUESTIONS_BANK = questions;
  const DMETA = domainMeta || {};
  const certMeta = certList.find(c=>c.code===certCode);
  const answeredIds = Object.keys(progress.records);
  const attempted = answeredIds.length;
  const correctCount = answeredIds.filter(id=>progress.records[id].correct).length;
  const accuracy = attempted ? Math.round((correctCount/attempted)*100) : 0;
  const weakCount = answeredIds.filter(id=>!progress.records[id].correct).length;

  const domainStats = {};
  Object.keys(DMETA).forEach(d=>{
    const qIds = QUESTIONS_BANK.filter(q=>q[1]===d).map(q=>q[0]);
    const done = qIds.filter(id=>progress.records[id]);
    const correct = done.filter(id=>progress.records[id].correct);
    domainStats[d] = { total:qIds.length, done:done.length, correct:correct.length, pct: done.length ? Math.round((correct.length/done.length)*100) : 0 };
  });

  const streak = (()=>{
    const set = new Set(progress.activity);
    let s = 0; let d = new Date();
    if(!set.has(todayStr())) { d.setDate(d.getDate()-1); }
    while(true){
      const key = d.toISOString().slice(0,10);
      if(set.has(key)){ s++; d.setDate(d.getDate()-1); } else break;
    }
    return s;
  })();

  const daysLeft = progress.examDate ? Math.ceil((new Date(progress.examDate) - new Date(todayStr()))/86400000) : null;

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px 60px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:24}}>
        <div>
          <h2 style={{margin:0,fontSize:24,fontWeight:800}}>أهلًا بك{firstName?` يا ${firstName}`:""} 👋</h2>
          <p style={{color:COLORS.sub,margin:"6px 0 0"}}>بتذاكر لشهادة {certMeta?.name||certCode} — كل سؤال يقرّبك من النجاح.</p>
        </div>
        <div className="card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <Calendar size={18} color={COLORS.gold}/>
          <div>
            <div style={{fontSize:11,color:COLORS.sub}}>تاريخ الامتحان</div>
            <input type="date" value={progress.examDate||""} onChange={e=>setExamDate(e.target.value)}
              style={{background:"transparent",border:"none",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14}}/>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon={Trophy} color={COLORS.teal} label="نسبة الدقة" value={attempted? `${accuracy}%` : "—"} sub={`${attempted} سؤال مجاب`} />
        <StatCard icon={Calendar} color={COLORS.gold} label="أيام للامتحان" value={daysLeft!=null? daysLeft : "—"} sub={daysLeft!=null? "يوم متبقٍ":"حدد التاريخ"} />
        <StatCard icon={Flame} color="#ff8a5c" label="سلسلة المذاكرة" value={streak} sub="يوم متتالي" />
        <StatCard icon={Brain} color={COLORS.purple} label="نقاط تحتاج مراجعة" value={weakCount} sub="سؤال صعب" />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16,marginBottom:16}}>
        <div className="card" style={{padding:22}}>
          <div style={{fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><TrendingUp size={18} color={COLORS.teal}/> أداؤك حسب المجال</div>
          {Object.keys(DMETA).map(d=>{
            const meta = DMETA[d]; const s = domainStats[d];
            return (
              <div key={d} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:6}}>
                  <span>{meta.label} <span style={{color:COLORS.sub}}>({meta.weight}%)</span></span>
                  <span style={{color:COLORS.sub}}>{s.done}/{s.total} · {s.pct}%</span>
                </div>
                <div style={{height:8,borderRadius:6,background:"var(--track)",overflow:"hidden"}}>
                  <div style={{width:`${s.total?(s.done/s.total)*100:0}%`,height:"100%",background:meta.color}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card" style={{padding:22,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:8}}><Award size={18} color={COLORS.gold}/> الاختبار القادم</div>
          <div style={{color:COLORS.sub,fontSize:13.5,marginBottom:6}}>امتحان تجريبي كامل — مؤقت حقيقي</div>
          <button className="btn btn-primary" onClick={()=>setView("mock")}>ابدأ امتحان تجريبي</button>
          <button className="btn btn-outline" onClick={()=>setView("practice")}>تدريب حر</button>
          {weakCount>0 && <button className="btn btn-gold" onClick={()=>setView("review")}>راجع {weakCount} سؤال صعب</button>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:16}}>
        <QuickCard icon={BookOpen} title="تدريب حر" text="تدرّب على البنك كاملًا مع شرح فوري" onClick={()=>setView("practice")} />
        <QuickCard icon={ClipboardList} title="امتحان تجريبي" text="محاكاة حقيقية بمؤقت وتوزيع أوزان" onClick={()=>setView("mock")} />
        <QuickCard icon={Layers} title="بطاقات المصطلحات" text="مراجعة سريعة للمعادلات والمفاهيم" onClick={()=>setView("flashcards")} />
      </div>

      <SmartFocusCard domainStats={domainStats} daysLeft={daysLeft} domainMeta={DMETA} setView={setView} />
    </div>
  );
}

function SmartFocusCard({ domainStats, daysLeft, domainMeta, setView }){
  const [remindersOn, setRemindersOn] = useState(false);
  const [notice, setNotice] = useState("");

  // النطاق صاحب أقل نسبة تغطية هو الأولوية الذكية لهذا الأسبوع
  const focusDomain = Object.keys(domainStats).sort((a,b)=>{
    const ra = domainStats[a].total ? domainStats[a].done/domainStats[a].total : 0;
    const rb = domainStats[b].total ? domainStats[b].done/domainStats[b].total : 0;
    if(ra!==rb) return ra-rb;
    return domainMeta[b].weight - domainMeta[a].weight;
  })[0];
  const meta = domainMeta[focusDomain];
  const s = domainStats[focusDomain];
  const coveragePct = s.total ? Math.round((s.done/s.total)*100) : 0;

  const enableReminders = async () => {
    if(typeof window==="undefined" || !("Notification" in window)){
      setNotice("المتصفح ده مش بيدعم التنبيهات — هيتم تفعيلها تلقائيًا في تطبيق الإنتاج."); return;
    }
    try{
      const perm = await Notification.requestPermission();
      if(perm==="granted"){
        setRemindersOn(true);
        new Notification("Najiz", { body:`تذكير مذاكرة مفعّل ✅ — التركيز الحالي: ${meta.label}` });
        setNotice("تم تفعيل التذكير لهذه الجلسة.");
      } else {
        setNotice("محتاجين إذنك لتفعيل التنبيهات من إعدادات المتصفح.");
      }
    }catch(e){ setNotice("تعذّر تفعيل التنبيهات الآن."); }
  };

  return (
    <div className="card" style={{padding:22,marginTop:16,display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:24}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,color:COLORS.purple,fontWeight:700,fontSize:13,marginBottom:10}}>
          <Zap size={16}/> النظام الذكي للتركيز
        </div>
        <div style={{fontSize:15.5,lineHeight:2}}>
          بناءً على تقدمك الحالي، أولوية هذا الأسبوع هي{" "}
          <b style={{color:meta.color}}>{meta.label} ({meta.weight}%)</b> — لسه مغطي{" "}
          <b>{coveragePct}%</b> بس من أسئلته.
          {daysLeft!=null && daysLeft>0 && <> باقيلك <b>{daysLeft}</b> يوم على الامتحان.</>}
        </div>
        <button className="btn btn-outline" style={{marginTop:14}} onClick={()=>setView && setView("practice")}>
          ابدأ تدريب {meta.label} الآن
        </button>
      </div>
      <div style={{borderRight:"1px solid var(--border)",paddingRight:24,display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13.5,fontWeight:700}}>
          {remindersOn ? <BellRing size={17} color={COLORS.teal}/> : <Bell size={17} color={COLORS.sub}/>}
          تذكير المذاكرة اليومي
        </div>
        <div style={{fontSize:12,color:COLORS.sub,lineHeight:1.8}}>
          يشتغل الآن في المتصفح أثناء فتح الصفحة. التذكيرات الكاملة عبر SMS/بريد بعد نشر النسخة الكاملة.
        </div>
        {!remindersOn ? (
          <button className="btn btn-gold" onClick={enableReminders}>فعّل التذكير</button>
        ) : (
          <div style={{fontSize:12.5,color:COLORS.teal,fontWeight:700}}>✓ مفعّل لهذه الجلسة</div>
        )}
        {notice && <div style={{fontSize:11.5,color:COLORS.sub}}>{notice}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon:Icon, color, label, value, sub }){
  return (
    <div className="card" style={{padding:18}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{width:38,height:38,borderRadius:10,background:`${color}22`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={18} color={color}/>
        </div>
      </div>
      <div style={{fontSize:26,fontWeight:800,marginTop:12}}>{value}</div>
      <div style={{fontSize:12.5,color:COLORS.sub}}>{label} · {sub}</div>
    </div>
  );
}

function QuickCard({ icon:Icon, title, text, onClick }){
  return (
    <div className="card" style={{padding:20,cursor:"pointer"}} onClick={onClick}>
      <Icon size={20} color={COLORS.teal}/>
      <div style={{fontWeight:700,margin:"10px 0 4px"}}>{title}</div>
      <div style={{fontSize:13,color:COLORS.sub}}>{text}</div>
    </div>
  );
}

/* ============================= التدريب / مراجعة الأخطاء ============================= */
function Practice({ progress, certCode, domainMeta, recordAnswer, onExit, pool, title, isReview }){
  const [domain, setDomain] = useState("all");
  const [queue, setQueue] = useState(()=> shuffle(pool));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const DMETA = domainMeta || {};

  const filtered = domain==="all" ? queue : queue.filter(q=>q[1]===domain);
  const rawQ = filtered[idx];
  const q = useMemo(()=> rawQ ? shuffleOptions(rawQ) : null, [rawQ ? rawQ[0] : null]);

  useEffect(()=>{ setIdx(0); setSelected(null); setRevealed(false); }, [domain]);

  if(!q){
    return (
      <div style={{maxWidth:700,margin:"0 auto",padding:"60px 20px",textAlign:"center"}}>
        <div className="card" style={{padding:30}}>
          <Check size={30} color={COLORS.teal}/>
          <h3>{isReview ? "مفيش أسئلة صعبة حاليًا 🎉" : "خلصت كل الأسئلة المتاحة!"}</h3>
          <p style={{color:COLORS.sub}}>{isReview ? "استمر في التدريب وأي سؤال تغلط فيه هيظهر هنا تلقائيًا." : "جرّب مجال تاني أو ابدأ امتحان تجريبي."}</p>
          <button className="btn btn-primary" onClick={onExit}>رجوع للرئيسية</button>
        </div>
      </div>
    );
  }

  const [qid, qdomain, qtext, opts, ans, exp] = q;
  const meta = DMETA[qdomain];

  const submit = (i) => {
    if(revealed) return;
    setSelected(i); setRevealed(true);
    recordAnswer(qid, i===ans, qdomain);
  };
  const next = () => {
    if(idx+1 < filtered.length){ setIdx(idx+1); }
    else { setQueue(shuffle(pool)); setIdx(0); }
    setSelected(null); setRevealed(false);
  };

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"24px 20px 60px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:800,fontSize:19}}>{title}</div>
          <div style={{fontSize:12.5,color:COLORS.sub}}>سؤال {idx+1} من {filtered.length}</div>
        </div>
        {!isReview && (
          <select value={domain} onChange={e=>setDomain(e.target.value)} style={{background:COLORS.panel2,color:COLORS.light,border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 12px",fontFamily:"'Cairo',sans-serif"}}>
            <option value="all">كل المجالات</option>
            {Object.keys(DMETA).map(d=><option key={d} value={d}>{DMETA[d].label}</option>)}
          </select>
        )}
      </div>

      <div className="card" style={{padding:24}}>
        <span style={{display:"inline-block",fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:8,background:`${meta.color}22`,color:meta.color,marginBottom:14}}>{meta.label}</span>
        <div style={{fontSize:16.5,lineHeight:1.9,marginBottom:20}}>{qtext}</div>
        {opts.map((o,i)=>{
          let bg = COLORS.panel2, border = "rgba(255,255,255,0.1)", extra=null;
          if(revealed){
            if(i===ans){ bg="rgba(0,184,148,0.15)"; border=COLORS.teal; extra=<Check size={16} color={COLORS.teal}/>; }
            else if(i===selected){ bg="rgba(255,90,90,0.12)"; border="#ff5a5a"; extra=<X size={16} color="#ff5a5a"/>; }
          }
          return (
            <button key={i} className="opt-btn" style={{background:bg,borderColor:border,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>submit(i)}>
              <span>{o}</span>{extra}
            </button>
          );
        })}
        {revealed && (
          <div style={{marginTop:16,padding:16,borderRadius:12,background:"rgba(58,46,140,0.15)",border:"1px solid rgba(58,46,140,0.4)"}}>
            <div style={{fontWeight:700,fontSize:13.5,marginBottom:6,color:COLORS.gold}}>الشرح</div>
            <div style={{fontSize:14,lineHeight:1.8,color:COLORS.light}}>{exp}</div>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
          <button className="btn btn-outline" onClick={onExit}>خروج</button>
          {revealed && <button className="btn btn-primary" onClick={next}>السؤال التالي <ChevronLeft size={16} style={{verticalAlign:"middle"}}/></button>}
        </div>
      </div>
    </div>
  );
}

/* ============================= الامتحان التجريبي ============================= */
function MockExam({ certCode, domainMeta, pool: QUESTIONS_BANK, recordAnswer, addMockResult, onExit }){
  const [stage, setStage] = useState("setup"); // setup | running | result
  const [length, setLength] = useState(25);
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);
  const DMETA = domainMeta || {};
  const domainKeys = Object.keys(DMETA);
  const emptyByDomain = () => { const o={}; domainKeys.forEach(d=>o[d]={c:0,t:0}); return o; };

  const start = () => {
    const pick = (d,n) => shuffle(QUESTIONS_BANK.filter(q=>q[1]===d)).slice(0,n);
    let remaining = length;
    const picks = domainKeys.map((d,i)=>{
      const isLast = i===domainKeys.length-1;
      const n = isLast ? remaining : Math.round(length*DMETA[d].weight/100);
      remaining -= n;
      return pick(d,n);
    });
    const set = shuffle(picks.flat()).map(shuffleOptions);
    setItems(set); setIdx(0); setAnswers({});
    setSecondsLeft(Math.round(length*78));
    setStage("running");
  };

  useEffect(()=>{
    if(stage!=="running") return;
    timerRef.current = setInterval(()=>{
      setSecondsLeft(s=>{
        if(s<=1){ clearInterval(timerRef.current); finish(); return 0; }
        return s-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
    // eslint-disable-next-line
  },[stage]);

  const choose = (i) => setAnswers(a=>({...a,[idx]:i}));

  const finish = () => {
    clearInterval(timerRef.current);
    const byDomain = emptyByDomain();
    let correct = 0;
    items.forEach((q,i)=>{
      const [qid,d,,,ans] = q;
      const chosen = answers[i];
      const ok = chosen===ans;
      if(ok) correct++;
      byDomain[d].t++; if(ok) byDomain[d].c++;
      recordAnswer(qid, ok, d);
    });
    addMockResult({ date: todayStr(), total: items.length, correct, byDomain });
    setStage("result");
  };

  const domainSummary = domainKeys.map(d=>`${DMETA[d].label} ${DMETA[d].weight}%`).join(" · ");

  if(stage==="setup"){
    return (
      <div style={{maxWidth:600,margin:"0 auto",padding:"40px 20px"}}>
        <div className="card" style={{padding:26}}>
          <ClipboardList size={26} color={COLORS.gold}/>
          <h3 style={{margin:"10px 0 4px"}}>امتحان تجريبي بمؤقت حقيقي</h3>
          <p style={{color:COLORS.sub,fontSize:13.5,lineHeight:1.8}}>الأسئلة موزعة تلقائيًا بنفس نسب النطاقات الرسمية ({domainSummary}).</p>
          <div style={{display:"flex",gap:10,margin:"18px 0"}}>
            {[20,40,60].map(n=>(
              <button key={n} onClick={()=>setLength(n)} className="btn" style={{background: length===n?COLORS.teal:COLORS.panel2, color: length===n?"#00190f":COLORS.light, flex:1}}>{n} سؤال</button>
            ))}
          </div>
          <div style={{fontSize:12.5,color:COLORS.sub,marginBottom:18}}>الوقت التقديري: ~{Math.round(length*78/60)} دقيقة</div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-outline" onClick={onExit}>رجوع</button>
            <button className="btn btn-primary" onClick={start} style={{flex:1}}>ابدأ الامتحان</button>
          </div>
        </div>
      </div>
    );
  }

  if(stage==="running"){
    const q = items[idx];
    if(!q) return null;
    const [,d,text,opts] = q;
    const meta = DMETA[d];
    const mm = String(Math.floor(secondsLeft/60)).padStart(2,"0");
    const ss = String(secondsLeft%60).padStart(2,"0");
    return (
      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 20px 60px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:COLORS.sub}}>سؤال {idx+1} من {items.length}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,color: secondsLeft<60? "#ff5a5a":COLORS.gold,fontWeight:700}}>
            <Clock size={16}/> {mm}:{ss}
          </div>
        </div>
        <div className="card" style={{padding:24}}>
          <span style={{display:"inline-block",fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:8,background:`${meta.color}22`,color:meta.color,marginBottom:14}}>{meta.label}</span>
          <div style={{fontSize:16.5,lineHeight:1.9,marginBottom:20}}>{text}</div>
          {opts.map((o,i)=>(
            <button key={i} className="opt-btn" style={{background: answers[idx]===i? "rgba(0,184,148,0.15)":COLORS.panel2, borderColor: answers[idx]===i? COLORS.teal:"rgba(255,255,255,0.1)"}} onClick={()=>choose(i)}>{o}</button>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:18}}>
            <button className="btn btn-outline" onClick={()=>setIdx(Math.max(0,idx-1))} disabled={idx===0}>السابق</button>
            {idx+1<items.length ? (
              <button className="btn btn-primary" onClick={()=>setIdx(idx+1)}>التالي</button>
            ) : (
              <button className="btn btn-gold" onClick={finish}>إنهاء الامتحان</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // result
  const correct = Object.keys(answers).filter(i=>answers[i]===items[i][4]).length;
  const pct = Math.round((correct/items.length)*100);
  const byDomain = emptyByDomain();
  items.forEach((q,i)=>{ const d=q[1]; byDomain[d].t++; if(answers[i]===q[4]) byDomain[d].c++; });

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"30px 20px 60px"}}>
      <div className="card" style={{padding:26,textAlign:"center",marginBottom:20}}>
        <Trophy size={30} color={pct>=61?COLORS.teal:COLORS.gold}/>
        <div style={{fontSize:34,fontWeight:800,margin:"10px 0"}}>{pct}%</div>
        <div style={{color:COLORS.sub}}>{correct} إجابة صحيحة من {items.length}</div>
        <div style={{marginTop:14,fontSize:13.5,color: pct>=61?COLORS.teal:"#ff8a5c"}}>
          {pct>=61? "أداء واعد — استمر بنفس الوتيرة 💪" : "محتاج مراجعة أكتر — راجع سجل الأخطاء وركّز على النقاط الضعيفة"}
        </div>
      </div>
      <div className="card" style={{padding:22,marginBottom:20}}>
        <div style={{fontWeight:700,marginBottom:14}}>الأداء حسب المجال</div>
        {domainKeys.map(d=>{
          const s = byDomain[d]; const meta = DMETA[d];
          const p = s.t? Math.round((s.c/s.t)*100):0;
          return (
            <div key={d} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:6}}>
                <span>{meta.label}</span><span style={{color:COLORS.sub}}>{s.c}/{s.t} · {p}%</span>
              </div>
              <div style={{height:8,borderRadius:6,background:"var(--track)"}}>
                <div style={{width:`${p}%`,height:"100%",borderRadius:6,background:meta.color}}/>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button className="btn btn-outline" onClick={onExit}>رجوع للرئيسية</button>
        <button className="btn btn-primary" onClick={()=>setStage("setup")}><RotateCcw size={15} style={{verticalAlign:"middle",marginLeft:6}}/> امتحان جديد</button>
      </div>
    </div>
  );
}

/* ============================= بطاقات المصطلحات ============================= */
function Flashcards({ onExit }){
  const [idx,setIdx] = useState(0);
  const [flipped,setFlipped] = useState(false);
  const card = FLASHCARDS[idx];

  const go = (dir) => { setFlipped(false); setIdx((idx+dir+FLASHCARDS.length)%FLASHCARDS.length); };

  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"36px 20px 60px",textAlign:"center"}}>
      <div style={{fontSize:13,color:COLORS.sub,marginBottom:16}}>بطاقة {idx+1} من {FLASHCARDS.length}</div>
      <div onClick={()=>setFlipped(!flipped)} className="card" style={{
        padding:40,minHeight:200,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
        background: flipped? "linear-gradient(135deg, rgba(58,46,140,0.35), rgba(0,184,148,0.15))" : COLORS.panel
      }}>
        {!flipped ? (
          <div style={{fontSize:26,fontWeight:800,fontFamily:"'Tajawal',sans-serif"}}>{card[0]}</div>
        ) : (
          <div style={{fontSize:15.5,lineHeight:1.9}}>{card[1]}</div>
        )}
      </div>
      <div style={{fontSize:12,color:COLORS.sub,marginTop:10}}>اضغط على البطاقة لقلبها</div>
      <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:22}}>
        <button className="btn btn-outline" onClick={()=>go(-1)}><ChevronRight size={16}/></button>
        <button className="btn btn-primary" onClick={()=>go(1)}>التالي <ChevronLeft size={16} style={{verticalAlign:"middle"}}/></button>
      </div>
      <button className="btn btn-outline" style={{marginTop:24}} onClick={onExit}>رجوع للرئيسية</button>
    </div>
  );
}

/* ============================= كتالوج الكورسات ============================= */
function CourseCatalog({ courses, loading, purchases, userId, onPurchaseAdded, onOpenCourse }){
  const [uploadStatus, setUploadStatus] = useState({});

  const uploadReceipt = async (courseId, file) => {
    if(!file || !userId) return;
    setUploadStatus(s=>({...s,[courseId]:"uploading"}));
    const path = `${userId}/course-receipt-${courseId}-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("receipts").upload(path, file);
    if(upErr){ setUploadStatus(s=>({...s,[courseId]:"error"})); return; }
    const { data, error } = await supabase.from("course_purchases").insert({
      user_id: userId, course_id: courseId, receipt_path: path, status: "pending"
    }).select().single();
    if(error){ setUploadStatus(s=>({...s,[courseId]:"error"})); return; }
    onPurchaseAdded(courseId, data);
    setUploadStatus(s=>({...s,[courseId]:"done"}));
  };

  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"30px 20px 60px"}}>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>الكورسات</h2>
      <p style={{color:COLORS.sub,fontSize:13.5,marginBottom:24}}>كورسات فيديو تكمّل بنك الأسئلة — تشرح المفاهيم بعمق قبل ما تتدرب عليها.</p>

      {loading ? (
        <LoadingBlock text="جاري تحميل الكورسات..." />
      ) : !courses || courses.length===0 ? (
        <div className="card" style={{padding:36,textAlign:"center",color:COLORS.sub}}>مفيش كورسات متاحة حاليًا — تابعنا قريبًا.</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
          {courses.map(c=>{
            const purchase = purchases[c.id];
            const isApproved = purchase?.status==="approved";
            return (
              <div key={c.id} className="card" style={{overflow:"hidden"}}>
                <div style={{height:150,background: c.thumbnail_url? `url(${c.thumbnail_url}) center/cover`:"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {!c.thumbnail_url && <Film size={30} color={COLORS.sub}/>}
                </div>
                <div style={{padding:18}}>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{c.title}</div>
                  {c.instructor_name && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      {c.instructor_photo_url ? (
                        <img src={c.instructor_photo_url} alt={c.instructor_name} style={{width:26,height:26,borderRadius:"50%",objectFit:"cover"}}/>
                      ) : (
                        <div style={{width:26,height:26,borderRadius:"50%",background:"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center"}}><UserCircle size={16} color={COLORS.sub}/></div>
                      )}
                      <span style={{fontSize:12,color:COLORS.sub}}>{c.instructor_name}</span>
                    </div>
                  )}
                  <div style={{fontSize:13,color:COLORS.sub,lineHeight:1.7,marginBottom:14,minHeight:40}}>{c.description}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{fontWeight:800,fontSize:17}}>${c.price_usd}</div>
                    {isApproved && <span style={{fontSize:11,fontWeight:700,color:COLORS.teal,background:"rgba(0,217,166,0.12)",padding:"4px 10px",borderRadius:8}}>✓ مفعّل</span>}
                    {purchase?.status==="pending" && <span style={{fontSize:11,fontWeight:700,color:COLORS.gold,background:"rgba(255,200,87,0.12)",padding:"4px 10px",borderRadius:8}}>قيد المراجعة</span>}
                  </div>

                  {isApproved ? (
                    <button className="btn btn-primary" style={{width:"100%"}} onClick={()=>onOpenCourse(c.id)}>
                      <PlayCircle size={16} style={{verticalAlign:"middle",marginLeft:6}}/> ابدأ المشاهدة
                    </button>
                  ) : purchase?.status==="pending" ? (
                    <div style={{fontSize:12,color:COLORS.sub,textAlign:"center"}}>بنراجع إيصالك، هتتفعل خلال ساعات</div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {c.gumroad_url && (
                        <a href={c.gumroad_url} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{textDecoration:"none",textAlign:"center",fontSize:13}}>اشترِ الآن</a>
                      )}
                      <label className="btn btn-outline" style={{fontSize:12.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:uploadStatus[c.id]==="uploading"?0.6:1}}>
                        {uploadStatus[c.id]==="uploading" ? <Loader2 size={13} className="spin"/> : <Upload size={13}/>}
                        {uploadStatus[c.id]==="uploading" ? "جاري الرفع..." : "ارفع إيصال الدفع"}
                        <input type="file" accept="image/*,application/pdf" style={{display:"none"}} disabled={uploadStatus[c.id]==="uploading"}
                          onChange={e=>{ if(e.target.files[0]) uploadReceipt(c.id, e.target.files[0]); }}/>
                      </label>
                      {uploadStatus[c.id]==="done" && <div style={{fontSize:11,color:COLORS.teal,textAlign:"center"}}>✓ تم رفع الإيصال بنجاح</div>}
                      {uploadStatus[c.id]==="error" && <div style={{fontSize:11,color:"#ff8a8a",textAlign:"center"}}>حصل خطأ، حاول تاني</div>}
                    </div>
                  )}

                  {!isApproved && (
                    <button className="btn" style={{width:"100%",marginTop:8,background:"var(--panel2)",fontSize:12.5}} onClick={()=>onOpenCourse(c.id)}>
                      شاهد المعاينة المجانية
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================= مشغّل الكورس ============================= */
function CoursePlayer({ courseId, course, purchased, userId, profile, saveProfile, onExit }){
  const { lessons, loading } = useLessons(courseId);
  const { done, completedAt, markDone } = useLessonProgress(userId);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [englishNameInput, setEnglishNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(()=>{ if(lessons && lessons.length && !activeLessonId) setActiveLessonId(lessons[0].id); },[lessons]); // eslint-disable-line

  if(loading || !lessons){
    return <LoadingBlock text="جاري تحميل الكورس..." />;
  }

  const openPdf = async (path) => {
    setDownloadingPdf(true);
    const { data, error } = await supabase.storage.from("course-materials").createSignedUrl(path, 120);
    setDownloadingPdf(false);
    if(error){ alert("تعذر فتح الملف: "+error.message); return; }
    window.open(data.signedUrl, "_blank");
  };

  const activeLesson = lessons.find(l=>l.id===activeLessonId) || lessons[0];
  const completedCount = lessons.filter(l=>done[l.id]).length;
  const progressPct = lessons.length ? Math.round((completedCount/lessons.length)*100) : 0;
  const allDone = lessons.length>0 && completedCount===lessons.length;
  const completionDate = allDone
    ? new Date(Math.max(...lessons.map(l=> completedAt[l.id] ? new Date(completedAt[l.id]).getTime() : 0)))
    : null;

  const hasEnglishName = !!(profile?.certificate_name_en && profile.certificate_name_en.trim());

  const saveEnglishName = async (e) => {
    e.preventDefault();
    if(!englishNameInput.trim() || !saveProfile) return;
    setSavingName(true);
    await saveProfile({ ...profile, certificate_name_en: englishNameInput.trim() });
    setSavingName(false);
  };

  if(showCertificate && !hasEnglishName){
    return (
      <div style={{maxWidth:520,margin:"60px auto",padding:"0 20px"}}>
        <div className="card" style={{padding:26,textAlign:"center"}}>
          <Award size={28} color={COLORS.teal} style={{marginBottom:10}}/>
          <div style={{fontWeight:800,fontSize:17,marginBottom:6}}>قبل ما نطلعلك الشهادة</div>
          <div style={{fontSize:13,color:COLORS.sub,marginBottom:18,lineHeight:1.8}}>
            اكتب اسمك بالحروف الإنجليزية بالظبط زي ما عايزه يظهر على شهادتك — الاسم ده هيتحفظ وهيتستخدم لكل شهاداتك القادمة.
          </div>
          <form onSubmit={saveEnglishName}>
            <input required value={englishNameInput} onChange={e=>setEnglishNameInput(e.target.value)} placeholder="Ahmed Al-Ghamdi" dir="ltr"
              style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--panel2)",color:COLORS.light,fontFamily:"'Cairo',sans-serif",fontSize:14,marginBottom:14,textAlign:"left"}}/>
            <button className="btn btn-primary" type="submit" disabled={savingName} style={{width:"100%"}}>{savingName?"جاري الحفظ...":"حفظ وعرض الشهادة"}</button>
          </form>
          <button onClick={()=>setShowCertificate(false)} style={{background:"none",border:"none",color:COLORS.sub,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontSize:12.5,marginTop:14}}>← رجوع</button>
        </div>
      </div>
    );
  }

  if(showCertificate){
    return (
      <CourseCertificate
        traineeName={profile?.certificate_name_en || profile?.full_name || "المتدرب"}
        courseTitle={course?.title || "الكورس"}
        date={completionDate}
        onBack={()=>setShowCertificate(false)}
      />
    );
  }

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px 60px"}}>
      {course?.thumbnail_url && (
        <div style={{height:180,borderRadius:16,marginBottom:16,background:`url(${course.thumbnail_url}) center/cover`,border:"1px solid var(--border)"}}/>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <button onClick={onExit} style={{background:"none",border:"none",color:COLORS.sub,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontSize:13,marginBottom:6}}>← رجوع للكورسات</button>
          <h2 style={{fontSize:20,fontWeight:800,margin:0}}>{course?.title || "الكورس"}</h2>
          {course?.instructor_name && (
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
              {course.instructor_photo_url ? (
                <img src={course.instructor_photo_url} alt={course.instructor_name} style={{width:24,height:24,borderRadius:"50%",objectFit:"cover"}}/>
              ) : <UserCircle size={18} color={COLORS.sub}/>}
              <span style={{fontSize:12.5,color:COLORS.sub}}>{course.instructor_name}</span>
            </div>
          )}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:120,height:8,borderRadius:6,background:"var(--track)",overflow:"hidden"}}>
            <div style={{width:`${progressPct}%`,height:"100%",background:COLORS.teal}}/>
          </div>
          <span style={{fontSize:12.5,color:COLORS.sub}}>{completedCount}/{lessons.length} درس</span>
        </div>
      </div>

      {allDone && (
        <div className="card" style={{padding:18,marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"rgba(0,217,166,0.08)",border:"1px solid rgba(0,217,166,0.3)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Trophy size={20} color={COLORS.teal}/>
            <span style={{fontWeight:700,fontSize:14}}>مبروك! خلصت الكورس بالكامل 🎉</span>
          </div>
          <button className="btn btn-primary" onClick={()=>setShowCertificate(true)}>شوف شهادتك</button>
        </div>
      )}
      {lessons.length===0 ? (
        <div className="card" style={{padding:36,textAlign:"center",color:COLORS.sub}}>لسه مفيش دروس مضافة لهذا الكورس.</div>
      ) : !activeLesson ? null : (
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
          <div>
            <div className="card" style={{overflow:"hidden",marginBottom:14}}>
              {activeLesson.is_preview || purchased ? (
                <div style={{position:"relative",paddingBottom:"56.25%",height:0}}>
                  <iframe src={youtubeEmbedUrl(activeLesson.video_url)} title={activeLesson.title} allowFullScreen
                    style={{position:"absolute",top:0,right:0,width:"100%",height:"100%",border:"none"}}/>
                </div>
              ) : (
                <div style={{padding:60,textAlign:"center",color:COLORS.sub}}>
                  <Lock size={26} color={COLORS.gold}/>
                  <div style={{marginTop:10}}>الدرس ده متاح بس بعد الشراء</div>
                </div>
              )}
            </div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{activeLesson.title}</div>
            <div style={{fontSize:12.5,color:COLORS.sub,marginBottom:16}}>{activeLesson.duration_minutes} دقيقة</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {(activeLesson.is_preview || purchased) && (
                <button className="btn btn-outline" onClick={()=>{
                  markDone(userId, activeLesson.id);
                  const idx = lessons.findIndex(l=>l.id===activeLesson.id);
                  if(idx>-1 && idx<lessons.length-1) setActiveLessonId(lessons[idx+1].id);
                }} disabled={!!done[activeLesson.id]}>
                  {done[activeLesson.id] ? <><CheckCircle size={15} style={{verticalAlign:"middle",marginLeft:6}} color={COLORS.teal}/> اتشاهد</> : "علّم الدرس كمشاهَد"}
                </button>
              )}
              {(activeLesson.is_preview || purchased) && activeLesson.pdf_url && (
                <button className="btn" style={{background:"var(--panel2)"}} disabled={downloadingPdf} onClick={()=>openPdf(activeLesson.pdf_url)}>
                  <FileCheck2 size={15} style={{verticalAlign:"middle",marginLeft:6}}/> {downloadingPdf ? "جاري الفتح..." : "الملف المرفق (PDF)"}
                </button>
              )}
            </div>
          </div>

          <div className="card" style={{padding:14,alignSelf:"start"}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><ListVideo size={15}/> محتوى الكورس</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {(()=>{
                const sectionNames = [];
                lessons.forEach(l=>{ const s=l.section||null; if(!sectionNames.includes(s)) sectionNames.push(s); });
                return sectionNames.map(secName=>{
                  const secLessons = lessons.filter(l => (l.section||null) === secName);
                  return (
                    <div key={secName||"none"}>
                      {secName && <div style={{fontSize:11.5,fontWeight:700,color:COLORS.sub,marginBottom:6,paddingRight:4}}>{secName}</div>}
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {secLessons.map((l)=>{
                          const locked = !l.is_preview && !purchased;
                          const isActive = l.id===activeLesson.id;
                          const overallIndex = lessons.findIndex(x=>x.id===l.id)+1;
                          return (
                            <button key={l.id} onClick={()=>setActiveLessonId(l.id)} style={{
                              display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"right",
                              background: isActive? "rgba(0,217,166,0.12)":"transparent", fontFamily:"'Cairo',sans-serif"
                            }}>
                              {done[l.id] ? <CheckCircle size={15} color={COLORS.teal} style={{flexShrink:0}}/> : locked ? <Lock size={13} color={COLORS.sub} style={{flexShrink:0}}/> : <PlayCircle size={15} color={COLORS.sub} style={{flexShrink:0}}/>}
                              <span style={{fontSize:12.5,color: isActive?COLORS.light:COLORS.sub,flex:1}}>{overallIndex}. {l.title}</span>
                              <span style={{fontSize:10.5,color:COLORS.sub}}>{l.duration_minutes}د</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================= شهادة إتمام الكورس ============================= */
function CourseCertificate({ traineeName, courseTitle, date, onBack }){
  const dateStr = date ? date.toLocaleDateString("ar-EG", { year:"numeric", month:"long", day:"numeric" }) : "";
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 60px"}}>
      <div className="no-print" style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:COLORS.sub,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontSize:13.5}}>← رجوع للكورس</button>
        <button className="btn btn-primary" onClick={()=>window.print()}>
          <FileCheck2 size={15} style={{verticalAlign:"middle",marginLeft:6}}/> طباعة / حفظ كـPDF
        </button>
      </div>

      <div id="certificate-print-area" style={{
        border:"10px solid #0D132B", borderRadius:4, padding:"60px 50px", textAlign:"center",
        background:"linear-gradient(135deg,#ffffff,#f6faf8)", position:"relative"
      }}>
        <div style={{position:"absolute",top:18,right:18,bottom:18,left:18,border:"1.5px solid #00B894",borderRadius:2,pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#00D9A6,#7C6CF0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Check size={30} color="#fff" strokeWidth={3}/>
          </div>
        </div>
        <div style={{fontWeight:800,fontSize:20,color:"#0D132B",marginBottom:4}}>Najiz — ناجز</div>
        <div style={{fontSize:12,color:"#7a7a7a",marginBottom:36,letterSpacing:1}}>PREPARE · PRACTICE · PASS</div>

        <div style={{fontSize:15,color:"#7a7a7a",marginBottom:10}}>شهادة إتمام كورس</div>
        <div style={{fontSize:34,fontWeight:800,color:"#0D132B",marginBottom:26,fontFamily:"'Cairo',sans-serif"}}>{courseTitle}</div>

        <div style={{fontSize:13,color:"#7a7a7a",marginBottom:8}}>تُمنح هذه الشهادة إلى</div>
        <div style={{fontSize:28,fontWeight:800,color:"#00B894",marginBottom:30,borderBottom:"2px solid #FFC857",display:"inline-block",padding:"0 20px 10px"}}>{traineeName}</div>

        <div style={{fontSize:13.5,color:"#3a3a3a",lineHeight:2,maxWidth:520,margin:"0 auto 30px"}}>
          لإتمامه بنجاح جميع دروس هذا الكورس على منصة Najiz للتحضير للشهادات المهنية.
        </div>

        <div style={{fontSize:12.5,color:"#7a7a7a"}}>{dateStr}</div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print-area, #certificate-print-area * { visibility: visible; }
          #certificate-print-area { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
