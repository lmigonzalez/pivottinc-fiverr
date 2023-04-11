export const signin = async (user) => {
  // console.log(name, email, password);
  try {
    const response = await fetch(`http://staging-2023-03-30.pivottinc.com:8000/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else return false;
};


export const signout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    try {
      const res = await fetch(`http://staging-2023-03-30.pivottinc.com:8000/auth/signout`, {
        method: "POST",
      });
      console.log("SignOut", res);
    } catch (err) {
      return console.log(err);
    }
  }
};
