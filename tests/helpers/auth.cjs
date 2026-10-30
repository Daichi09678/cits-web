const { NextResponse } = require("next/server");
const { load } = require("./load.cjs");

function createTestAuth(secret = "qa-secret") {
  const accounts = new Map();
  const access = load("lib/internalAccess.ts");
  const auth = load(
    "lib/apiAuth.ts",
    {
      "next/server": { NextResponse },
      "./internalAccess": access,
      "./internalAccountsServer": { findInternalAccountById: async (id) => accounts.get(id) || null },
    },
    { Buffer, process: { env: { ADMIN_AUTH_SECRET: secret } } }
  );
  const issue = auth.issueAdminToken;
  return {
    ...auth,
    accounts,
    issueAdminToken(input) {
      if (input.role === "internal")
        accounts.set(input.sub, {
          id: input.sub,
          name: input.name,
          email: input.email,
          pageAccess: input.pageAccess,
          permissions: input.permissions,
          isActive: true,
        });
      return issue(input);
    },
  };
}

module.exports = { createTestAuth };
