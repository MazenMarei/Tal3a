# Owners Canister - مدير الأصحاب والإدارة

## نظرة عامة / Overview

Owners Canister هو canister مخصص لإدارة مالكي المنصة ومشرفي المجموعات في منصة Tal3a الرياضية. يوفر نظاماً شاملاً للصلاحيات والإدارة.

The Owners Canister is dedicated to managing platform owners and group administrators in the Tal3a sports platform. It provides a comprehensive system for permissions and administration.

## الميزات الأساسية / Core Features

### إدارة المالكين / Owner Management

- **إضافة مالكين جدد**: إضافة مالكين جدد بصلاحيات مختلفة
- **إزالة المالكين**: إزالة المالكين من النظام
- **تحديث الصلاحيات**: تعديل صلاحيات المالكين الموجودين
- **عرض المعلومات**: عرض معلومات جميع المالكين أو المالك الحالي

### إدارة مشرفي المجموعات / Group Admin Management

- **إضافة مشرفين**: تعيين مشرفين للمجموعات المختلفة
- **إزالة المشرفين**: إزالة المشرفين من المجموعات
- **إدارة الصلاحيات**: تحديد صلاحيات المشرفين لكل مجموعة
- **عرض المشرفين**: عرض قائمة مشرفي كل مجموعة

## أنواع المستخدمين / User Types

### أدوار المالكين / Owner Roles

```rust
enum OwnerRole {
    SuperAdmin,  // مدير عام - صلاحيات كاملة
    Admin,       // مدير - صلاحيات محدودة
    Moderator,   // مشرف - صلاحيات أساسية
}
```

### صلاحيات النظام / System Permissions

```rust
enum Permission {
    ManageOwners,         // إدارة المالكين
    ManageGroups,         // إدارة المجموعات
    ManageUsers,          // إدارة المستخدمين
    ModerateContent,      // مراقبة المحتوى
    ViewAnalytics,        // عرض الإحصائيات
    SystemConfiguration, // إعدادات النظام
}
```

### صلاحيات المجموعات / Group Permissions

```rust
enum GroupPermission {
    ManageMembers,       // إدارة الأعضاء
    ModerateContent,     // مراقبة المحتوى
    ManageEvents,        // إدارة الأحداث
    ConfigureGroup,      // إعدادات المجموعة
    ViewGroupAnalytics,  // إحصائيات المجموعة
}
```

## API Endpoints

### إدارة المالكين / Owner Management

#### إضافة مالك جديد / Add Owner

```candid
add_owner : (principal, text, OwnerRole, vec Permission) -> (variant { Ok; Err : text })
```

- **principal**: معرف المالك الجديد
- **text**: اسم المالك
- **OwnerRole**: دور المالك
- **vec Permission**: قائمة الصلاحيات

#### إزالة مالك / Remove Owner

```candid
remove_owner : (principal) -> (variant { Ok; Err : text })
```

#### عرض جميع المالكين / Get All Owners

```candid
get_all_owners : () -> (variant { Ok : vec Owner; Err : text }) query
```

#### معلومات المالك الحالي / Get My Owner Info

```candid
get_my_owner_info : () -> (variant { Ok : Owner; Err : text }) query
```

#### تحديث صلاحيات المالك / Update Owner Permissions

```candid
update_owner_permissions : (principal, vec Permission) -> (variant { Ok; Err : text })
```

### إدارة مشرفي المجموعات / Group Admin Management

#### إضافة مشرف مجموعة / Add Group Admin

```candid
add_group_admin : (nat64, principal, text, vec GroupPermission) -> (variant { Ok; Err : text })
```

- **nat64**: معرف المجموعة
- **principal**: معرف المشرف
- **text**: اسم المشرف
- **vec GroupPermission**: صلاحيات المجموعة

#### إزالة مشرف مجموعة / Remove Group Admin

```candid
remove_group_admin : (nat64, principal) -> (variant { Ok; Err : text })
```

#### عرض مشرفي المجموعة / Get Group Admins

