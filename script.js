import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, push, set, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const app = initializeApp({
    apiKey: "AIzaSyBXsX0v_7p8CHDFiTUm4XkQsoZIqGueAOk",
    authDomain: "the-process-5d196.firebaseapp.com",
    databaseURL: "https://the-process-5d196-default-rtdb.firebaseio.com",
    projectId: "the-process-5d196",
    storageBucket: "the-process-5d196.firebasestorage.app",
    messagingSenderId: "96415822332",
    appId: "1:96415822332:web:2be476bee2e474383d8279"
});
const db = getDatabase(app);

// ── Device Fingerprint — معرف ثابت لكل جهاز/متصفح ──────────
// بيتولّد مرة واحدة بس ويتخزن في localStorage، وييفضل ثابت طول عمر المتصفح
// (حتى لو الطالب قفل المتصفح وفتحه تاني، أو غيّر شبكة الإنترنت/IP)
function getOrCreateDeviceId() {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        // استخدام crypto.randomUUID لو متاحة، وإلا fallback بسيط
        id = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : 'dev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12);
        localStorage.setItem('deviceId', id);
    }
    return id;
}

// ── جلب IP الطالب عبر خدمة خارجية مجانية ──────────────────
let cachedIp = null;
async function getClientIp() {
    if (cachedIp) return cachedIp;
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        cachedIp = data.ip;
        return cachedIp;
    } catch (e) {
        return 'غير معروف';
    }
}

// ── تحديد نوع الجهاز (موبايل/تابلت/لابتوب) من User-Agent ──
function getDeviceType() {
    const ua = navigator.userAgent || '';
    if (/iPad|Tablet/i.test(ua)) return '📱 تابلت';
    if (/Mobile|iPhone|Android/i.test(ua)) return '📱 موبايل';
    return '💻 كمبيوتر/لابتوب';
}

function getBrowserName() {
    const ua = navigator.userAgent || '';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Safari/')) return 'Safari';
    return 'متصفح غير معروف';
}


function toEmbedUrl(url) {
    if (!url) return url;
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    return url;
}

// Chapter names per CODE
const CHAPTER_NAMES = {
    CODE1: { 1: 'الفصل الأول', 2: 'الفصل الثاني', 3: 'الفصل الثالث', 4: 'الفصل الرابع', 5: 'الفصل الخامس', 6: 'الفصل السادس', 7: 'الفصل السابع', 8: 'الفصل الثامن' },
    CODE2: { 1: 'Chapter 1', 2: 'Chapter 2', 3: 'Chapter 3', 4: 'Chapter 4', 5: 'Chapter 5', 6: 'Chapter 6', 7: 'Chapter 7', 8: 'Chapter 8' },
    CODE3: { 1: 'مراجعة الفصل الأول' },
    CODE4: { 1: 'Chapter 1 Revision' },
    CODE5: { 1: 'Homework' },
    CODE6: { 1: 'مراجعة الفصل الثاني' },
    CODE7: { 1: 'Chapter 2' },
    CODE8: { 1: 'الفصل الثالث' },
    CODE9: { 1: 'Chapter 3' },
    CODE10: { 1: 'Final Revision' },
    CODE11: { 1: 'مراجعة نصف السنة' },
    CODE12: { 1: 'Mid-Year Review' },
    CODE13: { 1: 'Homework' },
};

// Branch titles for CODE1/CODE2 chapter groups
const BRANCH_CHAPTERS = {
    CODE1: { electric: [1, 2, 3, 4], modern: [5, 6, 7, 8] },
    CODE2: { electric: [1, 2, 3, 4], modern: [5, 6, 7, 8] },
};

