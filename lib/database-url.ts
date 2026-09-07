export function parseMysqlDatabaseUrl(value: string | undefined, variableName: string) {
  const error = `${variableName} must contain a complete MySQL connection URL`;
  if (!value) throw new Error(error);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(error);
  }

  if (url.protocol !== "mysql:" || !url.hostname || !url.username || !url.password || url.pathname === "/") {
    throw new Error(error);
  }
  return value;
}
