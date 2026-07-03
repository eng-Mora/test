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

// ── Device ID — معرف عشوائي فريد لكل جهاز/متصفح ──────────
// بيتولّد مرة واحدة بس (crypto.randomUUID) وبيتخزن في مكانين مختلفين
// (localStorage + cookie) عشان لو iOS Safari مسح واحد يفضل التاني موجود.
// ملحوظة: متعمدين معملناش الـ ID من خصائص الجهاز (fingerprint) لأن
// أجهزة من نفس الموديل/الإصدار بتطلع بنفس الـ fingerprint بالظبط،
// وده كان بيخلي أكتر من جهاز حقيقي يتقبلوا كـ "نفس الجهاز".

function readCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value) {
    // سنة كاملة، عبر كل المسارات
    try {
        document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    } catch (e) { /* non-blocking */ }
}

function generateDeviceId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return 'dev-' + window.crypto.randomUUID();
    }
    // fallback لو randomUUID مش متاح (متصفح قديم جدًا)
    return 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

function getOrCreateDeviceId() {
    // 1. جرب localStorage الأول
    let fromLocal = null;
    try { fromLocal = localStorage.getItem('deviceId'); } catch (e) { /* non-blocking */ }

    // 2. جرب الـ cookie
    const fromCookie = readCookie('deviceId');

    // لو الاتنين موجودين ومتطابقين، أو واحد منهم موجود — استخدمه واتأكد إنه متخزن في المكانين
    const id = fromLocal || fromCookie;
    if (id) {
        try { localStorage.setItem('deviceId', id); } catch (e) { /* non-blocking */ }
        writeCookie('deviceId', id);
        return id;
    }

    // 3. مفيش أي نسخة متخزنة — جهاز جديد فعليًا، نولّد ID عشوائي فريد
    const newId = generateDeviceId();
    try { localStorage.setItem('deviceId', newId); } catch (e) { /* non-blocking */ }
    writeCookie('deviceId', newId);
    return newId;
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

    // ── Theme Toggle ─────────────────────────────────────────
    (function () {
        const btn = document.getElementById('themeToggle');
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.body.classList.add('light-mode');
            if (btn) btn.textContent = '🌙';
        }
        if (btn) {
            btn.addEventListener('click', function () {
                const isLight = document.body.classList.toggle('light-mode');
                btn.textContent = isLight ? '🌙' : '☀️';
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }
    })();

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

        // ── جهاز مختلف فعليًا — نسجل المحاولة المرفوضة في blockedAttempts ──
        // (شلنا هنا الـ IP-bypass القديم لأن الـ IP بيتشارك بين مستخدمين كتير
        // على نفس شبكة الموبايل/الواي فاي في مصر، وده كان بيسمح لأي حد
        // على نفس الشبكة إنه يسجل نفسه كـ"الجهاز الرسمي" الجديد)
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
    // بتستخدم index مخزون في localStorage لو موجود عشان تتجنب تحميل reviews كلها
    async function getReviewByCode(code) {
        try {
            // حاول من الـ index الـ cached أولاً
            const cachedRcId = localStorage.getItem('rv_idx_' + code);
            if (cachedRcId) {
                const snap = await get(ref(db, 'reviews/' + cachedRcId));
                if (snap.exists()) {
                    const rc = snap.val();
                    const accessCodes = rc.accessCodes ? Object.values(rc.accessCodes).map(String) : [];
                    if (accessCodes.includes(String(code))) {
                        return { rcId: cachedRcId, code: rc.code || cachedRcId, desc: rc.desc || '', videos: rc.videos || {} };
                    }
                }
                // الـ cache بقى قديم — امسحه وكمّل للفحص الكامل
                localStorage.removeItem('rv_idx_' + code);
            }
            // فحص كامل — بس لو مفيش cache
            const snap = await get(ref(db, 'reviews'));
            if (!snap || !snap.exists()) return null;
            const reviews = snap.val();
            if (!reviews || typeof reviews !== 'object') return null;
            for (const [rcId, rc] of Object.entries(reviews)) {
                if (!rc || !rc.accessCodes) continue;
                const accessCodes = Object.values(rc.accessCodes);
                if (accessCodes.map(String).includes(String(code))) {
                    // خزّن الـ index عشان المرة الجاية تبقى أسرع
                    localStorage.setItem('rv_idx_' + code, rcId);
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

        // ── Tasks في السايدبار فقط — مش في الصفحة ─────────────
        // الـ toast بس هنحطه في الـ body مرة واحدة لو مش موجود
        if (!document.getElementById('tasksDoneToast')) {
            const toastEl = document.createElement('div');
            toastEl.className = 'tasks-done-toast';
            toastEl.id = 'tasksDoneToast';
            toastEl.innerHTML = `<div class="tasks-done-toast-icon">🎯</div>
                <div class="tasks-done-toast-body">
                    <div class="tasks-done-toast-title">أنجزت مهام اليوم! 🔥</div>
                    <div class="tasks-done-toast-msg">تسلم كدا، انت ماشي على الخطة مظبوط ❤️</div>
                </div>`;
            document.body.appendChild(toastEl);
        }

        videoContainer.innerHTML = html;

        // ── بناء المهام في السايدبار ──────────────────────────
        if (tasks.length > 0) {
            const isDayBased = tasks.length > 0 && tasks[0] && typeof tasks[0] === 'object' && 'tasks' in tasks[0];
            window.rcIdRef = rv.rcId;   // للاستخدام في _sbToggle
            buildSidebarTasks(tasks, myProgress, isDayBased);
        } else {
            const sbPanel = document.getElementById('sidebarTasksPanel');
            if (sbPanel) sbPanel.style.display = 'none';
        }

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

        // tasks في السايدبار فقط — _switchDay و _toggleTask اتشالوا

        // ── Sidebar Tasks Sync ───────────────────────────────
        // بيبني المهام في السايدبار ويزامنها مع checkboxes الصفحة
        function buildSidebarTasks(tasks, myProgress, isDayBased) {
            const panel  = document.getElementById('sidebarTasksPanel');
            const body   = document.getElementById('sidebarTasksBody');
            const badge  = document.getElementById('sidebarTasksBadge');
            if (!panel || !body) return;

            if (!tasks || !tasks.length) {
                panel.style.display = 'none';
                return;
            }
            panel.style.display = '';

            // حساب الـ progress الكلي من الـ sb-task-items مباشرة
            function updateSidebarBadge() {
                const allItems  = document.querySelectorAll('.sb-task-item');
                const total     = allItems.length;
                const doneCount = Array.from(allItems).filter(el => el.classList.contains('done')).length;
                if (badge) {
                    badge.textContent = `${doneCount}/${total}`;
                    badge.classList.toggle('all-done', total > 0 && doneCount === total);
                }
            }

            let html = '';

            if (isDayBased) {
                // Day tabs
                html += '<div class="sb-day-tabs">';
                tasks.forEach((day, di) => {
                    const dayT = day.tasks || [];
                    const dp   = (myProgress.tasks || {})['d'+di] || {};
                    const done = dayT.filter((_, ti) => dp[ti] === true).length;
                    html += `<button class="sb-day-tab${di===0?' active':''}" onclick="window._sbSwitchDay(${di})" id="sbDayTab_${di}">
                        <span>${day.label || ('اليوم '+(di+1))}</span>
                        <span class="sb-day-tab-badge${done===dayT.length&&dayT.length>0?' done':''}" id="sbDayBadge_${di}">${done}/${dayT.length}</span>
                    </button>`;
                });
                html += '</div>';

                // Day panels
                tasks.forEach((day, di) => {
                    const dayT = day.tasks || [];
                    const dp   = (myProgress.tasks || {})['d'+di] || {};
                    html += `<div class="sb-day-panel${di===0?' active':''}" id="sbDayPanel_${di}" data-success-msg="${(day.successMessage||'').replace(/"/g,'&quot;')}">`;
                    if (!dayT.length) {
                        html += '<p class="sb-no-tasks">لا توجد مهام</p>';
                    }
                    dayT.forEach((task, ti) => {
                        const done = dp[ti] === true;
                        const ref  = `d${di}_${ti}`;
                        html += `<div class="sb-task-item${done?' done':''}" data-task-ref="${ref}" onclick="window._sbToggle(${di},${ti},this)">
                            <div class="sb-task-icon">${done?'✓':''}</div>
                            <span class="sb-task-text">${task.text||task}</span>
                        </div>`;
                    });
                    html += '</div>';
                });
            } else {
                // Flat
                const dp = myProgress.tasks || {};
                tasks.forEach((task, i) => {
                    const done = dp[i] === true;
                    html += `<div class="sb-task-item${done?' done':''}" data-task-ref="flat_${i}" onclick="window._sbToggle(-1,${i},this)">
                        <div class="sb-task-icon">${done?'✓':''}</div>
                        <span class="sb-task-text">${task.text||task}</span>
                    </div>`;
                });
            }

            body.innerHTML = html;
            updateSidebarBadge();

            // ربط الـ sb items بالـ checkboxes الأصلية عشان يتزامنوا
            window._sbSwitchDay = function(di) {
                document.querySelectorAll('.sb-day-tab').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.sb-day-panel').forEach(p => p.classList.remove('active'));
                const t = document.getElementById('sbDayTab_'+di);
                const p = document.getElementById('sbDayPanel_'+di);
                if (t) t.classList.add('active');
                if (p) p.classList.add('active');
            };

            window._sbToggle = function(di, ti, el) {
                const wasDone = el.classList.contains('done');
                const nowDone = !wasDone;

                // تحديث الـ UI فوراً
                el.classList.toggle('done', nowDone);
                const icon = el.querySelector('.sb-task-icon');
                if (icon) icon.textContent = nowDone ? '✓' : '';

                // حفظ في Firebase مباشرة
                const loggedUser = localStorage.getItem('username');
                if (loggedUser && rcIdRef) {
                    if (di >= 0) {
                        set(ref(db, `studentProgress/${loggedUser}/${rcIdRef}/tasks/d${di}/${ti}`), nowDone);
                    } else {
                        set(ref(db, `studentProgress/${loggedUser}/${rcIdRef}/tasks/${ti}`), nowDone);
                    }
                }

                // تحديث badge اليوم في السايدبار
                if (di >= 0) {
                    const dayItems = document.querySelectorAll(`#sbDayPanel_${di} .sb-task-item`);
                    const dayDone  = Array.from(dayItems).filter(b => b.classList.contains('done')).length;
                    const sbBadge  = document.getElementById('sbDayBadge_'+di);
                    if (sbBadge) {
                        sbBadge.textContent = `${dayDone}/${dayItems.length}`;
                        sbBadge.classList.toggle('done', dayDone===dayItems.length && dayItems.length>0);
                    }

                    // Toast لما يخلص مهام اليوم
                    if (nowDone && dayDone === dayItems.length && dayItems.length > 0) {
                        const dayPanel  = document.getElementById('sbDayPanel_'+di);
                        const dayMsg    = dayPanel ? dayPanel.dataset.successMsg : '';
                        const toast     = document.getElementById('tasksDoneToast');
                        if (toast) {
                            const msgEl   = toast.querySelector('.tasks-done-toast-msg');
                            const titleEl = toast.querySelector('.tasks-done-toast-title');
                            if (msgEl)   msgEl.textContent   = dayMsg || 'تسلم كدا، انت ماشي على الخطة مظبوط ❤️';
                            if (titleEl) titleEl.textContent = 'أنجزت مهام اليوم! 🔥';
                            toast.classList.add('show');
                            setTimeout(() => toast.classList.remove('show'), 4500);
                        }
                    }
                }
                updateSidebarBadge();
            };


        }

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
