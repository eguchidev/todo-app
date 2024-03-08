import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
callbacks: {
    jwt({ token, user, account, profile }) {
      if (user) {
        token.access_token = user.access_token;
      }
      return token
    },
    session({ session, token, user }) {
      session.user.access_token = token
      return session
    }  
  },
});
