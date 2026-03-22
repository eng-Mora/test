// ── Safe localStorage — يشتغل حتى في Private Browsing و WebView ──
var safeStorage = (function () {
    var _s = {};
    try {
        window.safeStorage.setItem('__t__', '1');
        window.safeStorage.removeItem('__t__');
        return {
            getItem:    function (k)    { return window.safeStorage.getItem(k); },
            setItem:    function (k, v) { window.safeStorage.setItem(k, v); },
            removeItem: function (k)    { window.safeStorage.removeItem(k); }
        };
    } catch (e) {
        return {
            getItem:    function (k)    { return _s[k] !== undefined ? _s[k] : null; },
            setItem:    function (k, v) { _s[k] = String(v); },
            removeItem: function (k)    { delete _s[k]; }
        };
    }
})();

// ── Firebase Compat (محمّل من CDN في index.html) ──────────────
var app = firebase.initializeApp({
    apiKey: "AIzaSyBXsX0v_7p8CHDFiTUm4XkQsoZIqGueAOk",
    authDomain: "the-process-5d196.firebaseapp.com",
    databaseURL: "https://the-process-5d196-default-rtdb.firebaseio.com",
    projectId: "the-process-5d196",
    storageBucket: "the-process-5d196.firebasestorage.app",
    messagingSenderId: "96415822332",
    appId: "1:96415822332:web:2be476bee2e474383d8279"
});
var db = firebase.database();

// ── Wrappers بنفس أسماء الـ functions القديمة ────────────────
function ref(path)              { return db.ref(path); }
function get(r)                 { return r.once('value'); }
function push(r, val)           { return r.push(val); }
function set(r, val)            { return r.set(val); }
function onValue(r, cb)         { r.on('value', cb); }
function off(r)                 { if (r) r.off(); }


// ── تحويل Google Drive روابط للـ preview (يشتغل على iPhone) ──
function toEmbedUrl(url) {
    if (!url) return url;
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    return url;
}

// Chapter names per CODE
const CHAPTER_NAMES = {
    CODE1:  {1:'الفصل الأول',2:'الفصل الثاني',3:'الفصل الثالث',4:'الفصل الرابع',5:'الفصل الخامس',6:'الفصل السادس',7:'الفصل السابع',8:'الفصل الثامن'},
    CODE2:  {1:'Chapter 1', 2:'Chapter 2',   3:'Chapter 3',   4:'Chapter 4',   5:'Chapter 5',   6:'Chapter 6',   7:'Chapter 7',   8:'Chapter 8'},
    CODE3:  {1:'مراجعة الفصل الأول'},
    CODE4:  {1:'Chapter 1 Revision'},
    CODE5:  {1:'Homework'},
    CODE6:  {1:'مراجعة الفصل الثاني'},
    CODE7:  {1:'Chapter 2'},
    CODE8:  {1:'الفصل الثالث'},
    CODE9:  {1:'Chapter 3'},
    CODE10: {1:'Final Revision'},
    CODE11: {1:'مراجعة نصف السنة'},
    CODE12: {1:'Mid-Year Review'},
    CODE13: {1:'Homework'},
};

// Branch titles for CODE1/CODE2 chapter groups
const BRANCH_CHAPTERS = {
    CODE1: { electric:[1,2,3,4], modern:[5,6,7,8] },
    CODE2: { electric:[1,2,3,4], modern:[5,6,7,8] },
};

