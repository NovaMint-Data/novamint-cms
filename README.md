# NovaMint CMS — متجر منتجات رقمية مع لوحة تحكم كاملة

موقع متجر منتجات رقمية احترافي مبني بـ **Next.js 14 + Supabase**، مع لوحة تحكم كاملة تتيح لك إدارة كل شيء (منتجات، مدونة، صفحات، تصنيفات، قائمة التنقل، الصفحة الرئيسية، SEO) **بدون فتح VS Code أو لمس أي كود** بعد التثبيت الأولي.

---

## 1. البنية التقنية المستخدمة

| الطبقة | التقنية | السبب |
|---|---|---|
| Frontend + Backend | **Next.js 14 (App Router)** | SSR/SSG لسرعة تحميل عالية و SEO ممتاز، API Routes مدمجة |
| قاعدة البيانات + التخزين | **Supabase** (Postgres + Storage) | مجاني للبداية، يدعم رفع الصور، سهل الإدارة |
| التصميم | **Tailwind CSS** | تصميم هادئ/Minimaliste سريع التطوير |
| لوحة التحكم | صفحات `/admin/*` محمية بكلمة مرور | لا حاجة لـ CMS خارجي (Strapi, Sanity...) |
| السحب والإفراج (Page Builder) | **@dnd-kit** | إنشاء أقسام الصفحات بدون كود |
| الاستضافة | **Vercel** (مجاني) | نشر مباشر من GitHub |

---

## 2. ما يحتويه المشروع

```
novamint-cms/
├── app/
│   ├── admin/              ← لوحة التحكم الكاملة
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── products/       ← CRUD المنتجات
│   │   ├── categories/     ← CRUD التصنيفات
│   │   ├── blog/           ← CRUD المقالات
│   │   ├── pages/          ← Page Builder (Drag & Drop)
│   │   ├── navigation/     ← القائمة الرئيسية
│   │   ├── homepage/       ← إدارة الصفحة الرئيسية
│   │   └── settings/       ← الإعدادات العامة / SEO / Social
│   ├── api/                ← كل الـ API Routes (CRUD + Upload)
│   ├── products/[slug]/    ← صفحة هبوط تلقائية لكل منتج
│   ├── blog/[slug]/        ← صفحة كل مقال
│   ├── pages/[slug]/       ← الصفحات المخصصة (من Page Builder)
│   ├── sitemap.xml/        ← Sitemap تلقائي
│   ├── robots.txt/         ← Robots تلقائي
│   └── page.tsx            ← الصفحة الرئيسية
├── components/
│   ├── admin/               ← مكونات لوحة التحكم
│   └── store/                ← مكونات المتجر (Header, Footer...)
├── lib/                    ← Supabase client, auth, utils
├── supabase/migrations/    ← ملف SQL لإنشاء قاعدة البيانات
└── middleware.ts           ← حماية مسارات /admin
```

---

## 3. خطوات التشغيل (خطوة بخطوة)

### الخطوة 1 — إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساب مجاني.
2. أنشئ **مشروع جديد** (New Project) — اختر اسم وكلمة مرور لقاعدة البيانات واحفظها.
3. انتظر حتى يصبح المشروع جاهزًا (دقيقتين تقريبًا).

### الخطوة 2 — تشغيل ملف SQL لإنشاء الجداول

1. من لوحة Supabase، اذهب إلى **SQL Editor** (في الشريط الجانبي).
2. اضغط **New query**.
3. افتح الملف `supabase/migrations/001_schema.sql` من هذا المشروع، **انسخ كل محتواه**.
4. الصقه في SQL Editor واضغط **Run**.
5. تأكد من عدم وجود أخطاء — سترى رسالة "Success".

هذا الملف سيقوم بـ:
- إنشاء جميع الجداول (products, categories, posts, pages, navigation, settings)
- إنشاء Storage Bucket باسم `media` لرفع الصور
- إدراج بيانات افتراضية (تصنيفات، قائمة تنقل، إعدادات أساسية)

### الخطوة 3 — جلب مفاتيح Supabase

من لوحة Supabase:
1. اذهب إلى **Project Settings → API**.
2. ستجد:
   - **Project URL** → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (في "Project API keys", اضغط Reveal) → هذا هو `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **مهم**: `service_role key` سري جدًا — لا تشاركه أبدًا أو تضعه في كود عام (Frontend). نستخدمه فقط في السيرفر.

### الخطوة 4 — تجهيز ملف البيئة `.env`

1. في جذر المشروع، أنشئ ملف اسمه `.env.local` (أو انسخ `.env.example` وأعد تسميته).
2. عبّئ القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChooseAStrongPassword123!
NEXTAUTH_SECRET=أي-نص-عشوائي-طويل-32-حرف-على-الأقل

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=NovaMint Creative
```

> `ADMIN_EMAIL` و `ADMIN_PASSWORD` هما بيانات تسجيل الدخول لـ `/admin/login`. غيّرهما لاحقًا متى شئت بتعديل المتغيرات في Vercel وإعادة النشر.

### الخطوة 5 — التشغيل محليًا (اختياري للتجربة)

```bash
npm install
npm run dev
```

افتح `http://localhost:3000` للموقع، و `http://localhost:3000/admin/login` للوحة التحكم.

### الخطوة 6 — رفع المشروع إلى GitHub

