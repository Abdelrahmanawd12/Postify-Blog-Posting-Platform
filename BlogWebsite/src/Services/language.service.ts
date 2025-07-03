import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  currentlang!:'en'|'ar'
 texts = {
    en: {
      home: 'Home',
      login: 'Login',
      logout: 'Logout',
      account: 'Account',
      addPost: 'Add Post',
      searchPlaceholder: 'Search by tag or title',
      changeLang: 'Change Language',
      createNewPost: 'Create New Post',
      Title: 'Title',
      PostContent: 'Post Content',
      tags: 'Tags',
      write_a_post_congtent_here: 'Write a post content here',
      add_a_tag: 'Add a tag',
      publisPost: 'Publish Post',
      cancel: 'Cancel',
      uploadimage: 'Upload Image',
      removeimage: 'Remove Image',
      enter_post_title: 'Enter post title',
      chose_a_image: 'Choose an image',
      imagePreview: 'Image Preview',
      Titleisrequired: 'Title is required',
      Title_must_be_at_least_2_characters_long: 'Title must be at least 2 characters long',
      Body_is_required: 'Body is required',
      Body_must_be_at_least_5_characters_long: 'Body must be at least 5 characters long',
      Postify: 'Postify',
      Like: 'Like',
      Dislike: 'Dislike',
      Viewpost: 'View Post',

    },
    ar: {
      home: 'الصفحة الرئيسيه',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      account: 'الصفحة الشخصية',
      addPost: 'اضافة منشور',
      searchPlaceholder: 'البحث عن طريق العنوان',
      changeLang: 'تغير اللغة',
      createNewPost: 'إنشاء منشور جديد',
      Title: 'عنوان',
      PostContent: 'محتوى المنشور',
      tags: 'الوسوم',
      write_a_post_congtent_here: 'اكتب محتوى المنشور هنا',
      add_a_tag: 'إضافة وسم',
      publisPost: 'نشر المنشور',
      cancel: 'إلغاء',
      uploadimage: 'تحميل صورة',
      enter_post_title: 'أدخل عنوان المنشور',
      removeimage: 'إزالة الصورة',
      chose_a_image: 'اختر صورة',
      imagePreview: 'معاينة الصورة',
      Titleisrequired: 'العنوان مطلوب',
      Title_must_be_at_least_2_characters_long: 'يجب أن يكون العنوان مكونًا من حرفين على الأقل',
      Body_is_required: 'محتوى المنشور مطلوب',
      Body_must_be_at_least_5_characters_long: 'يجب أن يكون محتوى المنشور مكونًا من 5 أحرف على الأقل',
      Postify: 'بوستيفاي',
      Like: 'إعجاب',
      Dislike: 'عدم إعجاب',
      Viewpost: 'عرض المنشور',

    }
  };

  getText(key: keyof typeof this.texts['en']) {
    return this.texts[this.currentlang][key];
  }


  constructor() { }
}
