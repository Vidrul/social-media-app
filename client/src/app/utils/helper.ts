export function displayGreeting() {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 11
    ? "Good morning"
    : hours >= 11 && hours < 18
    ? "Good afternoon"
    : hours >= 18 && hours <= 23
    ? "Good evening"
    : "Good night";
}

export function createErrorMessage(message: string) {
  switch (message) {
    case "EMAIL_NOT_FOUND":
      return "Email not found please try again!";
    case "INVALID_PASSWORD":
      return "Invalid password!";
    case "EMAIL_EXISTS":
      return "This email is already in use!";
    default:
      break;
  }
}
