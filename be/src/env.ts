export enum EnvironmentVariable {
  Port,
  JwtSecret,
  JwtExpireTime,
  NodeEnv
}

const config = {
  [EnvironmentVariable.Port]: () => Number(process.env.PORT || 3001),
  [EnvironmentVariable.JwtSecret]: () => process.env["JWT_SECRET"]!,
  [EnvironmentVariable.JwtExpireTime]: () =>
    process.env["JWT_EXPIRE_TIME"] || "1h",
  [EnvironmentVariable.NodeEnv]: () =>
    (process.env["NODE_ENV"] || "development").toLowerCase()
};

export const getEnv = (key: EnvironmentVariable) => config[key]();
