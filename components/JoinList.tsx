"use client";

import { useState } from "react";
import styles from "./JoinList.module.css";

type Status = "idle" | "sending" | "done" | "error";

export default function JoinList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data?.error ?? "That didn't go through. Try again.");
        return;
      }

      setStatus("done");
      setMessage("You're on the list. We'll holler when the hat drops.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Try again in a minute.");
    }
  }

  return (
    <section id="join" className="section">
      <div className="wrap">
        <div className={styles.join}>
          <h2>We&apos;re Just Getting Started</h2>
          <p>
            Join the list for the first hat drop, new encyclopedia entries, and whatever
            else we build in this holler. No spam, ever.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className={`btn btn-primary ${styles.submit}`}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Join the list"}
            </button>
          </form>
          {message && (
            <p
              className={`${styles.message} ${status === "error" ? styles.error : ""}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