document.addEventListener('DOMContentLoaded', async function () {

    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    // ── Sidebar ───────────────────────────────────────────────
    sidebarToggle?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.getElementById('sidebarLoginToggle')?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.addEventListener('click', e => { if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('active'); });
    sidebar.addEventListener('click', e => e.stopPropagation());

    document.getElementById('homeLink')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    });


    // ── Auth helpers ──────────────────────────────────────────
    const showLogin = () => { loginContainer.style.display = 'flex'; mainContent.style.display = 'none'; };
    const showMain = () => { loginContainer.style.display = 'none'; mainContent.style.display = 'block'; };

    window.logout = function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('loginType');
        window.location.reload();
    };

    // ── Ban Watcher — يراقب الطالب real-time ─────────────────
    let banWatcherRef = null;
    function startBanWatcher(username) {
        if (banWatcherRef) off(banWatcherRef); // امسح القديم لو موجود
        banWatcherRef = ref(db, 'students/' + username + '/banned');
        onValue(banWatcherRef, (snap) => {
            if (snap.val() === true) {
                off(banWatcherRef);
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                localStorage.removeItem('loginType');
                showLogin();
                document.getElementById('errorMessage').style.color = '#dc3545';
                document.getElementById('errorMessage').textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
            }
        });
    }

    // Check students collection
    async function getStudent(username) {
        try {
            const snap = await get(ref(db, 'students/' + username));
            return snap.exists() ? snap.val() : null;
        } catch { return null; }
    }

    // ── Device Lock — تتأكد إن الكود مش مستخدم على جهاز تاني ──
    // ترجع: { ok: true } لو مسموح (نفس الجهاز أو أول استخدام)
    //       { ok: false } لو الكود مربوط بجهاز مختلف
    async function checkDeviceLock(username, student) {
        const myDeviceId = getOrCreateDeviceId();
        const registeredId = student && student.deviceId;

        if (!registeredId) {
            // أول مرة يتسجل فيها جهاز لهذا الكود — نسجله ونسمح
            try { await set(ref(db, `students/${username}/deviceId`), myDeviceId); } catch (e) { /* non-blocking */ }
            return { ok: true };
        }
        if (registeredId === myDeviceId) {
            return { ok: true }; // نفس الجهاز المسجل من قبل
        }
        // ── جهاز مختلف — نسجل المحاولة المرفوضة في blockedAttempts ──
        try {
            const ip = await getClientIp();
            // مقارنة IP بآخر دخول ناجح — مؤشر استرشادي بس، ما بيأثرش على القرار
            const lastIp = student && student.lastSuccessIp ? student.lastSuccessIp : null;
            const sameNetwork = !!(lastIp && ip && lastIp === ip);
            await push(ref(db, `blockedAttempts/${username}`), {
                at: Date.now(),
                ip: ip,
                deviceType: getDeviceType(),
                browser: getBrowserName(),
                studentName: student && student.name ? student.name : '',
                sameNetwork: sameNetwork,
                read: false
            });
        } catch (e) { /* non-blocking */ }
        return { ok: false }; // جهاز مختلف عن المسجل
    }

    // ── تحديد مصدر القفل الصحيح لكود معين: students لو موجود فيها، وإلا reviewDevices ──
    async function getReviewLockPath(code) {
        try {
            const snap = await get(ref(db, `students/${code}`));
            if (snap.exists()) return { path: `students/${code}`, isStudent: true, data: snap.val() };
        } catch (e) { /* non-blocking */ }
        return { path: `reviewDevices/${code}`, isStudent: false, data: null };
    }

    // ── Device Lock لكودات المراجعة (reviews) — نفس منطق الطلاب بالضبط ──
    // مصدر واحد للحقيقة: لو الكود ده أصلاً كود طالب موجود في students،
    // نستخدم students/{code}/deviceId (نفس مكان قفل الطالب العادي)
    // عشان ميبقاش فيه جهازين منفصلين لنفس الكود. غير كده، نستخدم
    // node مستقل: reviewDevices/{code} (لأكواد المراجعة المستقلة بدون طالب)
    async function checkReviewDeviceLock(code, reviewInfo) {
        const myDeviceId = getOrCreateDeviceId();

        const lock = await getReviewLockPath(code);
        const lockPath = lock.path;
        let regData = lock.data;
        if (!lock.isStudent) {
            try {
                const snap = await get(ref(db, lockPath));
                regData = snap.exists() ? snap.val() : null;
            } catch (e) { regData = null; }
        }

        const registeredId = regData && regData.deviceId;

        if (!registeredId) {
            // أول مرة يتسجل فيها جهاز لهذا الكود — نسجله ونسمح
            try { await set(ref(db, `${lockPath}/deviceId`), myDeviceId); } catch (e) { /* non-blocking */ }
            return { ok: true };
        }
        if (registeredId === myDeviceId) {
            return { ok: true }; // نفس الجهاز المسجل من قبل
        }
        // ── جهاز مختلف — نسجل المحاولة المرفوضة في blockedAttempts ──
        try {
            const ip = await getClientIp();
            const lastIp = regData && regData.lastSuccessIp ? regData.lastSuccessIp : null;
            const sameNetwork = !!(lastIp && ip && lastIp === ip);
            await push(ref(db, `blockedAttempts/${code}`), {
                at: Date.now(),
                ip: ip,
                deviceType: getDeviceType(),
                browser: getBrowserName(),
                studentName: (reviewInfo && reviewInfo.desc) ? reviewInfo.desc : 'مراجعة',
                sameNetwork: sameNetwork,
                read: false
            });
        } catch (e) { /* non-blocking */ }
        return { ok: false }; // جهاز مختلف عن المسجل
    }

    // Check if code is a review access code → return review info
    async function getReviewByCode(code) {
        try {
            const snap = await get(ref(db, 'reviews'));
            if (!snap || !snap.exists()) return null;
            const reviews = snap.val();
            if (!reviews || typeof reviews !== 'object') return null;
            for (const [rcId, rc] of Object.entries(reviews)) {
                if (!rc || !rc.accessCodes) continue;
                const accessCodes = Object.values(rc.accessCodes);
                if (accessCodes.map(String).includes(String(code))) {
                    return { rcId, code: rc.code || rcId, desc: rc.desc || '', videos: rc.videos || {} };
                }
            }
            return null;
        } catch (e) {
            console.warn('getReviewByCode error (non-blocking):', e);
            return null;
        }
    }

    // ── Check login on load ───────────────────────────────────
    async function checkLoginState() {
        // ── Auto-login من URL parameter (?username=XXXX) ──────
        const urlParams = new URLSearchParams(window.location.search);
        const urlUser = urlParams.get('username');
        if (urlUser) {
            // امسح الـ param من الرابط بدون reload
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            // جرب student أولاً
            const studentFromUrl = await getStudent(urlUser);
            if (studentFromUrl && studentFromUrl.videoCode && !studentFromUrl.banned) {
                // ── فحص الجهاز — يمنع استخدام الكود من جهاز مختلف ──
                const deviceCheckUrl = await checkDeviceLock(urlUser, studentFromUrl);
                if (!deviceCheckUrl.ok) {
                    showLogin();
                    document.getElementById('errorMessage').style.color = '#dc3545';
                    document.getElementById('errorMessage').textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                    return;
                }
                const now = Date.now();
                set(ref(db, `students/${urlUser}/lastSeen`), now);
                getClientIp().then(ip => {
                    push(ref(db, `loginLogs/${urlUser}`), {
                        at: now, name: studentFromUrl.name, ip,
                        deviceType: getDeviceType(), browser: getBrowserName()
                    });
                    set(ref(db, `students/${urlUser}/lastSuccessIp`), ip);
                });
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', urlUser);
                localStorage.setItem('loginType', 'student');
                await loadVideoContent(studentFromUrl.videoCode, urlUser, studentFromUrl);
                showMain();
                startBanWatcher(urlUser);
                return;
            }
            // جرب review code
            let rvUrl = null;
            try { rvUrl = await getReviewByCode(urlUser); } catch (e) { rvUrl = null; }
            if (rvUrl) {
                // ── فحص الجهاز — يمنع استخدام كود المراجعة من جهاز مختلف ──
                const reviewDeviceCheckUrl = await checkReviewDeviceLock(urlUser, rvUrl);
                if (!reviewDeviceCheckUrl.ok) {
                    showLogin();
                    document.getElementById('errorMessage').style.color = '#dc3545';
                    document.getElementById('errorMessage').textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                    return;
                }
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', urlUser);
                localStorage.setItem('loginType', 'review');
                getClientIp().then(async ip => {
                    push(ref(db, `loginLogs/${urlUser}`), {
                        at: Date.now(), name: rvUrl.desc || 'مراجعة', ip,
                        deviceType: getDeviceType(), browser: getBrowserName()
                    });
                    const lock = await getReviewLockPath(urlUser);
                    set(ref(db, `${lock.path}/lastSuccessIp`), ip);
                });
                await loadReviewContent(rvUrl, urlUser);
                showMain();
                return;
            }
            // الكود مش موجود — وريه رسالة خطأ في اللوجين
            showLogin();
            document.getElementById('errorMessage').style.color = '#dc3545';
            document.getElementById('errorMessage').textContent = '❌ الكود مش موجود، تواصل مع المشرف.';
            return;
        }
        // ─────────────────────────────────────────────────────
        const loggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        const loginType = localStorage.getItem('loginType'); // 'student' or 'review'
        if (loggedIn === 'true' && username) {
            if (loginType === 'review') {
                let rv = null;
                try { rv = await getReviewByCode(username); } catch (e) { rv = null; }
                if (rv) {
                    // ── فحص الجهاز — حتى في الدخول التلقائي من localStorage ──
                    const reviewDeviceCheckAuto = await checkReviewDeviceLock(username, rv);
                    if (!reviewDeviceCheckAuto.ok) {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('username');
                        localStorage.removeItem('loginType');
                        showLogin();
                        document.getElementById('errorMessage').style.color = '#dc3545';
                        document.getElementById('errorMessage').textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                        return;
                    }
                    await loadReviewContent(rv, username); showMain(); return;
                }
            }
            const student = await getStudent(username);
            if (student && student.videoCode) {
                if (student.banned) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    localStorage.removeItem('loginType');
                    showLogin();
                    document.getElementById('errorMessage').style.color = '#dc3545';
                    document.getElementById('errorMessage').textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
                    return;
                }
                // ── فحص الجهاز — حتى في الدخول التلقائي من localStorage ──
                const deviceCheckAuto = await checkDeviceLock(username, student);
                if (!deviceCheckAuto.ok) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    localStorage.removeItem('loginType');
                    showLogin();
                    document.getElementById('errorMessage').style.color = '#dc3545';
                    document.getElementById('errorMessage').textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                    return;
                }
                // ── تحديث lastSeen عند كل فتح للموقع (حتى بدون login جديد) ──
                set(ref(db, `students/${username}/lastSeen`), Date.now());
                await loadVideoContent(student.videoCode, username, student);
                showMain();
                startBanWatcher(username);
            } else { showLogin(); }
        } else { showLogin(); }
    }

    // ── Login ─────────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const errEl = document.getElementById('errorMessage');
        errEl.style.color = '#888';
        errEl.textContent = '⏳ جاري التحقق...';

        // 1. Check review codes first (non-blocking — if fails, continue to student check)
        let rv = null;
        try { rv = await getReviewByCode(username); } catch (e) { rv = null; }
        if (rv) {
            // ── فحص الجهاز — يمنع استخدام كود المراجعة من جهاز مختلف ──
            const reviewDeviceCheck = await checkReviewDeviceLock(username, rv);
            if (!reviewDeviceCheck.ok) {
                errEl.style.color = '#dc3545';
                errEl.textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                return;
            }
            errEl.textContent = '';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginType', 'review');
            getClientIp().then(async ip => {
                push(ref(db, `loginLogs/${username}`), {
                    at: Date.now(), name: rv.desc || 'مراجعة', ip,
                    deviceType: getDeviceType(), browser: getBrowserName()
                });
                const lock = await getReviewLockPath(username);
                set(ref(db, `${lock.path}/lastSuccessIp`), ip);
            });
            await loadReviewContent(rv, username);
            showMain();
            videoContainer.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // 2. Check student codes
        const student = await getStudent(username);
        if (student && student.videoCode) {
            if (student.banned) {
                errEl.style.color = '#dc3545';
                errEl.textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
                return;
            }
            // ── فحص الجهاز — يمنع استخدام الكود من جهاز مختلف ──
            const deviceCheck = await checkDeviceLock(username, student);
            if (!deviceCheck.ok) {
                errEl.style.color = '#dc3545';
                errEl.textContent = '🔒 هذا الكود مستخدم على جهاز آخر، تواصل مع المشرف';
                return;
            }
            errEl.textContent = '';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginType', 'student');
            // ── سجّل الدخول ──────────────────────────────────────
            const now = Date.now();
            set(ref(db, `students/${username}/lastSeen`), now);
            getClientIp().then(ip => {
                push(ref(db, `loginLogs/${username}`), {
                    at: now, name: student.name, ip,
                    deviceType: getDeviceType(), browser: getBrowserName()
                });
                set(ref(db, `students/${username}/lastSuccessIp`), ip);
            });
            // ─────────────────────────────────────────────────────
            await loadVideoContent(student.videoCode, username, student);
            showMain();
            startBanWatcher(username);
            videoContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            errEl.style.color = '#dc3545';
            errEl.textContent = 'Invalid access code, please try again';
        }
    });

    // ── Load Review Content ──────────────────────────────────
    async function loadReviewContent(rv, callerUsername) {
        // حماية من null/undefined
        const videos = (rv && rv.videos && typeof rv.videos === 'object') ? rv.videos : {};
        const sorted = Object.values(videos).sort((a, b) => (a.order || 0) - (b.order || 0));

        // جيب الـ tasks الخاصة بالمجموعة دي
        let tasks = [];
        try {
            const tSnap = await get(ref(db, 'reviews/' + rv.rcId + '/tasks'));
            if (tSnap.exists()) {
                const tVal = tSnap.val();
                if (Array.isArray(tVal)) tasks = tVal.filter(Boolean);
                else tasks = Object.values(tVal).sort((a,b)=>(a.order||0)-(b.order||0));
            }
        } catch(e) { /* non-blocking */ }

        // loggedUser: من المعامل أو من localStorage
        const loggedUser = callerUsername || localStorage.getItem('username');

        // جيب progress الطالب الحالي
        let myProgress = { watched: false, tasks: {} };
        if (loggedUser) {
            try {
                const pSnap = await get(ref(db, `studentProgress/${loggedUser}/${rv.rcId}`));
                if (pSnap.exists()) myProgress = pSnap.val() || myProgress;
            } catch(e) { /* non-blocking */ }
        }

        // حفظ urls وعناوين الأجزاء لكل فيديو عشان نستخدمها في lazy load
        const videoUrls = sorted.map(v => {
            const urls = [];
            for (let j = 1; j <= 20; j++) { if (v['url' + j]) urls.push(toEmbedUrl(v['url' + j])); }
            return urls;
        });
        const videoPartTitles = sorted.map(v => {
            const titles = [];
            for (let j = 1; j <= 20; j++) { if (v['url' + j]) titles.push(v['title' + j] || ''); }
            return titles;
        });

        let html = `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>🎯 فيديوهات المراجعة</h3>
                <p>${rv.desc || rv.code || ''}</p>
            </div>
        </div>`;

        const rvCode = rv.code || rv.rcId || 'REVIEW';
        html += '<div class="video-menu"><select class="video-selector" id="rvSelect" onchange="window._rvShow(this.value)">';
        html += '<option value="">اختر الفيديو...</option>';
        sorted.forEach((v, i) => {
            html += `<option value="${i}" data-video-code="${rvCode}" data-chapter-num="0" data-chapter-name="مراجعة" data-video-title="${v.title || ''}" data-student-name="">${v.title || ''}</option>`;
        });
        html += '</select></div>';

        // كل div فيديو فارغ — الـ iframes هتتحط بس لما الطالب يختار (lazy)
        sorted.forEach((v, i) => {
            html += `<div class="video" id="rv_${i}" style="display:none;">`;
            html += `<h3 class="video-title">${v.title || ''}</h3>`;
            html += `<div class="rv-frames" id="rv_frames_${i}"></div>`;
            html += '</div>';
        });

        html += `<div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        // ── Tasks Section ──────────────────────────────────────
        // ── Tasks Section (Day-Based) ─────────────────────────
        if (tasks.length > 0) {
            // تحديد إذا كان الفورمات أيام أو flat
            const isDayBased = tasks.length > 0 && tasks[0] && typeof tasks[0] === 'object' && 'tasks' in tasks[0];

            if (isDayBased) {
                // ── حساب الـ progress لكل يوم ──────────────────
                // myProgress.tasks = { d0: {0:true, 1:false}, d1: {...} }
                const dayProgress = myProgress.tasks || {};
                let totalTasks = 0, totalDone = 0;
                tasks.forEach(function(day, di) {
                    const dayT = day.tasks || [];
                    const dp = dayProgress['d'+di] || {};
                    totalTasks += dayT.length;
                    dayT.forEach(function(_, ti) { if(dp[ti]===true) totalDone++; });
                });
                const pct = totalTasks > 0 ? Math.round((totalDone/totalTasks)*100) : 0;
                const allDone = totalTasks > 0 && totalDone === totalTasks;

                html += `<div class="tasks-section" id="tasksSection">
                    <div class="tasks-header">
                        <h3>📋 المهام المطلوبة</h3>
                        <span class="tasks-progress-badge${allDone?' all-done':''}" id="tasksBadge">${totalDone}/${totalTasks} ✓</span>
                    </div>

                    <!-- Day Tabs -->
                    <div class="tasks-day-tabs" id="tasksDayTabs">`;
                tasks.forEach((day, di) => {
                    const dayT = day.tasks || [];
                    const dp = dayProgress['d'+di] || {};
                    const dDone = dayT.filter((_, ti) => dp[ti]===true).length;
                    const dAll  = dDone === dayT.length && dayT.length > 0;
                    html += `<button class="tasks-day-tab${di===0?' active':''}" onclick="window._switchDay(${di})" id="dayTab_${di}">
                        <span class="tasks-day-tab-label">${day.label||'اليوم '+(di+1)}</span>
                        <span class="tasks-day-tab-badge${dAll?' done':''}">${dDone}/${dayT.length}</span>
                    </button>`;
                });
                html += `</div>`;

                // ── Day Panels ──────────────────────────────────
                tasks.forEach((day, di) => {
                    const dayT = day.tasks || [];
                    const dp   = dayProgress['d'+di] || {};
                    html += `<div class="tasks-day-panel${di===0?' active':''}" id="dayPanel_${di}">`;
                    if (day.title) html += `<div class="tasks-day-title">${day.title}</div>`;
                    html += `<div class="tasks-list">`;
                    dayT.forEach((task, ti) => {
                        const done = dp[ti] === true;
                        html += `<label class="task-item${done?' done':''}" id="task_${di}_${ti}">
                            <input type="checkbox" class="task-checkbox" ${done?'checked':''} onchange="window._toggleTask(${di}, ${ti}, this.checked, '${rv.rcId}')">
                            <div class="task-status-icon"></div>
                            <span class="task-text">${task.text||task}</span>
                        </label>`;
                    });
                    if (!dayT.length) html += `<p style="color:#6b7280;font-size:.85rem;text-align:center;padding:.5rem 0">لا توجد مهام لهذا اليوم</p>`;
                    html += `</div></div>`;
                });

                html += `<div class="tasks-progress-bar-wrap">
                    <div class="tasks-progress-bar-bg">
                        <div class="tasks-progress-bar-fill" id="tasksBarFill" style="width:${pct}%"></div>
                    </div>
                </div></div>`;

            } else {
                // ── Flat fallback (old format) ──────────────────
                const doneCount = Object.values(myProgress.tasks || {}).filter(Boolean).length;
                const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
                const allDone = doneCount === tasks.length;
                html += `<div class="tasks-section" id="tasksSection">
                    <div class="tasks-header">
                        <h3>📋 المهام المطلوبة</h3>
                        <span class="tasks-progress-badge${allDone?' all-done':''}" id="tasksBadge">${doneCount}/${tasks.length} ✓</span>
                    </div>
                    <div class="tasks-list">`;
                tasks.forEach((task, i) => {
                    const done = myProgress.tasks && myProgress.tasks[i] === true;
                    html += `<label class="task-item${done?' done':''}" id="task_flat_${i}">
                        <input type="checkbox" class="task-checkbox" ${done?'checked':''} onchange="window._toggleTask(-1, ${i}, this.checked, '${rv.rcId}')">
                        <div class="task-status-icon"></div>
                        <span class="task-text">${task.text||task}</span>
                    </label>`;
                });
                html += `</div>
                    <div class="tasks-progress-bar-wrap">
                        <div class="tasks-progress-bar-bg">
                            <div class="tasks-progress-bar-fill" id="tasksBarFill" style="width:${pct}%"></div>
                        </div>
                    </div></div>`;
            }

            // Toast notification
            html += `<div class="tasks-done-toast" id="tasksDoneToast">
                <div class="tasks-done-toast-icon">🎯</div>
                <div class="tasks-done-toast-body">
                    <div class="tasks-done-toast-title">أنجزت كل المهام! 🔥</div>
                    <div class="tasks-done-toast-msg">تسلم كدا، انت ماشي على الخطة مظبوط ❤️</div>
                </div>
            </div>`;
        }

        videoContainer.innerHTML = html;

        // تعبئة اسم الطالب
        if (loggedUser) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(opt => {
                opt.dataset.studentName = loggedUser;
            });
        }

        // lazy loader — بيحط الـ iframes لما الطالب يختار الفيديو بس
        window._rvShow = function (idx) {
            if (idx === '' || idx === null || idx === undefined) return;
            const i = parseInt(idx);
            // إخفاء كل الفيديوهات
            sorted.forEach((_, k) => {
                const el = document.getElementById('rv_' + k);
                if (el) el.style.display = 'none';
            });
            const el = document.getElementById('rv_' + i);
            if (!el) return;
            // inject iframes لو لسه متحطتش
            const framesDiv = document.getElementById('rv_frames_' + i);
            if (framesDiv && framesDiv.childElementCount === 0) {
                const urls = videoUrls[i] || [];
                const customTitles = videoPartTitles[i] || [];
                const defaultLabels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر'];
                let framesHtml = '';
                urls.forEach((url, j) => {
                    if (urls.length > 1) {
                        const label = (customTitles[j] && customTitles[j].trim()) ? customTitles[j] : ('الجزء ' + (defaultLabels[j] || j + 1));
                        framesHtml += `<h3 class="video-title">${label}</h3>`;
                    }
                    framesHtml += `<div class="video-wrapper"><iframe src="${url}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe></div>`;
                });
                framesDiv.innerHTML = framesHtml;
            }
            el.style.display = 'block';
            if (window.innerWidth <= 768) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // ── سجّل المشاهدة + حدّث watched في studentProgress ──
            try {
                const v = sorted[i];
                const sel = document.getElementById('rvSelect');
                const opt = sel ? sel.options[sel.selectedIndex] : null;
                if (loggedUser && opt && opt.dataset.videoCode) {
                    const now = Date.now();
                    push(ref(db, 'watchLogs'), {
                        studentCode: loggedUser, studentName: opt.dataset.studentName || '',
                        videoCode: opt.dataset.videoCode, chapterNum: 0,
                        chapterName: 'مراجعة', videoTitle: v.title || '', at: now
                    });
                    // تسجيل المشاهدة في studentProgress (مرة واحدة بس)
                    if (!myProgress.watched) {
                        myProgress.watched = true;
                        set(ref(db, `studentProgress/${loggedUser}/${rv.rcId}/watched`), true);
                        set(ref(db, `studentProgress/${loggedUser}/${rv.rcId}/watchedAt`), now);
                        set(ref(db, `studentProgress/${loggedUser}/${rv.rcId}/studentName`), opt.dataset.studentName || loggedUser);
                    }
                }
            } catch (e) { /* non-blocking */ }
        };

        // ── Switch Day Tab ────────────────────────────────────
        window._switchDay = function(di) {
            document.querySelectorAll('.tasks-day-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tasks-day-panel').forEach(p => p.classList.remove('active'));
            const tab = document.getElementById('dayTab_'+di);
            const panel = document.getElementById('dayPanel_'+di);
            if(tab) tab.classList.add('active');
            if(panel) panel.classList.add('active');
        };

        // ── Toggle Task ───────────────────────────────────────
        window._toggleTask = function (dayIdx, taskIdx, checked, rcId) {
            const loggedUser = localStorage.getItem('username');
            if (!loggedUser) return;

            if (dayIdx >= 0) {
                // Day-based: path = studentProgress/{user}/{rcId}/tasks/d{di}/{ti}
                set(ref(db, `studentProgress/${loggedUser}/${rcId}/tasks/d${dayIdx}/${taskIdx}`), checked);
                const item = document.getElementById(`task_${dayIdx}_${taskIdx}`);
                if (item) item.classList.toggle('done', checked);
            } else {
                // Flat fallback
                set(ref(db, `studentProgress/${loggedUser}/${rcId}/tasks/${taskIdx}`), checked);
                const item = document.getElementById(`task_flat_${taskIdx}`);
                if (item) item.classList.toggle('done', checked);
            }

            // ── إعادة حساب الـ progress الكلي ──────────────
            const allBoxes = document.querySelectorAll('.task-checkbox');
            const total    = allBoxes.length;
            const doneNow  = Array.from(allBoxes).filter(b => b.checked).length;

            const badge = document.getElementById('tasksBadge');
            const bar   = document.getElementById('tasksBarFill');
            if (badge) {
                badge.textContent = `${doneNow}/${total} ✓`;
                const allDone = doneNow === total;
                badge.classList.toggle('all-done', allDone);
                if (bar) bar.style.width = total > 0 ? Math.round((doneNow/total)*100)+'%' : '0%';

                // تحديث badge اليوم الحالي
                if (dayIdx >= 0) {
                    const dayBoxes = document.querySelectorAll(`#dayPanel_${dayIdx} .task-checkbox`);
                    const dayDone  = Array.from(dayBoxes).filter(b=>b.checked).length;
                    const dayTab   = document.getElementById('dayTab_'+dayIdx);
                    if (dayTab) {
                        const dBadge = dayTab.querySelector('.tasks-day-tab-badge');
                        if (dBadge) {
                            dBadge.textContent = `${dayDone}/${dayBoxes.length}`;
                            dBadge.classList.toggle('done', dayDone===dayBoxes.length && dayBoxes.length>0);
                        }
                    }
                }

                // Toast لما يخلص كل المهام
                if (allDone && checked) {
                    const toast = document.getElementById('tasksDoneToast');
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => toast.classList.remove('show'), 4500);
                    }
                }
            }
        };

        // عرض الفيديو الأول تلقائياً
        if (sorted.length > 0) {
            const sel = document.getElementById('rvSelect');
            if (sel) sel.value = '0';
            window._rvShow('0');
        }
    }

    // ── Build video card HTML ─────────────────────────────────
    function buildVideoCard(v, idPrefix) {
        const urls = [];
        const partTitles = [];
        for (let i = 1; i <= 20; i++) {
            if (v['url' + i]) {
                urls.push(toEmbedUrl(v['url' + i]));
                partTitles.push(v['title' + i] || '');
            }
        }
        if (!urls.length) return '';

        // حفظ الـ urls والعناوين في data attributes — الـ iframes هتتحط بس لما الفيديو يتاختار
        let html = `<div class="video" id="${idPrefix}" style="display:none;" data-urls='${JSON.stringify(urls)}' data-part-titles='${JSON.stringify(partTitles)}' data-title="${(v.title || '').replace(/'/g, "&apos;")}">`;
        html += `<h3 class="video-title">${v.title || ''}</h3>`;
        html += `<div class="hw-frames" id="frames_${idPrefix}"></div>`;
        html += '</div>';
        return html;
    }

    // ── Build chapter HTML ────────────────────────────────────
    function buildChapter(chNum, chName, videos, code, studentCode, forceActive) {
        const sorted = Object.entries(videos)
            .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
            .filter(([vid, v]) => {
                if (!v.accessCodes) return true;
                const codes = Object.values(v.accessCodes).map(String);
                if (!codes.length) return true;
                return codes.includes(String(studentCode));
            });

        if (!sorted.length) return '';

        const isActive = (forceActive || chNum === 1) ? 'active' : '';
        let html = `<div id="chapter-${chNum}" class="chapter-content ${isActive}">`;
        html += `<h2 class="chapter-title">${chName}</h2>`;
        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
        html += `<option value="">${code.startsWith('CODE1') || code === 'CODE8' || code === 'CODE11' ? 'اختر الفيديو...' : 'Select video...'}</option>`;
        sorted.forEach(([vid, v]) => {
            html += `<option value="v_${chNum}_${vid}" data-video-code="${code}" data-chapter-num="${chNum}" data-chapter-name="${chName}" data-video-title="${v.title}" data-student-name="">${v.title}</option>`;
        });
        html += '</select></div>';
        sorted.forEach(([vid, v]) => {
            html += buildVideoCard(v, `v_${chNum}_${vid}`);
        });
        html += '</div>';
        return html;
    }

    // ── showVideo ─────────────────────────────────────────────
    window._showVideo = function (id, dataset) {
        if (!id) return;
        // ── سجّل المشاهدة ─────────────────────────────────────
        const loggedUser = localStorage.getItem('username');
        if (loggedUser && dataset && dataset.videoCode) {
            const now = Date.now();
            const meta = {
                studentCode: loggedUser,
                studentName: dataset.studentName || '',
                videoCode: dataset.videoCode || '',
                chapterNum: dataset.chapterNum || '',
                chapterName: dataset.chapterName || '',
                videoTitle: dataset.videoTitle || '',
                at: now
            };
            push(ref(db, `watchLogs`), meta);
            // تحديث عداد المشاهدات على الفيديو
            const vidKey = `videoStats/${meta.videoCode}_ch${meta.chapterNum}_${id}`;
            get(ref(db, vidKey)).then(snap => {
                const prev = snap.exists() ? (snap.val() || {}) : {};
                set(ref(db, vidKey), {
                    title: meta.videoTitle,
                    code: meta.videoCode,
                    chapter: meta.chapterNum,
                    chapterName: meta.chapterName,
                    views: (prev.views || 0) + 1,
                    lastWatched: now
                });
            });
        }
        // ─────────────────────────────────────────────────────
        const chNum = id.split('_')[1];
        // hide all videos in same chapter
        const chEl = document.getElementById('chapter-' + chNum);
        if (chEl) chEl.querySelectorAll('.video').forEach(v => v.style.display = 'none');
        const t = document.getElementById(id);
        if (t) {
            // Lazy inject iframes لو لسه متحطتش
            const framesDiv = document.getElementById('frames_' + id);
            if (framesDiv && framesDiv.childElementCount === 0) {
                try {
                    const urls = JSON.parse(t.dataset.urls || '[]');
                    const customTitles = JSON.parse(t.dataset.partTitles || '[]');
                    const defaultLabels = ['الجزء الأول', 'الجزء الثاني', 'الجزء الثالث', 'الجزء الرابع', 'الجزء الخامس', 'الجزء السادس', 'الجزء السابع', 'الجزء الثامن', 'الجزء التاسع', 'الجزء العاشر', 'الجزء الحادي عشر', 'الجزء الثاني عشر', 'الجزء الثالث عشر', 'الجزء الرابع عشر', 'الجزء الخامس عشر'];
                    let framesHtml = '';
                    urls.forEach((url, i) => {
                        if (urls.length > 1) {
                            const label = (customTitles[i] && customTitles[i].trim()) ? customTitles[i] : (defaultLabels[i] || 'جزء ' + (i + 1));
                            framesHtml += `<h3 class="video-title">${label}</h3>`;
                        }
                        framesHtml += `<div class="video-wrapper"><iframe src="${url}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe></div>`;
                    });
                    framesDiv.innerHTML = framesHtml;
                } catch (e) { /* non-blocking */ }
            }
            t.style.display = 'block';
            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // ── switchChapter (inside a branch) ──────────────────────
    window.switchChapter = function (num, branchId) {
        const scope = branchId
            ? document.getElementById(branchId + '-physics')
            : (document.querySelector('.branch-content[style*="display: block"]')
                || document.querySelector('.branch-content[style*="display:block"]')
                || videoContainer);
        if (!scope) return;
        scope.querySelectorAll('.chapter-content').forEach(c => c.classList.remove('active'));
        scope.querySelectorAll('.chapter-btn').forEach(b => {
            const onclk = b.getAttribute('onclick') || '';
            b.classList.toggle('active',
                onclk === `switchChapter(${num},'${branchId}')` ||
                onclk === `switchChapter(${num})`
            );
        });
        const chEl = scope.querySelector('#chapter-' + num);
        if (chEl) chEl.classList.add('active');
    };

    // ── switchExtraChapter (standalone tabs) ─────────────────
    window.switchExtraChapter = function (num) {
        const section = document.querySelector('.extra-chapters-section');
        if (!section) return;
        // إخفاء كل chapter-content جوا الـ extra section
        section.querySelectorAll('.chapter-content').forEach(el => el.classList.remove('active'));
        // تحديث الـ buttons
        section.querySelectorAll('.chapter-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('onclick') === `switchExtraChapter(${num})`);
        });
        // إظهار الفصل المطلوب
        const target = section.querySelector('#chapter-' + num);
        if (target) target.classList.add('active');
    };

    // ── loadVideoContent ──────────────────────────────────────
    async function loadVideoContent(code, username, student) {

        // 1. Fetch all chapters for this CODE from Firebase
        let chapData = {};
        try {
            const snap = await get(ref(db, 'videos/' + code));
            if (snap.exists()) chapData = snap.val();
        } catch (e) { console.warn('videos fetch:', e); }

        // 1b. Fetch custom/extra chapter names from Firebase
        let customNames = {};
        try {
            const cnSnap = await get(ref(db, 'chapterNames/' + code));
            if (cnSnap.exists()) customNames = cnSnap.val() || {};
        } catch (e) { /* non-blocking */ }

        const defaultNames = CHAPTER_NAMES[code] || { 1: 'Videos' };
        const defaultIdxs  = Object.keys(defaultNames).map(Number);

        // الفصول الإضافية = أرقام في Firebase مش موجودة في الافتراضي
        const extraIdxs = Object.keys(customNames)
            .map(Number)
            .filter(idx => !defaultIdxs.includes(idx))
            .sort((a, b) => a - b);

        // chapterNames النهائي
        const chapterNames = {};
        defaultIdxs.forEach(idx => {
            chapterNames[idx] = (customNames[idx] && customNames[idx].trim())
                ? customNames[idx] : defaultNames[idx];
        });
        extraIdxs.forEach(idx => { chapterNames[idx] = customNames[idx]; });

        // 2. Welcome banner
        let html = '';
        if (student) {
            html += `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>يا 100 أهلاً يا ${student.name}</h3>
                <p>${student.welcomeMessage || '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير'}</p>
            </div>
            <div class="profile-img-container">
                <img src="${student.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + username}"
                     alt="صورة البروفايل"
                     onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${username}'">
                <div class="show-details">اظهار التفاصيل</div>
                <div class="profile-info" id="profileInfo">
                    <p><strong>الاسم:</strong> ${student.name}</p>
                    <p><strong>رقم التليفون:</strong> ${student.phone || '-'}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${student.email || '-'}</p>
                    <p><strong>لغة الدراسة:</strong> ${student.language || '-'}</p>
                </div>
            </div>
        </div>`;
        }

        // 3. Build content
        const branches = BRANCH_CHAPTERS[code];

        if (branches) {
            // ── الفصول الافتراضية: branch selection ──
            html += `
            <div class="branch-selection">
                <h3>Select a physics branch --- اختر فرع الفيزياء :</h3>
                <select class="branch-selector" id="branchSelector">
                    <option value="">اختر الفرع → Select a branch</option>
                    <option value="electric">الفيزياء الكهربية → Electricity Physics</option>
                    <option value="modern">الفيزياء الحديثة → Modern Physics</option>
                </select>
            </div>`;

            // Electric branch
            html += '<div id="electric-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.electric.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i === 0 ? 'active' : ''}" onclick="switchChapter(${chNum},'electric')">${chapterNames[chNum] || 'Ch ' + chNum}</button>`;
            });
            html += '</div>';
            branches.electric.forEach(chNum => {
                const vids = chapData['ch' + chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum] || 'Ch ' + chNum, vids, code, username);
            });
            html += '</div>';

            // Modern branch
            html += '<div id="modern-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.modern.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i === 0 ? 'active' : ''}" onclick="switchChapter(${chNum},'modern')">${chapterNames[chNum] || 'Ch ' + chNum}</button>`;
            });
            html += '</div>';
            branches.modern.forEach(chNum => {
                const vids = chapData['ch' + chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum] || 'Ch ' + chNum, vids, code, username);
            });
            html += '</div>';

            // ── الفصول الإضافية: مخفية في الأول، تظهر لما يضغط ──
            if (extraIdxs.length > 0) {
                html += '<div class="extra-chapters-section">';
                html += '<div class="chapters-nav">';
                extraIdxs.forEach((chNum, i) => {
                    html += `<button class="chapter-btn" onclick="switchExtraChapter(${chNum})">${chapterNames[chNum]}</button>`;
                });
                html += '</div>';
                extraIdxs.forEach((chNum) => {
                    const vids = chapData['ch' + chNum] || {};
                    html += buildChapter(chNum, chapterNames[chNum], vids, code, username, false);
                });
                html += '</div>';
            }

        } else {
            // All other CODEs — single or multiple chapters without branches
            const chNums = Object.keys(chapterNames).map(Number).sort((a, b) => a - b);

            if (chNums.length > 1) {
                html += '<div class="chapters-nav">';
                chNums.forEach((chNum, i) => {
                    html += `<button class="chapter-btn ${i === 0 ? 'active' : ''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]}</button>`;
                });
                html += '</div>';
            }

            chNums.forEach(chNum => {
                const vids = chapData['ch' + chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum] || 'Videos', vids, code, username);
            });
        }

        // 4. Logout
        html += `
        <div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        // ── تعبئة اسم الطالب في كل option بعد البناء ─────────
        if (student) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(opt => {
                opt.dataset.studentName = student.name || '';
            });
        }

        // 5. Branch selector events
        document.getElementById('branchSelector')?.addEventListener('change', function () {
            document.querySelectorAll('.branch-content').forEach(b => b.style.display = 'none');
            if (this.value) {
                const t = document.getElementById(this.value + '-physics');
                if (t) t.style.display = 'block';
            }
        });

        // 6. Profile toggle
        document.querySelector('.profile-img-container')?.addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById('profileInfo')?.classList.toggle('active');
        });
        document.addEventListener('click', () => document.getElementById('profileInfo')?.classList.remove('active'));
    }

    // ── Init ──────────────────────────────────────────────────
    checkLoginState();
});
