import { NextResponse } from "next/server";

/**
 * Email capture endpoint.
 *
 * Right now this only validates the address and logs it to the server console -
 * enough to wire up the form and test it locally. When you pick a provider,
 * replace the TODO block with a call to their API and store the key in
 * .env.local (see .env.example).
 *
 * Good options: Resend Audiences, ConvertKit, Mailchimp, Buttondown.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email: unknown;

  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json(
      { error: "That request didn't come through. Try again." },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  // TODO: send `email` to your list provider here.
  console.log("[subscribe]", email.trim().toLowerCase());

  return NextResponse.json({ ok: true });
}
