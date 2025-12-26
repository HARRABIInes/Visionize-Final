import { apiFetch, setAuthToken, getStoredSession } from "./api";

export const signUpApi = async ({ email, password, firstName, lastName, profession, birthDate }) => {
  const data = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName, profession, birthDate })
  });
  // After signup, we sign in to get token
  const signin = await signInApi({ email, password });
  return { user: signin.user, token: signin.token };
};

export const signInApi = async ({ email, password }) => {
  const data = await apiFetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  setAuthToken(data.token, data.user);
  return data;
};

export const getSession = () => getStoredSession();
