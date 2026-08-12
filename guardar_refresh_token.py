path = "src/auth.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
      }
      return token;
    },'''

new = '''    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
        if (account.refresh_token) {
          await prisma.configuracion.upsert({
            where: { clave: "google_refresh_token" },
            update: { valor: account.refresh_token },
            create: { clave: "google_refresh_token", valor: account.refresh_token },
          });
        }
      }
      return token;
    },'''

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("OK")
