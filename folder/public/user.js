// user.js
// classes are blueprints for creating objects
class User {
  constructor(fullname, uid, email, profilePic) {
    this.fullname = fullname;
    this.uid = uid;
    this.email = email;
    this.profilePic = profilePic;
  }

  saveUser() {
    const user = {
      fullname: this.fullname, // was this.name — fixed, constructor sets fullname
      uid: this.uid,
      email: this.email,
      profilePic: this.profilePic,
    };
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Rebuilds a User instance from whatever saveUser() last stored
  static getSavedUser() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return new User(data.fullname, data.uid, data.email, data.profilePic);
  }

  static clearSavedUser() {
    localStorage.removeItem("user");
  }
}

export default User;