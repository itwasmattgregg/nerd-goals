export const stripUserFromEmail = (email: string): string => {
  return email.substring(0, email.lastIndexOf("@"));
};