```candid
get_group_admins : (nat64) -> (variant { Ok : vec GroupAdmin; Err : text }) query
```

#### معلومات إدارة المجموعات للمستخدم الحالي / Get My Group Admin Info

```candid
get_my_group_admin_info : () -> (vec GroupAdmin) query
```

#### تحديث صلاحيات مشرف المجموعة / Update Group Admin Permissions

```candid
update_group_admin_permissions : (nat64, principal, vec GroupPermission) -> (variant { Ok; Err : text })
```

### التحقق من الصلاحيات / Permission Checks

#### التحقق من كون المستخدم مالك / Check if Owner

```candid
is_owner : (principal) -> (bool) query
```

#### التحقق من كون المستخدم مشرف مجموعة / Check if Group Admin

```candid
is_group_admin : (nat64, principal) -> (bool) query
```

## البنية التقنية / Technical Structure

### تخزين البيانات / Data Storage

- **Memory ID 50**: تخزين بيانات المالكين
- **Memory ID 51**: تخزين بيانات مشرفي المجموعات

### الأمان / Security

- جميع العمليات تتطلب التحقق من الصلاحيات
- المالكون فقط يمكنهم إدارة المالكين الآخرين
- مشرفو المجموعات يمكنهم إدارة مجموعاتهم فقط

### التكامل / Integration

- يتكامل مع user_canister لإدارة المستخدمين
- يتكامل مع social_canister لإدارة المجموعات
- يوفر واجهة للتحقق من الصلاحيات لجميع الـ canisters الأخرى

## أمثلة الاستخدام / Usage Examples

### إضافة مالك جديد / Adding a New Owner

```bash
dfx canister call owners_canister add_owner '(
  principal "rdmx6-jaaaa-aaaah-qcaiq-cai",
  "أحمد محمد",
  variant { Admin },
  vec { variant { ManageGroups }; variant { ModerateContent } }
)'
```

### إضافة مشرف مجموعة / Adding a Group Admin

```bash
dfx canister call owners_canister add_group_admin '(
  1 : nat64,
  principal "rdmx6-jaaaa-aaaah-qcaiq-cai",
  "مشرف المجموعة الأولى",
  vec { variant { ManageMembers }; variant { ModerateContent } }
)'
```

### التحقق من الصلاحيات / Checking Permissions

```bash
dfx canister call owners_canister is_owner '(principal "rdmx6-jaaaa-aaaah-qcaiq-cai")'
dfx canister call owners_canister is_group_admin '(1 : nat64, principal "rdmx6-jaaaa-aaaah-qcaiq-cai")'
```

## الإعداد والنشر / Setup and Deployment

### التهيئة الأولية / Initial Setup

عند نشر الـ canister للمرة الأولى، يتم تلقائياً:

- إضافة منشئ الـ canister كـ SuperAdmin
- منح جميع الصلاحيات للـ SuperAdmin الأول

### متطلبات النشر / Deployment Requirements

- Rust toolchain
- dfx CLI tool
- Internet Computer network access

### أوامر النشر / Deployment Commands

```bash
# بناء الـ canister
dfx build owners_canister

# نشر الـ canister
dfx deploy owners_canister

# التحقق من حالة الـ canister
dfx canister status owners_canister
```

## ملاحظات التطوير / Development Notes

- يستخدم ic-stable-structures لتخزين البيانات الثابت
- جميع البيانات محفوظة عبر التحديثات
- نظام الصلاحيات قابل للتوسع والتخصيص
- يدعم إدارة متعددة المستويات للمنصة

## الأمان والاعتبارات / Security Considerations

- التحقق من الصلاحيات في كل عملية
- تسجيل جميع العمليات مع الطوابع الزمنية
- حماية من العمليات غير المصرح بها
- نظام هرمي للصلاحيات يمنع التلاعب

---

تم تطوير هذا الـ canister كجزء من منصة Tal3a الرياضية لتوفير نظام إدارة شامل ومرن.

This canister was developed as part of the Tal3a sports platform to provide a comprehensive and flexible management system.
