import { SignJWT, jwtVerify } from "jose";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { protectedRouteAsync } from "@/state/api/ApiSlice";

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
  id: string;
  email: string;
  fullName: string;
};

export async function signAuthToken(claims: AuthTokenClaims) {
  return new SignJWT({ email: claims.email, fullName: claims.fullName })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.id)
    .setIssuedAt()
    .setIssuer(jwtIssuer)
    .setAudience(jwtAudience)
    .setExpirationTime(jwtExpiresIn)
    .sign(getJwtKey());
}

export const verifyAuthToken = async (): Promise<AuthTokenClaims> => {
  const dispatch = useDispatch<AppDispatch>();
  try {
    const response = await dispatch(protectedRouteAsync()).unwrap();

    return { response } as unknown as AuthTokenClaims;
  } catch (error: any) {
    return error.response?.data?.message || "Token verification failed";
  }
};

export function getJwtExpirationSeconds() {
  const overrideValue = Number(process.env.AUTH_COOKIE_MAX_AGE_SECONDS);

  if (Number.isFinite(overrideValue) && overrideValue > 0) {
    return Math.floor(overrideValue);
  }

  return 60 * 60 * 24 * 7;
}
