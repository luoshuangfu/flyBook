import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getManagedProfile, saveManagedProfile } from "../api/adminStore";
import { type ProfileFormValues, profileSchema } from "../lib/adminSchemas";

function AdminProfilePage() {
  const profile = useMemo(() => getManagedProfile(), []);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarText: profile.avatarText,
      siteName: profile.siteName,
      name: profile.name,
      bio: profile.bio,
      birthday: profile.birthday,
      github: profile.github,
      email: profile.email,
      location: profile.location,
      skillText: profile.skills.join("，"),
      showAvatar: profile.showAvatar,
      showName: profile.showName,
      showBio: profile.showBio,
      showBirthday: profile.showBirthday,
      showGithub: profile.showGithub,
      showEmail: profile.showEmail,
    },
  });

  const preview = watch();
  const skills = preview.skillText
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  function onSubmit(values: ProfileFormValues) {
    saveManagedProfile({
      avatarText: values.avatarText,
      siteName: values.siteName,
      name: values.name,
      bio: values.bio,
      birthday: values.birthday,
      github: values.github,
      email: values.email,
      location: values.location,
      skills,
      showAvatar: values.showAvatar,
      showName: values.showName,
      showBio: values.showBio,
      showBirthday: values.showBirthday,
      showGithub: values.showGithub,
      showEmail: values.showEmail,
    });
    setMessage("个人信息已保存");
  }

  return (
    <section className="admin-page-stack">
      <div className="admin-two-column">
        <form className="hand-drawn-card admin-form admin-panel" onSubmit={handleSubmit(onSubmit)}>
          <h3>个人信息管理</h3>
          <div className="admin-grid-2">
            <label className="admin-field">
              <span>站点名称</span>
              <input {...register("siteName")} placeholder="例如：手绘风个人博客" />
              {errors.siteName ? <p className="error-text">{errors.siteName.message}</p> : null}
            </label>
            <label className="admin-field">
              <span>昵称</span>
              <input {...register("name")} placeholder="例如：手绘风博主" />
              {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
            </label>
          </div>

          <div className="admin-grid-2">
            <label className="admin-field">
              <span>头像文字</span>
              <input
                {...register("avatarText")}
                onChange={(event) => setValue("avatarText", event.target.value.slice(0, 3))}
                placeholder="最多 3 个字"
                value={preview.avatarText}
              />
              {errors.avatarText ? <p className="error-text">{errors.avatarText.message}</p> : null}
            </label>
            <label className="admin-field">
              <span>地点</span>
              <input {...register("location")} placeholder="例如：上海" />
              {errors.location ? <p className="error-text">{errors.location.message}</p> : null}
            </label>
          </div>

          <label className="admin-field">
            <span>个人简介</span>
            <textarea {...register("bio")} placeholder="简单介绍自己和博客内容" rows={4} />
            {errors.bio ? <p className="error-text">{errors.bio.message}</p> : null}
          </label>

          <div className="admin-grid-2">
            <label className="admin-field">
              <span>邮箱</span>
              <input {...register("email")} placeholder="例如：you@example.com" type="email" />
              {errors.email ? <p className="error-text">{errors.email.message}</p> : null}
            </label>
            <label className="admin-field">
              <span>GitHub 地址</span>
              <input {...register("github")} placeholder="例如：https://github.com/yourname" />
              {errors.github ? <p className="error-text">{errors.github.message}</p> : null}
            </label>
          </div>

          <label className="admin-field">
            <span>生日</span>
            <input {...register("birthday")} type="date" />
            {errors.birthday ? <p className="error-text">{errors.birthday.message}</p> : null}
          </label>

          <label className="admin-field">
            <span>技能标签</span>
            <input {...register("skillText")} placeholder="例如：React，Spring Boot，写作" />
          </label>

          <div className="admin-field">
            <span>显示设置</span>
            <div className="admin-check-grid">
              {[
                ["showAvatar", "显示头像"],
                ["showName", "显示昵称"],
                ["showBio", "显示简介"],
                ["showBirthday", "显示生日"],
                ["showGithub", "显示 GitHub"],
                ["showEmail", "显示邮箱"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={`admin-check-card${
                    preview[key as keyof ProfileFormValues] ? " active" : ""
                  }`}
                >
                  <input {...register(key as keyof ProfileFormValues)} type="checkbox" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "保存中..." : "保存个人信息"}
          </button>
          {message ? <p>{message}</p> : null}
        </form>

        <section className="hand-drawn-card admin-panel">
          <h3>预览效果</h3>
          <div className="admin-profile-preview">
            {preview.showAvatar ? <div className="avatar-circle">{preview.avatarText}</div> : null}
            {preview.showName ? <h4>{preview.name}</h4> : null}
            <p className="admin-muted">{preview.siteName}</p>
            {preview.showBio ? <p>{preview.bio}</p> : null}
            <div className="tag-row">
              {skills.map((skill) => (
                <span key={skill} className="tag-pill">
                  {skill}
                </span>
              ))}
            </div>
            <div className="profile-list">
              <div>地点：{preview.location}</div>
              {preview.showBirthday ? <div>生日：{preview.birthday}</div> : null}
              {preview.showGithub ? <div>GitHub：{preview.github}</div> : null}
              {preview.showEmail ? <div>邮箱：{preview.email}</div> : null}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default AdminProfilePage;
