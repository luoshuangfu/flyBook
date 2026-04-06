import { getManagedProfile } from "../api/adminStore";

function ProfileCard() {
  const {
    avatarText,
    name,
    bio,
    birthday,
    github,
    email,
    showAvatar,
    showName,
    showBio,
    showBirthday,
    showGithub,
    showEmail,
  } = getManagedProfile();

  if (!showAvatar && !showName && !showBio && !showBirthday && !showGithub && !showEmail) {
    return null;
  }

  return (
    <section className="hand-drawn-card profile-card">
      {showAvatar && <div className="avatar-circle">{avatarText}</div>}
      {showName && <h3>{name}</h3>}
      {showBio && <p>{bio}</p>}
      <div className="profile-list">
        {showBirthday && <div>生日：{birthday}</div>}
        {showGithub && (
          <div>
            GitHub：<a href={github}>{github}</a>
          </div>
        )}
        {showEmail && <div>邮箱：{email}</div>}
      </div>
    </section>
  );
}

export default ProfileCard;
