
import { TokenInvalidError } from './TokenInvalidError';

export class JwtMalformatedTokenError extends TokenInvalidError {
  constructor(...args) {
    super(...args);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JwtMalformatedTokenError);
    }
  }
}
