import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma.service';

dotenv.config();

type JwtPayload = {
  sub: string; // e.g. "auth0|abc123" or "google-oauth2|xyz"
  iss: string;
  aud: string | string[];
  scope?: string;
};

export interface JwtUser {
  userId: string;
  provider: string;
  providerId: string;
  sub: string;
  scopes: string[];
}

function splitSub(sub: string) {
  // "provider|id" → { provider, providerId }
  const [provider, ...rest] = sub.split('|');
  return { provider, providerId: rest.join('|') };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    // You can see the JWT here
    console.log('JWT payload', payload);

    const { sub } = payload;
    const { provider, providerId } = splitSub(sub);

    // 1) Find Authentication by provider+providerId
    let auth = await this.prisma.authentication.findFirst({
      where: { provider, providerId },
      include: { user: true },
    });

    // 2) If missing, create User + Authentication (using whatever claims we have)
    if (!auth) {
      await this.prisma.user.create({
        data: {
          email: (payload as any).email || `${providerId}@auth0.user`,
          password: '', // No password for OAuth users
          firstName: (payload as any).given_name || 'User',
          lastName: (payload as any).family_name || 'Name',
          name: (payload as any).name || null,
          emailVerified: (payload as any).email_verified ? new Date() : null,
          authentications: {
            create: {
              provider,
              providerId,
            },
          },
        },
      });
      auth = await this.prisma.authentication.findFirst({
        where: { provider, providerId },
        include: { user: true },
      });
    } else {
      // 3) Update user profile fields opportunistically (don't overwrite with nulls)
      const updateData: Record<string, any> = {};
      if ((payload as any).name && !auth.user.name) {
        updateData.name = (payload as any).name;
      }
      if ((payload as any).email_verified && !auth.user.emailVerified) {
        updateData.emailVerified = new Date();
      }
      if (Object.keys(updateData).length > 0) {
        await this.prisma.user.update({
          where: { id: auth.userId },
          data: updateData,
        });
      }
    }

    return {
      userId: auth!.userId,
      provider,
      providerId,
      sub,
      scopes: (payload.scope ?? '').split(' ').filter(Boolean),
    } as JwtUser;
  }
}