```bash
git init
git add .
git commit -m "Initial commit - NovaMint CMS"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### الخطوة 7 — النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل دخول بـ GitHub.
2. اضغط **Add New → Project** واختر المستودع (Repo) الذي رفعته.
3. في خطوة **Environment Variables**، أضف كل المتغيرات الموجودة في `.env.local` (نفس الأسماء والقيم).
4. اضغط **Deploy**.
5. بعد النشر، ستحصل على رابط مثل `https://your-project.vercel.app`.
6. حدّث `NEXT_PUBLIC_SITE_URL` في Vercel ليطابق هذا الرابط (أو الدومين الخاص بك)، ثم أعد النشر (Redeploy).

### الخطوة 8 — ربط دومين خاص (اختياري)

من إعدادات المشروع في Vercel → **Domains** → أضف دومينك واتبع تعليمات DNS.

---

## 4. تسجيل الدخول إلى لوحة التحكم

اذهب إلى: `https://yourdomain.com/admin/login`

استخدم `ADMIN_EMAIL` و `ADMIN_PASSWORD` التي وضعتها في `.env`.

---

## 5. كيف تستخدم لوحة التحكم (بدون كود)

### إضافة منتج جديد
`Admin → Products → Add Product`
- اكتب العنوان (Slug يتولد تلقائيًا)
- ارفع صورة بالسحب والإفراج (Drag & Drop)
- اختر التصنيف، السعر، رابط Payhip
- في تبويب **SEO**: عدّل Meta Title / Description / Keywords
- اضبط الحالة (Draft/Published) ثم **Save**
- صفحة الهبوط تُنشأ تلقائيًا على `/products/your-slug` مع Schema Markup كامل

### إدارة التصنيفات
`Admin → Categories` — أضف/عدّل/حذف، مع صورة لكل تصنيف.

### المدونة
`Admin → Blog → New Post` — العنوان، الصورة، المحتوى (يدعم HTML بسيط: `<h2>`, `<p>`, `<ul>`, `<strong>`, `<a>`, `<img>`)، وإعدادات SEO.

### الصفحات (Page Builder بالسحب والإفراج)
`Admin → Pages → New Page`
- أضف أقسامًا (Hero, Text, Image, CTA, Features, Testimonial, Spacer)
- اسحب لإعادة الترتيب
- عدّل كل قسم مباشرة
- احفظ — الصفحة تظهر على `/pages/your-slug`

### القائمة الرئيسية (Navigation)
`Admin → Navigation` — أضف روابط، اسحب لإعادة الترتيب، احفظ.

### الصفحة الرئيسية
`Admin → Homepage` — عدّل عنوان Hero، الصورة، وفعّل/عطّل الأقسام (منتجات مميزة، تصنيفات، أحدث المقالات...).

### الإعدادات العامة
`Admin → Settings`
- **General**: اسم الموقع، الشعار، Favicon
- **SEO**: الوصف الافتراضي، تخصيص Robots.txt
- **Social**: روابط التواصل الاجتماعي
- **Advanced**: Google Analytics ID، أكواد مخصصة في `<head>`

---

## 6. SEO التلقائي

- **Sitemap**: `https://yourdomain.com/sitemap.xml` — يتجدد تلقائيًا مع كل منتج/مقال/صفحة منشورة.
- **Robots.txt**: `https://yourdomain.com/robots.txt` — قابل للتخصيص من الإعدادات.
- **Schema Markup**: كل منتج يحتوي على `Product` Schema (JSON-LD) تلقائيًا، وكل مقال على `BlogPosting` Schema.
- **Meta Tags**: قابلة للتعديل لكل منتج/مقال/صفحة من لوحة التحكم.

---

## 7. تغيير لغة الموقع

الموقع مبني بالإنجليزية افتراضيًا. لإضافة لغات أخرى (عربي/فرنسي) لاحقًا، الخيار الأسهل هو:
1. ترجمة النصوص الثابتة (Header, Footer, أزرار) عبر مكتبة مثل `next-intl`.
2. لمحتوى المنتجات/المقالات: أضف حقول إضافية في Supabase (مثل `title_ar`, `description_ar`) وأضف مبدّل لغة في الواجهة.

هذا تحسين مستقبلي يمكن تنفيذه دون التأثير على البنية الحالية — لوحة التحكم تبقى كما هي.

---

## 8. ملاحظات أمان مهمة

- لا تشارك `SUPABASE_SERVICE_ROLE_KEY` أو `ADMIN_PASSWORD` مع أي شخص.
- `/admin/*` محمي بـ Middleware — أي زائر بدون تسجيل دخول يُعاد توجيهه لصفحة Login.
- يفضّل استخدام كلمة مرور قوية وتغييرها بشكل دوري عبر متغيرات البيئة في Vercel.

---

## 9. إضافة مئات المنتجات

كل ما عليك:
1. `Admin → Products → Add Product`
2. عبّئ البيانات، ارفع الصورة، احفظ
3. صفحة الهبوط + الإدراج في Sitemap يحدث تلقائيًا

لا حاجة لأي تعديل كود مهما زاد عدد المنتجات أو المقالات أو الصفحات.

---

## 10. الدعم الفني

إن واجهت مشكلة في النشر أو قاعدة البيانات، تحقق من:
- أن جميع متغيرات `.env` صحيحة في Vercel
- أن ملف SQL تم تنفيذه بالكامل في Supabase دون أخطاء
- أن Storage Bucket باسم `media` موجود وعام (Public) — تحقق من `Storage` في Supabase
