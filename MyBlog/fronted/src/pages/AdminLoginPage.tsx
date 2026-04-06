import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLogin } from "../api/admin";
import { type LoginFormValues, loginSchema } from "../lib/adminSchemas";

function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: "admin123",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await adminLogin(values.username, values.password);
      localStorage.setItem("myblog_admin_token", result.token);
      navigate("/admin/posts");
    } catch {
      setError("root", {
        message: "登录失败，请检查账号密码",
      });
    }
  }

  return (
    <section className="admin-login-wrap">
      <form className="hand-drawn-card admin-form admin-login-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="admin-form-title">
          <h2>后台登录</h2>
          <p>请输入管理员账号后进入内容管理后台。</p>
        </div>
        <label className="admin-field">
          <span>用户名</span>
          <input {...register("username")} />
          {errors.username ? <p className="error-text">{errors.username.message}</p> : null}
        </label>
        <label className="admin-field">
          <span>密码</span>
          <input {...register("password")} type="password" />
          {errors.password ? <p className="error-text">{errors.password.message}</p> : null}
        </label>
        {errors.root ? <p className="error-text">{errors.root.message}</p> : null}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "登录中..." : "登录"}
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
