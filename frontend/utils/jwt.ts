import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

const jwtSecret = process.env.JWT_SECRET;
const jwtIssuer = process.env.JWT_ISSUER ?? "nisir-web";
const jwtAudience = process.env.JWT_AUDIENCE ?? "nisir-web";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

function getJwtKey() {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return encoder.encode(jwtSecret);
}

export type AuthTokenClaims = {
  userId: string;
  email: string;
  fullName: string;
};

export async function signAuthToken(claims: AuthTokenClaims) {
  return new SignJWT({ email: claims.email, fullName: claims.fullName })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setIssuer(jwtIssuer)
    .setAudience(jwtAudience)
    .setExpirationTime(jwtExpiresIn)
    .sign(getJwtKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenClaims> {
  const { payload } = await jwtVerify(token, getJwtKey(), {
    algorithms: ["HS256"],
    issuer: jwtIssuer,
    audience: jwtAudience,
  });

  const userId = payload.sub;
  const email = payload.email;
  const fullName = payload.fullName;

  if (
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof fullName !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return { userId, email, fullName };
}

export function getJwtExpirationSeconds() {
  const overrideValue = Number(process.env.AUTH_COOKIE_MAX_AGE_SECONDS);

  if (Number.isFinite(overrideValue) && overrideValue > 0) {
    return Math.floor(overrideValue);
  }

  return 60 * 60 * 24 * 7;
}
