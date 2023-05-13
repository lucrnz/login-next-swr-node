export enum EnvironmentVariable {
  Port,
  JwtSecret,
}

const config = {
  [EnvironmentVariable.Port]: () => process.env.PORT || 3001,
  [EnvironmentVariable.JwtSecret]: () => process.env["JWT_SECRET"]!,
};

export const getEnv = (key: EnvironmentVariable) => {
  const getter = config[key];
  return getter();
};