document.addEventListener('DOMContentLoaded', async function () {

    const loginContainer = document.getElementById('loginContainer');
    const mainContent    = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const sidebar        = document.getElementById('sidebar');
    const sidebarToggle  = document.getElementById('sidebarToggle');

    // ── Sidebar ───────────────────────────────────────────────
    sidebarToggle?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.getElementById('sidebarLoginToggle')?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.addEventListener('click', e => { if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('active'); });
    sidebar.addEventListener('click', e => e.stopPropagation());

    document.getElementById('homeLink')?.addEventListener('click', e => {
        e.preventDefault();
        safeStorage.removeItem('isLoggedIn');
        safeStorage.removeItem('username');
        window.location.reload();
    });


    // ── Auth helpers ──────────────────────────────────────────
    const showLogin = () => { loginContainer.style.display = 'flex';  mainContent.style.display = 'none'; };
    const showMain  = () => { loginContainer.style.display = 'none';  mainContent.style.display = 'block'; };

    window.logout = function () {
        safeStorage.removeItem('isLoggedIn');
        safeStorage.removeItem('username');
        safeStorage.removeItem('loginType');
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
                safeStorage.removeItem('isLoggedIn');
                safeStorage.removeItem('username');
                safeStorage.removeItem('loginType');
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
        } catch(e) {
            console.warn('getReviewByCode error (non-blocking):', e);
            return null;
        }
    }

    // ── Check login on load ───────────────────────────────────
    async function checkLoginState() {
        // ── Auto-login من URL parameter (?username=XXXX) ──────
        const urlParams  = new URLSearchParams(window.location.search);
        const urlUser    = urlParams.get('username');
        if (urlUser) {
            // امسح الـ param من الرابط بدون reload
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            // جرب student أولاً
            const studentFromUrl = await getStudent(urlUser);
            if (studentFromUrl && studentFromUrl.videoCode && !studentFromUrl.banned) {
                const now = Date.now();
                set(ref(db, `students/${urlUser}/lastSeen`), now);
                push(ref(db, `loginLogs/${urlUser}`), { at: now, name: studentFromUrl.name });
                safeStorage.setItem('isLoggedIn', 'true');
                safeStorage.setItem('username', urlUser);
                safeStorage.setItem('loginType', 'student');
                await loadVideoContent(studentFromUrl.videoCode, urlUser, studentFromUrl);
                showMain();
                startBanWatcher(urlUser);
                return;
            }
            // جرب review code
            let rvUrl = null;
            try { rvUrl = await getReviewByCode(urlUser); } catch(e) { rvUrl = null; }
            if (rvUrl) {
                safeStorage.setItem('isLoggedIn', 'true');
                safeStorage.setItem('username', urlUser);
                safeStorage.setItem('loginType', 'review');
                await loadReviewContent(rvUrl);
                showMain();
                return;
            }
            // الكود مش موجود — وريه رسالة خطأ في اللوجين
            showLogin();
            document.getElementById('errorMessage').style.color = '#dc3545';
            document.getElementById('errorMessage').textContent  = '❌ الكود مش موجود، تواصل مع المشرف.';
            return;
        }
        // ─────────────────────────────────────────────────────
        const loggedIn  = safeStorage.getItem('isLoggedIn');
        const username  = safeStorage.getItem('username');
        const loginType = safeStorage.getItem('loginType'); // 'student' or 'review'
        if (loggedIn === 'true' && username) {
            if (loginType === 'review') {
                let rv = null;
                try { rv = await getReviewByCode(username); } catch(e) { rv = null; }
                if (rv) { await loadReviewContent(rv); showMain(); return; }
            }
            const student = await getStudent(username);
            if (student && student.videoCode) {
                if (student.banned) {
                    safeStorage.removeItem('isLoggedIn');
                    safeStorage.removeItem('username');
                    safeStorage.removeItem('loginType');
                    showLogin();
                    document.getElementById('errorMessage').style.color = '#dc3545';
                    document.getElementById('errorMessage').textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
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
        const errEl    = document.getElementById('errorMessage');
        errEl.style.color   = '#888';
        errEl.textContent   = '⏳ جاري التحقق...';

        // 1. Check review codes first (non-blocking — if fails, continue to student check)
        let rv = null;
        try { rv = await getReviewByCode(username); } catch(e) { rv = null; }
        if (rv) {
            errEl.textContent = '';
            safeStorage.setItem('isLoggedIn', 'true');
            safeStorage.setItem('username', username);
            safeStorage.setItem('loginType', 'review');
            await loadReviewContent(rv);
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
            errEl.textContent = '';
            safeStorage.setItem('isLoggedIn', 'true');
            safeStorage.setItem('username', username);
            safeStorage.setItem('loginType', 'student');
            // ── سجّل الدخول ──────────────────────────────────────
            const now = Date.now();
            set(ref(db, `students/${username}/lastSeen`), now);
            push(ref(db, `loginLogs/${username}`), { at: now, name: student.name });
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
    async function loadReviewContent(rv) {
        const sorted = Object.values(rv.videos).sort((a,b) => (a.order||0)-(b.order||0));

        let html = `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>🎯 فيديوهات المراجعة</h3>
                <p>${rv.desc || rv.code}</p>
            </div>
        </div>`;

        const rvCode = rv.code || rv.rcId || 'REVIEW';
        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
        html += '<option value="">اختر الفيديو...</option>';
        sorted.forEach((v,i) => {
            html += `<option value="rv_${i}" data-video-code="${rvCode}" data-chapter-num="0" data-chapter-name="مراجعة" data-video-title="${v.title}" data-student-name="">${v.title}</option>`;
        });
        html += '</select></div>';

        sorted.forEach((v,i) => {
            const urls = [];
            for (let j=1; j<=9; j++) { if(v['url'+j]) urls.push(toEmbedUrl(v['url'+j])); else break; }
            html += `<div class="video" id="rv_${i}" style="display:none;">`;
            html += `<h3 class="video-title">${v.title}</h3>`;
            if (urls.length > 1) {
                urls.forEach((url,j) => {
                    html += `<h3 class="video-title">الجزء ${j===0?'الأول':j===1?'الثاني':j+1}</h3>`;
                    html += `<iframe src="${url}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
                });
            } else {
                html += `<iframe src="${urls[0]||''}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
            }
            html += '</div>';
        });

        html += `<div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        // ── تعبئة اسم الطالب (كود المراجعة) في options بعد البناء ──
        const loggedUser = safeStorage.getItem('username');
        if (loggedUser) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(opt => {
                opt.dataset.studentName = loggedUser;
            });
        }
    }

    // ── Build video card HTML ─────────────────────────────────
    function buildVideoCard(v, idPrefix) {
        const urls = [];
        for (let i = 1; i <= 9; i++) {
            if (v['url' + i]) urls.push(toEmbedUrl(v['url' + i]));
            else break;
        }
        if (!urls.length) return '';

        const labels = urls.length > 1
            ? ['الجزء الأول','الجزء الثاني','الجزء الثالث','الجزء الرابع','الجزء الخامس']
            : [v.title];

        let html = `<div class="video" id="${idPrefix}" style="display:none;">`;
        html += `<h3 class="video-title">${v.title}</h3>`;
        urls.forEach((url, i) => {
            if (urls.length > 1) html += `<h3 class="video-title">${labels[i] || 'جزء '+(i+1)}</h3>`;
            html += `<iframe src="${url}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
        });
        html += '</div>';
        return html;
    }

    // ── Build chapter HTML ────────────────────────────────────
    function buildChapter(chNum, chName, videos, code) {
        const sorted = Object.entries(videos).sort((a,b) => (a[1].order||0)-(b[1].order||0));
        if (!sorted.length) return '';

        const isActive = chNum === 1 ? 'active' : '';
        let html = `<div id="chapter-${chNum}" class="chapter-content ${isActive}">`;
        html += `<h2 class="chapter-title">${chName}</h2>`;
        // build options with data-title for meta passing
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
    window._showVideo = function(id, dataset) {
        if (!id) return;
        // ── سجّل المشاهدة ─────────────────────────────────────
        const loggedUser = safeStorage.getItem('username');
        if (loggedUser && dataset && dataset.videoCode) {
            const now = Date.now();
            const meta = {
                studentCode : loggedUser,
                studentName : dataset.studentName || '',
                videoCode   : dataset.videoCode   || '',
                chapterNum  : dataset.chapterNum  || '',
                chapterName : dataset.chapterName || '',
                videoTitle  : dataset.videoTitle  || '',
                at          : now
            };
            push(ref(db, `watchLogs`), meta);
            // تحديث عداد المشاهدات على الفيديو
            const vidKey = `videoStats/${meta.videoCode}_ch${meta.chapterNum}_${id}`;
            get(ref(db, vidKey)).then(snap => {
                const prev = snap.exists() ? (snap.val() || {}) : {};
                set(ref(db, vidKey), {
                    title      : meta.videoTitle,
                    code       : meta.videoCode,
                    chapter    : meta.chapterNum,
                    chapterName: meta.chapterName,
                    views      : (prev.views || 0) + 1,
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
            t.style.display = 'block';
            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    window.switchChapter = function(num) {
        // find active branch or videoContainer
        const scope = document.querySelector('.branch-content[style*="display: block"]')
                   || document.querySelector('.branch-content[style*="display:block"]')
                   || videoContainer;
        scope.querySelectorAll('.chapter-content').forEach(c => c.classList.remove('active'));
        scope.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
        const chEl = scope.querySelector('#chapter-' + num);
        if (chEl) chEl.classList.add('active');
        const btns = scope.querySelectorAll('.chapter-btn');
        // find btn by index matching num
        btns.forEach(b => { if (b.getAttribute('onclick') === `switchChapter(${num})`) b.classList.add('active'); });
    };

    // ── loadVideoContent ──────────────────────────────────────
    async function loadVideoContent(code, username, student) {

        // 1. Fetch all chapters for this CODE from Firebase
        let chapData = {};
        try {
            const snap = await get(ref(db, 'videos/' + code));
            if (snap.exists()) chapData = snap.val();
        } catch(e) { console.warn('videos fetch:', e); }

        const chapterNames = CHAPTER_NAMES[code] || {1: 'Videos'};

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
            // CODE1 / CODE2 — two branches with chapters nav each
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
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.electric.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

            // Modern branch
            html += '<div id="modern-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.modern.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.modern.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

        } else {
            // All other CODEs — single chapter or multiple without branches
            const chNums = Object.keys(chapterNames).map(Number).sort((a,b)=>a-b);

            if (chNums.length > 1) {
                html += '<div class="chapters-nav">';
                chNums.forEach((chNum, i) => {
                    html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]}</button>`;
                });
                html += '</div>';
            }

            chNums.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Videos', vids, code);
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
