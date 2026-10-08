import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'موقعي البسيط',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.teal,
        brightness: Brightness.light,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _scroll = ScrollController();
  final _homeKey = GlobalKey();
  final _featuresKey = GlobalKey();
  final _contactKey = GlobalKey();

  void _goTo(GlobalKey key) {
    final ctx = key.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
        ctx,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.of(context).size.width > 700;

    return Scaffold(
      appBar: AppBar(
        title: const Text('موقعي',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: wide
            ? [
                TextButton(
                    onPressed: () => _goTo(_homeKey),
                    child: const Text('الرئيسية')),
                TextButton(
                    onPressed: () => _goTo(_featuresKey),
                    child: const Text('المميزات')),
                TextButton(
                    onPressed: () => _goTo(_contactKey),
                    child: const Text('تواصل معنا')),
                const SizedBox(width: 16),
              ]
            : null,
      ),
      drawer: wide
          ? null
          : Drawer(
              child: ListView(
                children: [
                  const DrawerHeader(
                    child: Center(
                      child: Text('موقعي',
                          style: TextStyle(
                              fontSize: 28, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  ListTile(
                    title: const Text('الرئيسية'),
                    onTap: () {
                      Navigator.pop(context);
                      _goTo(_homeKey);
                    },
                  ),
                  ListTile(
                    title: const Text('المميزات'),
                    onTap: () {
                      Navigator.pop(context);
                      _goTo(_featuresKey);
                    },
                  ),
                  ListTile(
                    title: const Text('تواصل معنا'),
                    onTap: () {
                      Navigator.pop(context);
                      _goTo(_contactKey);
                    },
                  ),
                ],
              ),
            ),
      body: SingleChildScrollView(
        controller: _scroll,
        child: Column(
          children: [
            _Hero(key: _homeKey, onStart: () => _goTo(_featuresKey)),
            _Features(key: _featuresKey),
            _Contact(key: _contactKey),
            const _Footer(),
          ],
        ),
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero({super.key, required this.onStart});
  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 96, horizontal: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [cs.primaryContainer, cs.surface],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        children: [
          Icon(Icons.flutter_dash, size: 96, color: cs.primary),
          const SizedBox(height: 24),
          Text(
            'أهلاً بك في موقعي',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .displaySmall
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          const ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 520),
            child: Text(
              'موقع بسيط وسريع مبني بإطار عمل Flutter، يعمل على المتصفح والموبايل بنفس الكود.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, height: 1.6),
            ),
          ),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: onStart,
            icon: const Icon(Icons.arrow_downward),
            label: const Text('ابدأ الآن'),
          ),
        ],
      ),
    );
  }
}

class _Features extends StatelessWidget {
  const _Features({super.key});

  @override
  Widget build(BuildContext context) {
    const items = [
      (Icons.bolt, 'سريع', 'أداء ممتاز وتحميل سريع للصفحات.'),
      (Icons.devices, 'متجاوب', 'يظهر بشكل جميل على كل الشاشات.'),
      (Icons.code, 'كود واحد', 'اكتب مرة واحدة وشغّل في أي مكان.'),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 64, horizontal: 24),
      child: Column(
        children: [
          Text('المميزات',
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 32),
          Wrap(
            spacing: 24,
            runSpacing: 24,
            alignment: WrapAlignment.center,
            children: [
              for (final it in items)
                SizedBox(
                  width: 280,
                  child: Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                          color: Theme.of(context).colorScheme.outlineVariant),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          Icon(it.$1,
                              size: 48,
                              color: Theme.of(context).colorScheme.primary),
                          const SizedBox(height: 16),
                          Text(it.$2,
                              style: const TextStyle(
                                  fontSize: 20, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Text(it.$3,
                              textAlign: TextAlign.center,
                              style: const TextStyle(height: 1.5)),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _Contact extends StatefulWidget {
  const _Contact({super.key});

  @override
  State<_Contact> createState() => _ContactState();
}

class _ContactState extends State<_Contact> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _msg = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _msg.dispose();
    super.dispose();
  }

  void _submit() {
    if (_form.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم إرسال رسالتك، شكراً لك!')),
      );
      _form.currentState!.reset();
      _name.clear();
      _email.clear();
      _msg.clear();
    }
  }

  String? _required(String? v) =>
      (v == null || v.trim().isEmpty) ? 'هذا الحقل مطلوب' : null;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Theme.of(context).colorScheme.surfaceContainerLow,
      padding: const EdgeInsets.symmetric(vertical: 64, horizontal: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Form(
            key: _form,
            child: Column(
              children: [
                Text('تواصل معنا',
                    style: Theme.of(context)
                        .textTheme
                        .headlineMedium
                        ?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _name,
                  validator: _required,
                  decoration: const InputDecoration(
                      labelText: 'الاسم', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'هذا الحقل مطلوب';
                    if (!v.contains('@')) return 'بريد إلكتروني غير صحيح';
                    return null;
                  },
                  decoration: const InputDecoration(
                      labelText: 'البريد الإلكتروني',
                      border: OutlineInputBorder()),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _msg,
                  maxLines: 4,
                  validator: _required,
                  decoration: const InputDecoration(
                      labelText: 'رسالتك', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                      onPressed: _submit, child: const Text('إرسال')),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  const _Footer();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Text(
        '© ${DateTime.now().year} موقعي. جميع الحقوق محفوظة.',
        style: TextStyle(color: Theme.of(context).colorScheme.outline),
      ),
    );
  }
}
